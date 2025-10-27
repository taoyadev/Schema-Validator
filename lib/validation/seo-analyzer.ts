/**
 * Advanced SEO Analysis Engine
 * Provides detailed SEO metrics and actionable improvement suggestions
 */

import {
  ValidationResult,
  SEOAnalysis,
  SEOMetrics,
  ImprovementSuggestion,
  
  ValidationError,
  ValidationWarning,
  SeoImpact,
} from './types';
import { getRulesForSchemaType } from './rules';

export class SEOAnalyzer {
  /**
   * Performs comprehensive SEO analysis on validation results
   */
  analyze(result: ValidationResult): SEOAnalysis {
    const metrics = this.calculateMetrics(result);
    const suggestions = this.generateSuggestions(result);
    const strengths = this.identifyStrengths(result);
    const weaknesses = this.identifyWeaknesses(result);
    const completenessBreakdown = this.calculateCompletenessBreakdown(result);

    return {
      metrics,
      suggestions: this.prioritizeSuggestions(suggestions),
      strengths,
      weaknesses,
      completenessBreakdown,
    };
  }

  /**
   * Calculate detailed SEO metrics
   */
  private calculateMetrics(result: ValidationResult): SEOMetrics {
    const requiredFieldsScore = this.calculateRequiredFieldsScore(result);
    const recommendedFieldsScore = this.calculateRecommendedFieldsScore(result);
    const technicalScore = this.calculateTechnicalScore(result);
    const contentQualityScore = this.calculateContentQualityScore(result);
    const richResultsReadiness = this.calculateRichResultsReadiness(result);

    // Weighted average
    const overallScore = Math.round(
      requiredFieldsScore * 0.35 +
        recommendedFieldsScore * 0.25 +
        technicalScore * 0.15 +
        contentQualityScore * 0.15 +
        richResultsReadiness * 0.1
    );

    return {
      requiredFieldsScore,
      recommendedFieldsScore,
      technicalScore,
      contentQualityScore,
      richResultsReadiness,
      overallScore,
    };
  }

