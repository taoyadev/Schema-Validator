import { describe, it, expect } from 'vitest';
import { SchemaParser } from '../parser';

describe('SchemaParser', () => {
  const parser = new SchemaParser();

  describe('parseHtml', () => {
    it('should extract JSON-LD from valid HTML', () => {
      const html = `
        <html>
          <head>
            <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Test Article"
            }
            </script>
          </head>
        </html>
      `;

      const schemas = parser.parseHtml(html);
      expect(schemas).toHaveLength(1);
      expect(schemas[0].type).toBe('Article');
      expect(schemas[0].context).toBe('https://schema.org');
      expect(schemas[0].properties.headline).toBe('Test Article');
    });

    it('should extract multiple schemas', () => {
      const html = `
        <html>
          <head>
            <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Test Article"
            }
            </script>
            <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Test Org"
            }
            </script>
          </head>
        </html>
      `;

      const schemas = parser.parseHtml(html);
      expect(schemas).toHaveLength(2);
      expect(schemas[0].type).toBe('Article');
      expect(schemas[1].type).toBe('Organization');
    });

    it('should handle @graph arrays', () => {
      const html = `
        <html>
          <head>
            <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Article",
                  "headline": "First Article"
                },
                {
                  "@type": "Article",
                  "headline": "Second Article"
                }
              ]
            }
            </script>
          </head>
        </html>
      `;

      const schemas = parser.parseHtml(html);
      expect(schemas).toHaveLength(2);
      expect(schemas[0].type).toBe('Article');
      expect(schemas[1].type).toBe('Article');
      expect(schemas[0].properties.headline).toBe('First Article');
      expect(schemas[1].properties.headline).toBe('Second Article');
    });

    it('should handle HTML entities', () => {
      const html = `
        <html>
          <head>
            <script type="application/ld+json">
            {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": "Test &amp; Article"
            }
            </script>
          </head>
        </html>
      `;

      const schemas = parser.parseHtml(html);
      expect(schemas).toHaveLength(1);
      expect(schemas[0].properties.headline).toBe('Test & Article');
    });

    it('should return empty array for invalid JSON-LD', () => {
      const html = `
        <html>
          <head>
            <script type="application/ld+json">
              { invalid json }
            </script>
          </head>
        </html>
      `;

      const schemas = parser.parseHtml(html);
      expect(schemas).toHaveLength(0);
    });

    it('should preserve @context as provided', () => {
      const html = `
        <html>
          <head>
            <script type="application/ld+json">
            {
              "@context": "http://schema.org",
              "@type": "Article",
              "headline": "Test"
            }
            </script>
          </head>
        </html>
      `;

      const schemas = parser.parseHtml(html);
      expect(schemas).toHaveLength(1);
      expect(schemas[0].context).toBe('http://schema.org');
    });
  });
});
