import type { ValidationResponse } from '../validation/types';

/**
 * Single URL audit result
 */
export interface AuditResult {
  url: string;
  validation: ValidationResponse | null;
  error: string | null;
  timestamp: Date;
  duration: number; // milliseconds
}

/**
 * Batch audit configuration
 */
export interface AuditConfig {
  urls: string[];
  concurrent: number; // Number of concurrent requests
  timeout: number; // Timeout per URL in ms
}

/**
 * Batch audit progress
 */
export interface AuditProgress {
  total: number;
  completed: number;
  failed: number;
  inProgress: number;
  percentage: number;
}

/**
 * Batch audit summary statistics
 */
export interface AuditSummary {
  totalUrls: number;
  successfulUrls: number;
  failedUrls: number;
  totalErrors: number;
  totalWarnings: number;
  avgScore: number;
  eligibleForRichResults: number;
  startTime: Date;
  endTime: Date;
  duration: number; // total duration in ms
}

/**
 * Complete batch audit result
 */
export interface BatchAuditResult {
  results: AuditResult[];
  summary: AuditSummary;
  progress: AuditProgress;
}

/**
 * Report export format
 */
export type ReportFormat = 'pdf' | 'excel' | 'json';

/**
 * Sitemap URL entry
 */
export interface SitemapUrl {
  loc: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
}

/**
 * Error type classification
 */
export interface ErrorClassification {
  type: string;
  count: number;
  urls: string[];
  severity: 'high' | 'medium' | 'low';
}