  /**
   * Calculate score for required fields (0-100)
   */
  private calculateRequiredFieldsScore(result: ValidationResult): number {
    const rules = getRulesForSchemaType(result.schema.type);
    const requiredRules = rules.filter((r) => r.required);

    if (requiredRules.length === 0) return 100;

    const requiredErrors = result.errors.filter((e) =>
      requiredRules.some((r) => r.property === e.property)
    );

    const criticalErrors = requiredErrors.filter((e) => e.seoImpact === 'high');
    const mediumErrors = requiredErrors.filter((e) => e.seoImpact === 'medium');
    const lowErrors = requiredErrors.filter((e) => e.seoImpact === 'low');

    // Deduct points based on severity
    let score = 100;
    score -= criticalErrors.length * 25;
    score -= mediumErrors.length * 15;
    score -= lowErrors.length * 5;

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate score for recommended fields (0-100)
   */
  private calculateRecommendedFieldsScore(result: ValidationResult): number {
    const rules = getRulesForSchemaType(result.schema.type);
    const recommendedRules = rules.filter((r) => !r.required);

    if (recommendedRules.length === 0) return 100;

    const recommendedWarnings = result.warnings.filter((w) =>
      recommendedRules.some((r) => r.property === w.property)
    );

    const implementedRecommended =
      recommendedRules.length - recommendedWarnings.length;
    const score = (implementedRecommended / recommendedRules.length) * 100;

    return Math.round(score);
  }

  /**
   * Calculate technical SEO score (0-100)
   */
  private calculateTechnicalScore(result: ValidationResult): number {
    let score = 100;

    // Check for @context and @type
    const hasSyntaxErrors = result.errors.some(
      (e) => e.property === '@context' || e.property === '@type'
    );
    if (hasSyntaxErrors) score -= 40;

    // Check for proper URL formats
    const hasUrlErrors = result.errors.some((e) =>
      e.message.toLowerCase().includes('url')
    );
    if (hasUrlErrors) score -= 10;

    // Check for proper date formats
    const hasDateErrors = result.errors.some((e) =>
      e.message.toLowerCase().includes('date') ||
      e.message.toLowerCase().includes('iso 8601')
    );
    if (hasDateErrors) score -= 10;

    // Check for image requirements
    const hasImageErrors = result.errors.some((e) =>
      e.property.toLowerCase().includes('image')
    );
    if (hasImageErrors) score -= 15;

    return Math.max(0, score);
  }

  /**
   * Calculate content quality score (0-100)
   */
  private calculateContentQualityScore(result: ValidationResult): number {
    let score = 100;
    const schema = result.schema;

    // Check for description
    const hasDescription = 'description' in schema.properties;
    if (!hasDescription) score -= 20;
    else {
      const desc = schema.properties.description as string;
      if (typeof desc === 'string') {
        if (desc.length < 50) score -= 10;
        if (desc.length > 160) score -= 5;
      }
    }

    // Check for image
    const hasImage = 'image' in schema.properties;
    if (!hasImage) score -= 15;

    // Check for author/publisher
    const hasAuthor =
      'author' in schema.properties || 'publisher' in schema.properties;
    if (!hasAuthor) score -= 10;

    // Check for dates
    const hasDates =
      'datePublished' in schema.properties ||
      'dateModified' in schema.properties ||
      'startDate' in schema.properties;
    if (!hasDates) score -= 10;

    return Math.max(0, score);
  }

  /**
   * Calculate rich results readiness (0-100)
   */
  private calculateRichResultsReadiness(result: ValidationResult): number {
    if (!result.richResultsEligible) return 0;

    let score = 100;

    // Deduct for warnings that affect rich results
    const richResultsWarnings = result.warnings.filter(
      (w) => w.seoImpact === 'high' || w.seoImpact === 'medium'
    );

    score -= richResultsWarnings.length * 5;

    return Math.max(0, score);
  }

  /**
   * Generate prioritized improvement suggestions
   */
  private generateSuggestions(
    result: ValidationResult
  ): ImprovementSuggestion[] {
    const suggestions: ImprovementSuggestion[] = [];

    // Convert errors to suggestions
    result.errors.forEach((error, index) => {
      suggestions.push(this.errorToSuggestion(error, index));
    });

    // Convert high-impact warnings to suggestions
    result.warnings.forEach((warning, index) => {
      if (warning.seoImpact === 'high' || warning.seoImpact === 'medium') {
        suggestions.push(this.warningToSuggestion(warning, index));
      }
    });

    return suggestions;
  }

  /**
   * Convert ValidationError to ImprovementSuggestion
   */
  private errorToSuggestion(
    error: ValidationError,
    index: number
  ): ImprovementSuggestion {
    const priority = this.determinePriority(error.seoImpact, true);
    const effort = this.estimateEffort(error.property);
    const impact = this.estimateImpactPoints(error.seoImpact, true);

    return {
      id: `error-${index}`,
      priority,
      category: 'required',
      title: `Fix required field: ${error.property}`,
      description: error.message,
      impact: error.seoImpact,
      effort,
      property: error.property,
      fix: error.fix,
      documentation: error.documentation,
      estimatedImpact: impact,
    };
  }

  /**
   * Convert ValidationWarning to ImprovementSuggestion
   */
  private warningToSuggestion(
    warning: ValidationWarning,
    index: number
  ): ImprovementSuggestion {
    const priority = this.determinePriority(warning.seoImpact, false);
    const effort = this.estimateEffort(warning.property);
    const impact = this.estimateImpactPoints(warning.seoImpact, false);

    return {
      id: `warning-${index}`,
      priority,
      category: 'recommended',
      title: `Add recommended field: ${warning.property}`,
      description: warning.message,
      impact: warning.seoImpact,
      effort,
      property: warning.property,
      fix: warning.fix,
      documentation: warning.documentation,
      estimatedImpact: impact,
    };
  }

  /**
   * Determine priority level
   */
  private determinePriority(
    seoImpact: SeoImpact,
    isRequired: boolean
  ): 'critical' | 'high' | 'medium' | 'low' {
    if (isRequired && seoImpact === 'high') return 'critical';
    if (isRequired && seoImpact === 'medium') return 'high';
    if (isRequired && seoImpact === 'low') return 'medium';
    if (seoImpact === 'high') return 'high';
    if (seoImpact === 'medium') return 'medium';
    return 'low';
  }

  /**
   * Estimate implementation effort
   */
  private estimateEffort(property: string): 'low' | 'medium' | 'high' {
    // Simple properties are low effort
    const simpleProps = [
      'name',
      'title',
      'description',
      'url',
      'datePublished',
      'dateModified',
    ];
    if (simpleProps.some((p) => property.includes(p))) return 'low';

    // Nested objects are medium effort
    if (property.includes('.')) return 'medium';

    // Arrays and complex structures are high effort
    if (property.includes('[')) return 'high';

    return 'medium';
  }

  /**
   * Estimate SEO score impact
   */
  private estimateImpactPoints(
    seoImpact: SeoImpact,
    isRequired: boolean
  ): string {
    if (isRequired) {
      if (seoImpact === 'high') return '+20-25 points';
      if (seoImpact === 'medium') return '+10-15 points';
      return '+5-10 points';
    } else {
      if (seoImpact === 'high') return '+10-15 points';
      if (seoImpact === 'medium') return '+5-10 points';
      return '+2-5 points';
    }
  }

  /**
   * Prioritize suggestions by impact and effort
   */
  private prioritizeSuggestions(
    suggestions: ImprovementSuggestion[]
  ): ImprovementSuggestion[] {
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    const effortOrder = { low: 0, medium: 1, high: 2 };

    return suggestions.sort((a, b) => {
      // First sort by priority
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;

      // Then by effort (lower effort first)
      const effortDiff = effortOrder[a.effort] - effortOrder[b.effort];
      if (effortDiff !== 0) return effortDiff;

      // Finally by impact
      const impactOrder = { high: 0, medium: 1, low: 2 };
      return impactOrder[a.impact] - impactOrder[b.impact];
    });
  }

  /**
   * Identify schema strengths
   */
  private identifyStrengths(result: ValidationResult): string[] {
    const strengths: string[] = [];

    if (result.richResultsEligible) {
      strengths.push('Eligible for Google Rich Results');
    }

    if (result.seoScore >= 90) {
      strengths.push('Excellent SEO score');
    } else if (result.seoScore >= 75) {
      strengths.push('Good SEO score');
    }

    if (result.completeness >= 80) {
      strengths.push('High completeness score');
    }

    const hasAllRequired = result.errors.filter((e) =>
      getRulesForSchemaType(result.schema.type)
        .filter((r) => r.required)
        .some((r) => r.property === e.property)
    ).length === 0;

    if (hasAllRequired) {
      strengths.push('All required fields present');
    }

    if (result.errors.length === 0) {
      strengths.push('No validation errors');
    }

    const hasImage = 'image' in result.schema.properties;
    if (hasImage) {
      strengths.push('Includes image for better visual appeal');
    }

    const hasStructuredData =
      'author' in result.schema.properties ||
      'publisher' in result.schema.properties;
    if (hasStructuredData) {
      strengths.push('Includes authorship information');
    }

    return strengths;
  }

  /**
   * Identify schema weaknesses
   */
  private identifyWeaknesses(result: ValidationResult): string[] {
    const weaknesses: string[] = [];

    if (!result.richResultsEligible) {
      weaknesses.push('Not eligible for Rich Results');
    }

    if (result.seoScore < 50) {
      weaknesses.push('Low SEO score needs improvement');
    }

    if (result.completeness < 50) {
      weaknesses.push('Low completeness - many fields missing');
    }

    const criticalErrors = result.errors.filter((e) => e.seoImpact === 'high');
    if (criticalErrors.length > 0) {
      weaknesses.push(`${criticalErrors.length} critical error(s) detected`);
    }

    const hasNoImage = !('image' in result.schema.properties);
    if (hasNoImage) {
      weaknesses.push('Missing image reduces visual appeal');
    }

    const hasNoDescription = !('description' in result.schema.properties);
    if (hasNoDescription) {
      weaknesses.push('Missing description limits SEO potential');
    }

    return weaknesses;
  }

  /**
   * Calculate completeness breakdown by field type
   */
  private calculateCompletenessBreakdown(result: ValidationResult) {
    const rules = getRulesForSchemaType(result.schema.type);
    const requiredRules = rules.filter((r) => r.required);
    const recommendedRules = rules.filter((r) => !r.required);

    // Calculate required fields
    const requiredErrors = result.errors.filter((e) =>
      requiredRules.some((r) => r.property === e.property)
    );
    const requiredCompleted = requiredRules.length - requiredErrors.length;
    const requiredPercentage =
      requiredRules.length > 0
        ? Math.round((requiredCompleted / requiredRules.length) * 100)
        : 100;

    // Calculate recommended fields
    const recommendedWarnings = result.warnings.filter((w) =>
      recommendedRules.some((r) => r.property === w.property)
    );
    const recommendedCompleted =
      recommendedRules.length - recommendedWarnings.length;
    const recommendedPercentage =
      recommendedRules.length > 0
        ? Math.round((recommendedCompleted / recommendedRules.length) * 100)
        : 100;

    return {
      required: {
        total: requiredRules.length,
        completed: requiredCompleted,
        percentage: requiredPercentage,
      },
      recommended: {
        total: recommendedRules.length,
        completed: recommendedCompleted,
        percentage: recommendedPercentage,
      },
      optional: {
        total: 0,
        completed: 0,
        percentage: 100,
      },
    };
  }
}

/**
 * Singleton instance
 */
export const seoAnalyzer = new SEOAnalyzer();
