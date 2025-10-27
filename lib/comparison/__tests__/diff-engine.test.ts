import { describe, it, expect } from 'vitest';
import { DiffEngine } from '../diff-engine';
import type { ValidationResponse, ValidationResult } from '../../validation/types';

describe('DiffEngine', () => {
  const engine = new DiffEngine();

  const createMockResult = (
    type: string,
    score: number,
    completeness: number,
    richResultsEligible: boolean,
    errors: ValidationResult['errors'] = [],
    warnings: ValidationResult['warnings'] = []
  ): ValidationResult => ({
    schema: {
      type,
      context: 'https://schema.org',
      properties: {
        name: 'Test Schema',
        description: 'Test description',
      },
      rawJson: '{}',
      location: { scriptTagIndex: 0 },
    },
    seoScore: score,
    completeness,
    richResultsEligible,
    errors,
    warnings,
    passed: [],
  });

  const createMockResponse = (
    schemas: ValidationResult[],
    overallScore: number
  ): ValidationResponse => ({
    success: true,
    timestamp: new Date().toISOString(),
    overallScore,
    schemas,
    summary: {
      totalErrors: schemas.reduce((sum, s) => sum + s.errors.length, 0),
      totalWarnings: schemas.reduce((sum, s) => sum + s.warnings.length, 0),
      totalPassed: schemas.reduce((sum, s) => sum + s.passed.length, 0),
      richResultsEligible: schemas.some((s) => s.richResultsEligible),
    },
  });

  describe('compare', () => {
    it('should detect identical schemas', () => {
      const schema = createMockResult('Article', 85, 90, true);
      const before = createMockResponse([schema], 85);
      const after = createMockResponse([schema], 85);

      const result = engine.compare(before, after);

      expect(result.summary.overallScoreDelta).toBe(0);
      expect(result.summary.improvement).toBe(false);
      expect(result.summary.schemasModified).toBe(0);
      expect(result.summary.schemasUnchanged).toBe(1);
      expect(result.schemas[0].changeType).toBe('unchanged');
    });

    it('should detect score improvements', () => {
      const beforeSchema = createMockResult('Article', 60, 70, false);
      const afterSchema = createMockResult('Article', 85, 90, true);
      const before = createMockResponse([beforeSchema], 60);
      const after = createMockResponse([afterSchema], 85);

      const result = engine.compare(before, after);

      expect(result.summary.overallScoreDelta).toBe(25);
      expect(result.summary.improvement).toBe(true);
      expect(result.schemas[0].changeType).toBe('modified');
      expect(result.schemas[0].changes.score?.delta).toBe(25);
      expect(result.schemas[0].changes.score?.improvement).toBe(true);
    });

    it('should detect score regressions', () => {
      const beforeSchema = createMockResult('Article', 85, 90, true);
      const afterSchema = createMockResult('Article', 60, 70, false);
      const before = createMockResponse([beforeSchema], 85);
      const after = createMockResponse([afterSchema], 60);

      const result = engine.compare(before, after);

      expect(result.summary.overallScoreDelta).toBe(-25);
      expect(result.summary.improvement).toBe(false);
      expect(result.schemas[0].changes.score?.delta).toBe(-25);
      expect(result.schemas[0].changes.score?.improvement).toBe(false);
    });

    it('should detect added schemas', () => {
      const before = createMockResponse([], 0);
      const afterSchema = createMockResult('Article', 85, 90, true);
      const after = createMockResponse([afterSchema], 85);

      const result = engine.compare(before, after);

      expect(result.summary.schemasAdded).toBe(1);
      expect(result.schemas[0].changeType).toBe('added');
      expect(result.schemas[0].after).toBeDefined();
      expect(result.schemas[0].before).toBeUndefined();
    });

    it('should detect removed schemas', () => {
      const beforeSchema = createMockResult('Article', 85, 90, true);
      const before = createMockResponse([beforeSchema], 85);
      const after = createMockResponse([], 0);

      const result = engine.compare(before, after);

      expect(result.summary.schemasRemoved).toBe(1);
      expect(result.schemas[0].changeType).toBe('removed');
      expect(result.schemas[0].before).toBeDefined();
      expect(result.schemas[0].after).toBeUndefined();
    });

    it('should detect fixed errors', () => {
      const beforeSchema = createMockResult(
        'Article',
        60,
        70,
        false,
        [
          {
            severity: 'error',
            property: 'image',
            message: 'image is required',
            fix: 'Add image property',
            seoImpact: 'high',
            documentation: 'https://schema.org/image',
          },
        ]
      );
      const afterSchema = createMockResult('Article', 85, 90, true, []);
      const before = createMockResponse([beforeSchema], 60);
      const after = createMockResponse([afterSchema], 85);

      const result = engine.compare(before, after);

      expect(result.summary.errorsFixed).toBe(1);
      expect(result.summary.errorsNew).toBe(0);
      expect(result.schemas[0].changes.errors?.fixed.length).toBe(1);
      expect(result.schemas[0].changes.errors?.fixed[0].property).toBe('image');
    });

    it('should detect new errors', () => {
      const beforeSchema = createMockResult('Article', 85, 90, true, []);
      const afterSchema = createMockResult(
        'Article',
        60,
        70,
        false,
        [
          {
            severity: 'error',
            property: 'image',
            message: 'image is required',
            fix: 'Add image property',
            seoImpact: 'high',
            documentation: 'https://schema.org/image',
          },
        ]
      );
      const before = createMockResponse([beforeSchema], 85);
      const after = createMockResponse([afterSchema], 60);

      const result = engine.compare(before, after);

      expect(result.summary.errorsNew).toBe(1);
      expect(result.summary.errorsFixed).toBe(0);
      expect(result.schemas[0].changes.errors?.new.length).toBe(1);
      expect(result.schemas[0].changes.errors?.new[0].property).toBe('image');
    });

    it('should detect Rich Results eligibility changes', () => {
      const beforeSchema = createMockResult('Article', 60, 70, false);
      const afterSchema = createMockResult('Article', 85, 90, true);
      const before = createMockResponse([beforeSchema], 60);
      const after = createMockResponse([afterSchema], 85);

      const result = engine.compare(before, after);

      expect(result.summary.richResultsGained).toBe(1);
      expect(result.schemas[0].changes.richResultsEligibility?.improvement).toBe(
        true
      );
    });

    it('should detect Rich Results eligibility loss', () => {
      const beforeSchema = createMockResult('Article', 85, 90, true);
      const afterSchema = createMockResult('Article', 60, 70, false);
      const before = createMockResponse([beforeSchema], 85);
      const after = createMockResponse([afterSchema], 60);

      const result = engine.compare(before, after);

      expect(result.summary.richResultsLost).toBe(1);
      expect(result.schemas[0].changes.richResultsEligibility?.improvement).toBe(
        false
      );
    });

    it('should detect property additions', () => {
      const beforeSchema = createMockResult('Article', 60, 70, false);
      beforeSchema.schema.properties = { name: 'Test' };

      const afterSchema = createMockResult('Article', 85, 90, true);
      afterSchema.schema.properties = {
        name: 'Test',
        author: 'John Doe',
        datePublished: '2024-01-01',
      };

      const before = createMockResponse([beforeSchema], 60);
      const after = createMockResponse([afterSchema], 85);

      const result = engine.compare(before, after);

      expect(result.schemas[0].changes.properties?.added).toContain('author');
      expect(result.schemas[0].changes.properties?.added).toContain(
        'datePublished'
      );
    });

    it('should detect property removals', () => {
      const beforeSchema = createMockResult('Article', 85, 90, true);
      beforeSchema.schema.properties = {
        name: 'Test',
        author: 'John Doe',
        datePublished: '2024-01-01',
      };

      const afterSchema = createMockResult('Article', 60, 70, false);
      afterSchema.schema.properties = { name: 'Test' };

      const before = createMockResponse([beforeSchema], 85);
      const after = createMockResponse([afterSchema], 60);

      const result = engine.compare(before, after);

      expect(result.schemas[0].changes.properties?.removed).toContain('author');
      expect(result.schemas[0].changes.properties?.removed).toContain(
        'datePublished'
      );
    });

    it('should detect property modifications', () => {
      const beforeSchema = createMockResult('Article', 70, 75, false);
      beforeSchema.schema.properties = {
        '@id': 'test-article',
        name: 'Test Article',
        description: 'Old description',
      };

      const afterSchema = createMockResult('Article', 75, 80, true);
      afterSchema.schema.properties = {
        '@id': 'test-article',
        name: 'Test Article',
        description: 'New description',
      };

      const before = createMockResponse([beforeSchema], 70);
      const after = createMockResponse([afterSchema], 75);

      const result = engine.compare(before, after);

      expect(result.schemas[0].changes.properties?.modified.length).toBe(1);
      expect(result.schemas[0].changes.properties?.modified[0].property).toBe(
        'description'
      );
      expect(result.schemas[0].changes.properties?.modified[0].before).toBe(
        'Old description'
      );
      expect(result.schemas[0].changes.properties?.modified[0].after).toBe(
        'New description'
      );
    });
  });

  describe('insights generation', () => {
    it('should generate major improvement insights', () => {
      const beforeSchema = createMockResult('Article', 40, 50, false);
      const afterSchema = createMockResult('Article', 85, 90, true);
      const before = createMockResponse([beforeSchema], 40);
      const after = createMockResponse([afterSchema], 85);

      const result = engine.compare(before, after);

      expect(result.insights.majorImprovements.length).toBeGreaterThan(0);
      expect(
        result.insights.majorImprovements.some((insight) =>
          insight.includes('Significant score improvement')
        )
      ).toBe(true);
      expect(
        result.insights.majorImprovements.some((insight) =>
          insight.includes('Rich Results')
        )
      ).toBe(true);
    });

    it('should generate major regression insights', () => {
      const beforeSchema = createMockResult('Article', 85, 90, true);
      const afterSchema = createMockResult('Article', 40, 50, false, [
        {
          severity: 'error',
          property: 'image',
          message: 'image is required',
          fix: 'Add image',
          seoImpact: 'high',
          documentation: 'https://schema.org/image',
        },
      ]);
      const before = createMockResponse([beforeSchema], 85);
      const after = createMockResponse([afterSchema], 40);

      const result = engine.compare(before, after);

      expect(result.insights.majorRegressions.length).toBeGreaterThan(0);
      expect(
        result.insights.majorRegressions.some((insight) =>
          insight.includes('score decline')
        )
      ).toBe(true);
    });

    it('should generate recommendations', () => {
      const beforeSchema = createMockResult('Article', 85, 90, true);
      const afterSchema = createMockResult('Article', 40, 50, false, [
        {
          severity: 'error',
          property: 'image',
          message: 'image is required',
          fix: 'Add image',
          seoImpact: 'high',
          documentation: 'https://schema.org/image',
        },
      ]);
      const before = createMockResponse([beforeSchema], 85);
      const after = createMockResponse([afterSchema], 40);

      const result = engine.compare(before, after);

      expect(result.insights.recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('comparison options', () => {
    it('should ignore warnings when specified', () => {
      const beforeSchema = createMockResult(
        'Article',
        80,
        85,
        true,
        [],
        [
          {
            severity: 'warning',
            property: 'publisher',
            message: 'publisher is recommended',
            fix: 'Add publisher',
            seoImpact: 'medium',
            documentation: 'https://schema.org/publisher',
          },
        ]
      );
      const afterSchema = createMockResult('Article', 80, 85, true, [], []);
      const before = createMockResponse([beforeSchema], 80);
      const after = createMockResponse([afterSchema], 80);

      const result = engine.compare(before, after, { ignoreWarnings: true });

      expect(result.schemas[0].changes.warnings).toBeUndefined();
    });

    it('should respect score threshold', () => {
      const beforeSchema = createMockResult('Article', 80, 85, true);
      const afterSchema = createMockResult('Article', 82, 87, true);
      const before = createMockResponse([beforeSchema], 80);
      const after = createMockResponse([afterSchema], 82);

      const result = engine.compare(before, after, { scoreThreshold: 5 });

      // Score change is 2, threshold is 5, so should be unchanged
      expect(result.schemas[0].changeType).toBe('unchanged');
    });
  });

  describe('multiple schemas', () => {
    it('should handle multiple schemas correctly', () => {
      const beforeArticle = createMockResult('Article', 80, 85, true);
      const beforeProduct = createMockResult('Product', 70, 75, false);
      const afterArticle = createMockResult('Article', 85, 90, true);
      const afterProduct = createMockResult('Product', 75, 80, true);
      const afterOrg = createMockResult('Organization', 90, 95, true);

      const before = createMockResponse([beforeArticle, beforeProduct], 75);
      const after = createMockResponse([afterArticle, afterProduct, afterOrg], 83);

      const result = engine.compare(before, after);

      expect(result.summary.schemasModified).toBe(2);
      expect(result.summary.schemasAdded).toBe(1);
      expect(result.summary.richResultsGained).toBe(1); // Product gained eligibility
    });
  });
});
