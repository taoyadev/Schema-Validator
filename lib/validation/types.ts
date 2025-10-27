/**
 * Core types for Schema Validation Engine
 */

export interface FetchOptions {
  timeout?: number;
  userAgent?: string;
  followRedirects?: boolean;
  maxRedirects?: number;
}

export interface FetchResult {
  html: string;
  finalUrl: string;
  statusCode: number;
  redirectChain: string[];
  fetchTime: number;
}

export interface ParsedSchema {
  type: string;
  context: string;
  properties: Record<string, unknown>;
  rawJson: string;
  location: {
    line?: number;
    scriptTagIndex: number;
  };
}

export type ErrorSeverity = 'error' | 'warning' | 'info';
export type SeoImpact = 'high' | 'medium' | 'low';

export interface ValidationError {
  severity: ErrorSeverity;
  property: string;
  message: string;
  fix: string;
  seoImpact: SeoImpact;
  documentation: string;
}

export interface ValidationWarning extends ValidationError {
  severity: 'warning';
}

export interface ValidationPass {
  property: string;
  message: string;
}

export interface ValidationResult {
  schema: ParsedSchema;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  passed: ValidationPass[];
  completeness: number; // 0-100
  richResultsEligible: boolean;
  seoScore: number; // 0-100
}

export interface ValidationRule {
  property: string;
  required: boolean;
  type?: string | string[];
  minLength?: number;
  maxLength?: number;
  format?: string;
  pattern?: RegExp;
  enum?: unknown[];
  nestedRequired?: string[];
  googleRequirement?: {
    minWidth?: number;
    minHeight?: number;
    aspectRatio?: number[];
  };
  seoImpact: SeoImpact;
  errorMessage: string;
  fix: string;
  documentation?: string;
}

export interface SchemaTypeDefinition {
  typeName: string;
  requiredProperties: string[];
  recommendedProperties?: string[];
  googleRichResultsEligible: boolean;
  priority: number;
  documentationUrl?: string;
}

export interface ValidationRequest {
  source: 'url' | 'json-ld';
  input: string;
  options?: {
    includeWarnings?: boolean;
    checkImages?: boolean;
    followLinks?: boolean;
  };
}

export interface ValidationResponse {
  success: boolean;
  url?: string;
  timestamp: string;
  overallScore: number;
  schemas: ValidationResult[];
  summary: {
    totalErrors: number;
    totalWarnings: number;
    totalPassed: number;
    richResultsEligible: boolean;
  };
  error?: string;
}

export interface BatchValidationRequest {
  urls: string[];
  email?: string;
}

export interface BatchValidationJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalUrls: number;
  processedUrls: number;
  results?: ValidationResponse[];
  createdAt: string;
  completedAt?: string;
}
