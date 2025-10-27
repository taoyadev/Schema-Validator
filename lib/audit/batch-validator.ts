import type {
  AuditResult,
  BatchAuditResult,
  AuditProgress,
  AuditSummary,
  AuditConfig,
} from './types';
import type { ValidationResponse } from '../validation/types';

/**
 * Callback for progress updates
 */
export type ProgressCallback = (progress: AuditProgress) => void;

/**
 * Batch validator for multiple URLs
 */
export class BatchValidator {
  private config: AuditConfig;
  private results: AuditResult[] = [];
  private progress: AuditProgress;
  private onProgress?: ProgressCallback;
  private startTime: Date;

  constructor(config: AuditConfig, onProgress?: ProgressCallback) {
    this.config = config;
    this.onProgress = onProgress;
    this.startTime = new Date();
    this.progress = {
      total: config.urls.length,
      completed: 0,
      failed: 0,
      inProgress: 0,
      percentage: 0,
    };
  }

  /**
   * Run batch validation
   */
  async validate(): Promise<BatchAuditResult> {
    this.results = [];
    const urls = this.config.urls;

    // Process URLs in batches to control concurrency
    for (let i = 0; i < urls.length; i += this.config.concurrent) {
      const batch = urls.slice(i, i + this.config.concurrent);
      await this.processBatch(batch);
    }

    const summary = this.generateSummary();

    return {
      results: this.results,
      summary,
      progress: this.progress,
    };
  }

  /**
   * Process a batch of URLs concurrently
   */
  private async processBatch(urls: string[]): Promise<void> {
    const promises = urls.map((url) => this.validateUrl(url));
    await Promise.all(promises);
  }

  /**
   * Validate a single URL
   */
  private async validateUrl(url: string): Promise<void> {
    const startTime = Date.now();

    try {
      this.updateProgress('start');

      const validation = await this.callValidationAPI(url);
      const duration = Date.now() - startTime;

      this.results.push({
        url,
        validation,
        error: null,
        timestamp: new Date(),
        duration,
      });

      this.updateProgress('success');
    } catch (error) {
      const duration = Date.now() - startTime;
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';

      this.results.push({
        url,
        validation: null,
        error: errorMessage,
        timestamp: new Date(),
        duration,
      });

      this.updateProgress('fail');
    }
  }

  /**
   * Call validation API for a URL
   */
  private async callValidationAPI(url: string): Promise<ValidationResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.config.timeout
    );

    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data as ValidationResponse;
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Validation timeout');
        }
        throw error;
      }
      throw new Error('Unknown error during validation');
    }
  }

  /**
   * Update progress tracking
   */
  private updateProgress(
    status: 'start' | 'success' | 'fail'
  ): void {
    if (status === 'start') {
      this.progress.inProgress++;
    } else {
      this.progress.completed++;
      this.progress.inProgress--;

      if (status === 'fail') {
        this.progress.failed++;
      }
    }

    this.progress.percentage = Math.round(
      (this.progress.completed / this.progress.total) * 100
    );

    // Notify progress callback
    if (this.onProgress) {
      this.onProgress({ ...this.progress });
    }
  }

  /**
   * Generate summary statistics
   */
  private generateSummary(): AuditSummary {
    const endTime = new Date();
    const successfulResults = this.results.filter((r) => r.validation !== null);
    const failedResults = this.results.filter((r) => r.error !== null);

    let totalErrors = 0;
    let totalWarnings = 0;
    let totalScore = 0;
    let eligibleCount = 0;

    for (const result of successfulResults) {
      if (result.validation) {
        totalErrors += result.validation.summary.totalErrors;
        totalWarnings += result.validation.summary.totalWarnings;
        totalScore += result.validation.overallScore;

        if (result.validation.summary.richResultsEligible) {
          eligibleCount++;
        }
      }
    }

    const avgScore =
      successfulResults.length > 0
        ? Math.round(totalScore / successfulResults.length)
        : 0;

    return {
      totalUrls: this.results.length,
      successfulUrls: successfulResults.length,
      failedUrls: failedResults.length,
      totalErrors,
      totalWarnings,
      avgScore,
      eligibleForRichResults: eligibleCount,
      startTime: this.startTime,
      endTime,
      duration: endTime.getTime() - this.startTime.getTime(),
    };
  }

  /**
   * Get current progress
   */
  getProgress(): AuditProgress {
    return { ...this.progress };
  }

  /**
   * Get current results
   */
  getResults(): AuditResult[] {
    return [...this.results];
  }
}

/**
 * Utility function to create a batch validation
 */
export async function validateBatch(
  urls: string[],
  options: {
    concurrent?: number;
    timeout?: number;
    onProgress?: ProgressCallback;
  } = {}
): Promise<BatchAuditResult> {
  const config: AuditConfig = {
    urls,
    concurrent: options.concurrent || 5,
    timeout: options.timeout || 30000,
  };

  const validator = new BatchValidator(config, options.onProgress);
  return validator.validate();
}
