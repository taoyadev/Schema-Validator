import type { ValidationResponse, ValidationResult } from '../validation/types';

export type ChangeType = 'added' | 'removed' | 'modified' | 'unchanged';

export interface SchemaDiff {
  type: string;
  changeType: ChangeType;
  before?: ValidationResult;
  after?: ValidationResult;
  changes: {
    score?: {
      before: number;
      after: number;
      delta: number;
      improvement: boolean;
    };
    completeness?: {
      before: number;
      after: number;
      delta: number;
      improvement: boolean;
    };
    richResultsEligibility?: {
      before: boolean;
      after: boolean;
      changed: boolean;
      improvement: boolean;
    };
    errors?: {
      fixed: Array<{ property: string; message: string }>;
      new: Array<{ property: string; message: string }>;
      unchanged: Array<{ property: string; message: string }>;
    };
    warnings?: {
      fixed: Array<{ property: string; message: string }>;
      new: Array<{ property: string; message: string }>;
      unchanged: Array<{ property: string; message: string }>;
    };
    properties?: {
      added: string[];
      removed: string[];
      modified: Array<{
        property: string;
        before: unknown;
        after: unknown;
      }>;
    };
  };
}

export interface ComparisonResult {
  before: ValidationResponse;
  after: ValidationResponse;
  summary: {
    overallScoreDelta: number;
    improvement: boolean;
    schemasAdded: number;
    schemasRemoved: number;
    schemasModified: number;
    schemasUnchanged: number;
    errorsFixed: number;
    errorsNew: number;
    warningsFixed: number;
    warningsNew: number;
    richResultsGained: number;
    richResultsLost: number;
  };
  schemas: SchemaDiff[];
  insights: {
    majorImprovements: string[];
    majorRegressions: string[];
    recommendations: string[];
  };
  timestamp: string;
}

export interface ComparisonOptions {
  ignoreWarnings?: boolean;
  ignoreOptionalFields?: boolean;
  scoreThreshold?: number; // Minimum delta to consider as significant change
}
