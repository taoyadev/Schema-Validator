import { describe, it, expect } from 'vitest';
import { ValidationEngine } from '../validator';
import type { ParsedSchema } from '../types';

describe('ValidationEngine', () => {
  const engine = new ValidationEngine();

  describe('validate Article schema', () => {
    it('should pass validation for valid Article', async () => {
      const schema: ParsedSchema = {
        type: 'Article',
        context: 'https://schema.org',
        properties: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Valid Article Headline',
          image: 'https://example.com/image.jpg',
          datePublished: '2024-01-01T00:00:00Z',
          author: {
            '@type': 'Person',
            name: 'John Doe',
          },
          publisher: {
            '@type': 'Organization',
            name: 'Publisher Name',
            logo: {
              '@type': 'ImageObject',
              url: 'https://example.com/logo.jpg',
            },
          },
        },
        rawJson: '{}',
        location: { scriptTagIndex: 0 },
      };

      const results = await engine.validate([schema]);
      expect(results).toHaveLength(1);
      expect(results[0].errors).toHaveLength(0);
      expect(results[0].richResultsEligible).toBe(true);
      expect(results[0].seoScore).toBeGreaterThanOrEqual(80);
    });

    it('should fail validation for missing required properties', async () => {
      const schema: ParsedSchema = {
        type: 'Article',
        context: 'https://schema.org',
        properties: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Test Article',
          // Missing: image, datePublished, author, publisher
        },
        rawJson: '{}',
        location: { scriptTagIndex: 0 },
      };

      const results = await engine.validate([schema]);
      expect(results).toHaveLength(1);
      expect(results[0].errors.length).toBeGreaterThan(0);
      expect(results[0].richResultsEligible).toBe(false);
    });

    it('should validate headline length constraints', async () => {
      const schema: ParsedSchema = {
        type: 'Article',
        context: 'https://schema.org',
        properties: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'A', // Too short (min 10 chars)
          image: 'https://example.com/image.jpg',
          datePublished: '2024-01-01T00:00:00Z',
          author: { '@type': 'Person', name: 'John Doe' },
          publisher: {
            '@type': 'Organization',
            name: 'Publisher',
            logo: { '@type': 'ImageObject', url: 'https://example.com/logo.jpg' },
          },
        },
        rawJson: '{}',
        location: { scriptTagIndex: 0 },
      };

      const results = await engine.validate([schema]);
      expect(results).toHaveLength(1);
      const headlineError = results[0].errors.find(
        (e) => e.property === 'headline'
      );
      expect(headlineError).toBeDefined();
    });
  });

  describe('validate Product schema', () => {
    it('should pass validation for valid Product', async () => {
      const schema: ParsedSchema = {
        type: 'Product',
        context: 'https://schema.org',
        properties: {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: 'Test Product',
          image: 'https://example.com/product.jpg',
          description: 'Product description',
          offers: {
            '@type': 'Offer',
            price: '99.99',
            priceCurrency: 'USD',
            availability: 'https://schema.org/InStock',
          },
        },
        rawJson: '{}',
        location: { scriptTagIndex: 0 },
      };

      const results = await engine.validate([schema]);
      expect(results).toHaveLength(1);
      // May have warnings for recommended properties, but should have no critical errors
      expect(results[0].errors.filter((e) => e.severity === 'error')).toHaveLength(0);
      expect(results[0].seoScore).toBeGreaterThan(60);
    });
  });

  describe('validate Organization schema', () => {
    it('should pass validation for valid Organization', async () => {
      const schema: ParsedSchema = {
        type: 'Organization',
        context: 'https://schema.org',
        properties: {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'Test Organization',
          url: 'https://example.com',
          logo: 'https://example.com/logo.jpg',
        },
        rawJson: '{}',
        location: { scriptTagIndex: 0 },
      };

      const results = await engine.validate([schema]);
      expect(results).toHaveLength(1);
      expect(results[0].errors).toHaveLength(0);
      expect(results[0].seoScore).toBeGreaterThanOrEqual(80);
    });
  });

  describe('completeness calculation', () => {
    it('should calculate completeness correctly', async () => {
      const schema: ParsedSchema = {
        type: 'Article',
        context: 'https://schema.org',
        properties: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Test Article Headline',
          // Has 2 out of ~8 properties
        },
        rawJson: '{}',
        location: { scriptTagIndex: 0 },
      };

      const results = await engine.validate([schema]);
      expect(results).toHaveLength(1);
      expect(results[0].completeness).toBeLessThan(50);
    });
  });

  describe('SEO score calculation', () => {
    it('should penalize errors appropriately', async () => {
      const schema: ParsedSchema = {
        type: 'Article',
        context: 'https://schema.org',
        properties: {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'Test',
          // Missing critical properties
        },
        rawJson: '{}',
        location: { scriptTagIndex: 0 },
      };

      const results = await engine.validate([schema]);
      expect(results).toHaveLength(1);
      expect(results[0].seoScore).toBeLessThan(50);
    });
  });
});
