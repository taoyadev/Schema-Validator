import { NextRequest, NextResponse } from 'next/server';
import { SchemaFetcher } from '@/lib/validation/fetcher';
import { SchemaParser } from '@/lib/validation/parser';
import { ValidationEngine } from '@/lib/validation/validator';
import { ValidationRequest, ValidationResponse } from '@/lib/validation/types';

// Rate limiting map (in-memory for MVP, should use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_REQUESTS = 10;
const RATE_LIMIT_WINDOW = 60000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= RATE_LIMIT_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
}

function calculateOverallScore(
  results: Array<{ seoScore: number }>
): number {
  if (results.length === 0) return 0;
  const totalScore = results.reduce((sum, r) => sum + r.seoScore, 0);
  return Math.round(totalScore / results.length);
}

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for') || request.ip || 'unknown';

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again in a minute.',
        },
        { status: 429 }
      );
    }

    // Parse request body
    const body = (await request.json()) as ValidationRequest;
    const { source, input } = body;

    if (!source || !input) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: source and input',
        },
        { status: 400 }
      );
    }

    if (source !== 'url' && source !== 'json-ld') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid source type. Must be "url" or "json-ld"',
        },
        { status: 400 }
      );
    }

    const startTime = Date.now();
    let html: string;
    let finalUrl: string | undefined;

    // Step 1: Fetch or prepare HTML
    if (source === 'url') {
      try {
        const fetcher = new SchemaFetcher();
        const result = await fetcher.fetchUrl(input);
        html = result.html;
        finalUrl = result.finalUrl;
      } catch (error) {
        return NextResponse.json(
          {
            success: false,
            error: `Failed to fetch URL: ${
              error instanceof Error ? error.message : 'Unknown error'
            }`,
          },
          { status: 400 }
        );
      }
    } else {
      // JSON-LD direct input
      html = `<script type="application/ld+json">${input}</script>`;
    }

    // Step 2: Parse schemas
    const parser = new SchemaParser();
    let schemas;
    try {
      schemas = parser.parseHtml(html);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to parse schemas: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        },
        { status: 400 }
      );
    }

    if (schemas.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No Schema.org structured data found in the provided input',
        },
        { status: 400 }
      );
    }

    // Step 3: Validate schemas
    const engine = new ValidationEngine();
    const results = await engine.validate(schemas);

    // Calculate overall metrics
    const overallScore = calculateOverallScore(results);
    const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
    const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
    const totalPassed = results.reduce((sum, r) => sum + r.passed.length, 0);
    const richResultsEligible = results.every((r) => r.richResultsEligible);

    const processingTime = Date.now() - startTime;

    // Build response
    const response: ValidationResponse = {
      success: true,
      url: source === 'url' ? finalUrl || input : undefined,
      timestamp: new Date().toISOString(),
      overallScore,
      schemas: results,
      summary: {
        totalErrors,
        totalWarnings,
        totalPassed,
        richResultsEligible,
      },
    };

    // TODO: Store validation history in database (async, don't wait)
    // storeValidationHistory({ ... }).catch(console.error);

    // Return response with processing time header
    return NextResponse.json(response, {
      headers: {
        'X-Processing-Time': `${processingTime}ms`,
      },
    });
  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

// OPTIONS handler for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
