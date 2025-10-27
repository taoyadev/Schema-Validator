/**
 * SchemaParser - Extracts and parses JSON-LD from HTML
 */

import * as cheerio from 'cheerio';
import { ParsedSchema } from './types';

export class SchemaParser {
  parseHtml(html: string): ParsedSchema[] {
    const $ = cheerio.load(html);
    const schemas: ParsedSchema[] = [];

    // Extract all JSON-LD script tags
    const jsonLdBlocks = this.extractJsonLdBlocks($);

    jsonLdBlocks.forEach((block, index) => {
      try {
        const parsed = this.parseJsonLd(block, index);
        if (Array.isArray(parsed)) {
          schemas.push(...parsed);
        } else {
          schemas.push(parsed);
        }
      } catch (error) {
        // Log error but continue parsing other blocks
        console.warn(`Failed to parse JSON-LD block ${index}:`, error);
      }
    });

    return schemas;
  }

  private extractJsonLdBlocks($: cheerio.CheerioAPI): string[] {
    const blocks: string[] = [];

    $('script[type="application/ld+json"]').each((_, element) => {
      const content = $(element).html();
      if (content) {
        blocks.push(content);
      }
    });

    return blocks;
  }

  private parseJsonLd(
    jsonString: string,
    scriptTagIndex: number
  ): ParsedSchema | ParsedSchema[] {
    // Handle escaped JSON
    let cleanedJson = jsonString.trim();

    // Remove HTML entities
    cleanedJson = cleanedJson
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&#39;/g, "'");

    let data: unknown;
    try {
      data = JSON.parse(cleanedJson);
    } catch (error) {
      throw new Error(
        `Invalid JSON in script tag ${scriptTagIndex}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
    }

    // Handle @graph arrays
    if (this.isGraphArray(data)) {
      return this.handleGraphArray(data, scriptTagIndex, cleanedJson);
    }

    // Single schema object
    return this.createParsedSchema(data, scriptTagIndex, cleanedJson);
  }

  private isGraphArray(data: unknown): boolean {
    return (
      typeof data === 'object' &&
      data !== null &&
      '@graph' in data &&
      Array.isArray((data as { '@graph': unknown })['@graph'])
    );
  }

  private handleGraphArray(
    data: unknown,
    scriptTagIndex: number,
    _rawJson: string
  ): ParsedSchema[] {
    const graphData = data as { '@graph': unknown[]; '@context'?: unknown };
    const context = this.normalizeContext(graphData['@context']);
    const schemas: ParsedSchema[] = [];

    graphData['@graph'].forEach((item, index) => {
      if (typeof item === 'object' && item !== null && '@type' in item) {
        schemas.push({
          type: this.extractType(item),
          context,
          properties: item as Record<string, unknown>,
          rawJson: JSON.stringify(item, null, 2),
          location: {
            scriptTagIndex,
            line: index,
          },
        });
      }
    });

    return schemas;
  }

  private createParsedSchema(
    data: unknown,
    scriptTagIndex: number,
    rawJson: string
  ): ParsedSchema {
    if (typeof data !== 'object' || data === null) {
      throw new Error('Schema must be an object');
    }

    const obj = data as Record<string, unknown>;

    if (!('@type' in obj)) {
      throw new Error('Schema missing @type property');
    }

    return {
      type: this.extractType(obj),
      context: this.normalizeContext(obj['@context']),
      properties: obj,
      rawJson,
      location: {
        scriptTagIndex,
      },
    };
  }

  private extractType(obj: Record<string, unknown>): string {
    const type = obj['@type'];

    if (typeof type === 'string') {
      return type;
    }

    if (Array.isArray(type) && type.length > 0 && typeof type[0] === 'string') {
      return type[0];
    }

    throw new Error('Invalid @type value');
  }

  private normalizeContext(context: unknown): string {
    if (typeof context === 'string') {
      return context;
    }

    if (Array.isArray(context)) {
      const schemaOrgContext = context.find((c) =>
        typeof c === 'string'
          ? c.includes('schema.org')
          : false
      );
      return schemaOrgContext || 'https://schema.org';
    }

    if (typeof context === 'object' && context !== null) {
      // Handle object-style context
      return 'https://schema.org';
    }

    return 'https://schema.org';
  }

  /**
   * Parse JSON-LD from raw JSON string (for direct JSON-LD input)
   */
  parseJsonLdString(jsonString: string): ParsedSchema[] {
    const html = `<script type="application/ld+json">${jsonString}</script>`;
    return this.parseHtml(html);
  }
}

/**
 * Helper function for common use cases
 */
export function parseSchemaFromHtml(html: string): ParsedSchema[] {
  const parser = new SchemaParser();
  return parser.parseHtml(html);
}

export function parseSchemaFromJson(jsonString: string): ParsedSchema[] {
  const parser = new SchemaParser();
  return parser.parseJsonLdString(jsonString);
}
