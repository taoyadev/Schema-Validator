import { describe, it, expect } from 'vitest';
import { SEOAnalyzer } from '../seo-analyzer';
import type { ValidationResult, ParsedSchema } from '../types';

describe('SEOAnalyzer', () => {
  const analyzer = new SEOAnalyzer();

  const createMockSchema = (type: string): ParsedSchema => ({
    type,
    context: 'https://schema.org',
    properties: {
      name: 'Test Name',
      description: 'Test description that is long enough to pass validation',
      image: 'https://example.com/image.jpg',
      author: { '@type': 'Person', name: 'Test Author' },
      datePublished: '2024-01-01',
    },
    rawJson: '{}',
    location: { scriptTagIndex: 0 },
  });

  const createMockResult = (
    schema: ParsedSchema,
    errors: ValidationResult['errors'] = [],
    warnings: ValidationResult['warnings'] = []
  ): ValidationResult => ({
    schema,
    errors,
    warnings,
    passed: [],
    completeness: 80,
    richResultsEligible: true,
    seoScore: 85,
  });

  describe('analyze', () => {
    it('should generate complete SEO analysis', () => {
      const schema = createMockSchema('Article');
      const result = createMockResult(schema);

      const analysis = analyzer.analyze(result);

      expect(analysis).toHaveProperty('metrics');
      expect(analysis).toHaveProperty('suggestions');
      expect(analysis).toHaveProperty('strengths');
      expect(analysis).toHaveProperty('weaknesses');
      expect(analysis).toHaveProperty('completenessBreakdown');
    });

    it('should calculate metrics correctly', () => {
      const schema = createMockSchema('Article');
      const result = createMockResult(schema);

      const analysis = analyzer.analyze(result);

      expect(analysis.metrics.overallScore).toBeGreaterThan(0);
      expect(analysis.metrics.overallScore).toBeLessThanOrEqual(100);
      expect(analysis.metrics.requiredFieldsScore).toBeDefined();
      expect(analysis.metrics.recommendedFieldsScore).toBeDefined();
      expect(analysis.metrics.technicalScore).toBeDefined();
      expect(analysis.metrics.contentQualityScore).toBeDefined();
      expect(analysis.metrics.richResultsReadiness).toBeDefined();
    });

    it('should generate suggestions from errors and warnings', () => {
      const schema = createMockSchema('Article');
      const result = createMockResult(
        schema,
        [
          {
            severity: 'error',
            property: 'headline',
            message: 'headline is required',
            fix: 'Add headline property',
            seoImpact: 'high',
            documentation: 'https://schema.org/headline',
          },
        ],
        [
          {
            severity: 'warning',
            property: 'publisher',
            message: 'publisher is recommended',
            fix: 'Add publisher property',
            seoImpact: 'medium',
            documentation: 'https://schema.org/publisher',
          },
        ]
      );

      const analysis = analyzer.analyze(result);

      expect(analysis.suggestions.length).toBeGreaterThan(0);
      expect(analysis.suggestions[0]).toHaveProperty('priority');
      expect(analysis.suggestions[0]).toHaveProperty('category');
      expect(analysis.suggestions[0]).toHaveProperty('fix');
    });

    it('should prioritize critical errors first', () => {
      const schema = createMockSchema('Article');
      const result = createMockResult(
        schema,
        [
          {
            severity: 'error',
            property: 'low-priority',
            message: 'Low priority error',
            fix: 'Fix low priority',
            seoImpact: 'low',
            documentation: '',
          },
          {
            severity: 'error',
            property: 'high-priority',
            message: 'High priority error',
            fix: 'Fix high priority',
            seoImpact: 'high',
            documentation: '',
          },
        ]
      );

      const analysis = analyzer.analyze(result);

      expect(analysis.suggestions[0].property).toBe('high-priority');
      expect(analysis.suggestions[0].priority).toBe('critical');
    });

    it('should identify strengths for good schemas', () => {
      const schema = createMockSchema('Article');
      const result = createMockResult(schema, [], []);
      result.richResultsEligible = true;
      result.seoScore = 95;

      const analysis = analyzer.analyze(result);

      expect(analysis.strengths.length).toBeGreaterThan(0);
      expect(analysis.strengths).toContain('Eligible for Google Rich Results');
      expect(analysis.strengths).toContain('Excellent SEO score');
    });

    it('should identify weaknesses for poor schemas', () => {
      const schema = createMockSchema('Article');
      const result = createMockResult(
        schema,
        [
          {
            severity: 'error',
            property: 'critical-field',
            message: 'Critical error',
            fix: 'Fix critical field',
            seoImpact: 'high',
            documentation: '',
          },
        ]
      );
      result.richResultsEligible = false;
      result.seoScore = 35;
      result.completeness = 40;

      const analysis = analyzer.analyze(result);

      expect(analysis.weaknesses.length).toBeGreaterThan(0);
      expect(analysis.weaknesses).toContain('Not eligible for Rich Results');
      expect(analysis.weaknesses).toContain('Low SEO score needs improvement');
    });

    it('should calculate completeness breakdown', () => {
      const schema = createMockSchema('Article');
      const result = createMockResult(schema);

      const analysis = analyzer.analyze(result);

      expect(analysis.completenessBreakdown.required).toHaveProperty('total');
      expect(analysis.completenessBreakdown.required).toHaveProperty('completed');
      expect(analysis.completenessBreakdown.required).toHaveProperty('percentage');
      expect(analysis.completenessBreakdown.required.percentage).toBeGreaterThanOrEqual(0);
      expect(analysis.completenessBreakdown.required.percentage).toBeLessThanOrEqual(100);
    });
  });

  describe('priority assignment', () => {
    it('should assign critical priority to required high-impact errors', () => {
      const schema = createMockSchema('Article');
      const result = createMockResult(schema, [
        {
          severity: 'error',
          property: 'headline',
          message: 'headline required',
          fix: 'Add headline',
          seoImpact: 'high',
          documentation: '',
        },
      ]);

      const analysis = analyzer.analyze(result);

      const criticalSuggestion = analysis.suggestions.find(
        (s) => s.property === 'headline'
      );
      expect(criticalSuggestion?.priority).toBe('critical');
    });

    it('should assign high priority to required medium-impact errors', () => {
      const schema = createMockSchema('Article');
      const result = createMockResult(schema, [
        {
          severity: 'error',
          property: 'test-field',
          message: 'test field required',
          fix: 'Add test field',
          seoImpact: 'medium',
          documentation: '',
        },
      ]);

      const analysis = analyzer.analyze(result);

      const suggestion = analysis.suggestions[0];
      expect(suggestion.priority).toBe('high');
    });

    it('should estimate effort correctly', () => {
      const schema = createMockSchema('Article');
      const result = createMockResult(schema, [
        {
          severity: 'error',
          property: 'name',
          message: 'name required',
          fix: 'Add name',
          seoImpact: 'high',
          documentation: '',
        },
        {
          severity: 'error',
          property: 'nested.property',
          message: 'nested property required',
          fix: 'Add nested property',
          seoImpact: 'high',
          documentation: '',
        },
      ]);

      const analysis = analyzer.analyze(result);

      const nameSuggestion = analysis.suggestions.find((s) => s.property === 'name');
      const nestedSuggestion = analysis.suggestions.find(
        (s) => s.property === 'nested.property'
      );

      expect(nameSuggestion?.effort).toBe('low');
      expect(nestedSuggestion?.effort).toBe('medium');
    });
  });

  describe('score calculations', () => {
    it('should calculate lower scores for schemas with errors', () => {
      const schemaWithoutErrors = createMockSchema('Article');
      const resultWithoutErrors = createMockResult(schemaWithoutErrors);

      const schemaWithErrors = createMockSchema('Article');
      const resultWithErrors = createMockResult(schemaWithErrors, [
        {
          severity: 'error',
          property: 'headline',
          message: 'headline required',
          fix: 'Add headline',
          seoImpact: 'high',
          documentation: '',
        },
      ]);

      const analysisWithoutErrors = analyzer.analyze(resultWithoutErrors);
      const analysisWithErrors = analyzer.analyze(resultWithErrors);

      expect(analysisWithErrors.metrics.requiredFieldsScore).toBeLessThan(
        analysisWithoutErrors.metrics.requiredFieldsScore
      );
    });

    it('should return 0 rich results readiness if not eligible', () => {
      const schema = createMockSchema('Article');
      const result = createMockResult(schema);
      result.richResultsEligible = false;

      const analysis = analyzer.analyze(result);

      expect(analysis.metrics.richResultsReadiness).toBe(0);
    });

    it('should calculate higher content quality score with good content', () => {
      const schema = createMockSchema('Article');
      schema.properties.description =
        'A good description that is between 50 and 160 characters long for SEO';
      schema.properties.image = 'https://example.com/image.jpg';
      schema.properties.author = { '@type': 'Person', name: 'Author' };
      schema.properties.datePublished = '2024-01-01';

      const result = createMockResult(schema);
      const analysis = analyzer.analyze(result);

      expect(analysis.metrics.contentQualityScore).toBeGreaterThan(70);
    });
  });
});
