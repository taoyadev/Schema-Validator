import { NextRequest, NextResponse } from 'next/server';
import { ValidationEngine } from '@/lib/validation/validator';
import { SchemaParser } from '@/lib/validation/parser';
import { SchemaFetcher } from '@/lib/validation/fetcher';
import type { ValidationRequest, ValidationResponse } from '@/lib/validation/types';

// Rate limiting (in-memory, replace with Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 30; // requests per window
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(identifier: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (record.count >= RATE_LIMIT) {
    return false;
  }

  record.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again later.' },
        { status: 429 }
      );
    }

    const body: ValidationRequest = await request.json();

    // Validate request
    if (!body.source || !body.input) {
      return NextResponse.json(
        { error: 'Missing required fields: source and input' },
        { status: 400 }
      );
    }

    if (body.source !== 'url' && body.source !== 'json-ld') {
      return NextResponse.json(
        { error: 'Invalid source. Must be "url" or "json-ld"' },
        { status: 400 }
      );
    }

    let html: string;
    let finalUrl: string | undefined;

    // Fetch or use provided content
    if (body.source === 'url') {
      try {
        const fetcher = new SchemaFetcher();
        const result = await fetcher.fetchUrl(body.input);
        html = result.html;
        finalUrl = result.finalUrl;
      } catch (error) {
        return NextResponse.json(
          {
            error: 'Failed to fetch URL',
            details: error instanceof Error ? error.message : 'Unknown error'
          },
          { status: 400 }
        );
      }
    } else {
      html = `<script type="application/ld+json">${body.input}</script>`;
    }

    // Parse schemas
    const parser = new SchemaParser();
    const schemas = parser.parseHtml(html);

    if (schemas.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No structured data found',
          timestamp: new Date().toISOString(),
          overallScore: 0,
          schemas: [],
          summary: {
            totalErrors: 0,
            totalWarnings: 0,
            totalPassed: 0,
            richResultsEligible: false,
          },
        } as ValidationResponse,
        { status: 200 }
      );
    }

    // Validate schemas
    const validator = new ValidationEngine();
    const validationResults = await validator.validate(schemas);

    // Calculate summary
    const summary = {
      totalErrors: validationResults.reduce((sum, r) => sum + r.errors.length, 0),
      totalWarnings: validationResults.reduce((sum, r) => sum + r.warnings.length, 0),
      totalPassed: validationResults.reduce((sum, r) => sum + r.passed.length, 0),
      richResultsEligible: validationResults.some((r) => r.richResultsEligible),
    };

    // Calculate overall score (average of all schema scores)
    const overallScore =
      validationResults.length > 0
        ? Math.round(
            validationResults.reduce((sum, r) => sum + r.seoScore, 0) /
              validationResults.length
          )
        : 0;

    const response: ValidationResponse = {
      success: true,
      url: finalUrl,
      timestamp: new Date().toISOString(),
      overallScore,
      schemas: validationResults,
      summary,
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

// GET method for documentation
export async function GET() {
  return NextResponse.json({
    name: 'Schema.org Validation API',
    version: 'v1',
    description: 'Validate Schema.org structured data with Google Rich Results compliance',
    endpoints: {
      'POST /api/v1/validate': {
        description: 'Validate structured data from URL or JSON-LD',
        rateLimit: `${RATE_LIMIT} requests per minute`,
        requestBody: {
          source: 'url | json-ld',
          input: 'URL string or JSON-LD string',
          options: {
            includeWarnings: 'boolean (optional)',
            checkImages: 'boolean (optional)',
            followLinks: 'boolean (optional)',
          },
        },
        response: {
          success: 'boolean',
          url: 'string (if source is url)',
          timestamp: 'ISO 8601 string',
          overallScore: 'number (0-100)',
          schemas: 'ValidationResult[]',
          summary: {
            totalErrors: 'number',
            totalWarnings: 'number',
            totalPassed: 'number',
            richResultsEligible: 'boolean',
          },
        },
      },
    },
    documentation: 'https://github.com/yourusername/schema-validator#api',
    examples: {
      validateUrl: {
        method: 'POST',
        url: '/api/v1/validate',
        body: {
          source: 'url',
          input: 'https://example.com',
        },
      },
      validateJsonLd: {
        method: 'POST',
        url: '/api/v1/validate',
        body: {
          source: 'json-ld',
          input: '{"@context":"https://schema.org","@type":"Article","headline":"Example"}',
        },
      },
    },
  });
}
