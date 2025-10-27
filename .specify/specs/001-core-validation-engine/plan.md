# Technical Implementation Plan: Schema Validation Engine

**Feature**: 001-core-validation-engine
**Date**: 2025-10-26
**Tech Stack**: Next.js 14 + TypeScript + PostgreSQL + Vercel

## Architecture Overview

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js App (Vercel)                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐   │
│  │   Client    │  │  API Routes │  │ Edge Runtime │   │
│  │  (React)    │  │ (Node.js)   │  │  (Caching)   │   │
│  └──────┬──────┘  └──────┬──────┘  └──────┬───────┘   │
│         │                │                │           │
│         └────────────────┼────────────────┘           │
│                          │                            │
└──────────────────────────┼────────────────────────────┘
                           │
                           ▼
         ┌─────────────────────────────────┐
         │   Validation Service Layer      │
         │                                 │
         │  • SchemaFetcher                │
         │  • SchemaParser                 │
         │  • ValidationEngine             │
         │  • RuleEngine                   │
         │  • ReportGenerator              │
         └────────┬────────────────────────┘
                  │
        ┌─────────┼─────────┐
        ▼         ▼         ▼
    ┌─────┐  ┌────────┐  ┌────────┐
    │ DB  │  │ Cache  │  │External│
    │(PG) │  │(KV)    │  │APIs    │
    └─────┘  └────────┘  └────────┘
```

## Directory Structure

```
schema-validator/
├── app/                          # Next.js 14 App Router
│   ├── api/
│   │   ├── validate/
│   │   │   ├── route.ts          # POST /api/validate
│   │   │   └── batch/
│   │   │       └── route.ts      # Batch validation
│   │   └── health/
│   │       └── route.ts          # Health check
│   ├── page.tsx                  # Homepage
│   ├── results/
│   │   └── [id]/page.tsx         # Results detail page
│   ├── layout.tsx
│   └── globals.css
│
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   ├── validation/
│   │   ├── ValidationForm.tsx
│   │   ├── ResultsDisplay.tsx
│   │   ├── SchemaCard.tsx
│   │   ├── ErrorList.tsx
│   │   └── ScoreIndicator.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
│
├── lib/
│   ├── validation/
│   │   ├── fetcher.ts            # URL fetching logic
│   │   ├── parser.ts             # JSON-LD extraction
│   │   ├── validator.ts          # Main validation engine
│   │   ├── rules/                # Validation rules by schema type
│   │   │   ├── article.ts
│   │   │   ├── product.ts
│   │   │   ├── organization.ts
│   │   │   └── index.ts
│   │   ├── report-generator.ts
│   │   └── types.ts              # Type definitions
│   ├── db/
│   │   ├── client.ts             # Supabase/Postgres client
│   │   ├── queries.ts            # Database queries
│   │   └── schema.sql            # Database schema
│   ├── cache/
│   │   └── kv.ts                 # Cloudflare KV or Redis
│   ├── utils/
│   │   ├── schema-utils.ts       # Schema.org helpers
│   │   ├── seo-utils.ts          # SEO scoring
│   │   └── formatters.ts         # Data formatting
│   └── constants/
│       ├── schema-types.ts       # Schema.org definitions
│       └── validation-rules.ts   # Rule configurations
│
├── tests/
│   ├── unit/
│   │   ├── parser.test.ts
│   │   ├── validator.test.ts
│   │   └── rules/
│   │       └── article.test.ts
│   ├── integration/
│   │   └── api.test.ts
│   └── e2e/
│       └── validation-flow.spec.ts
│
├── public/
│   ├── examples/                 # Example schemas
│   └── docs/                     # Static documentation
│
├── prisma/                       # Database ORM
│   └── schema.prisma
│
├── .env.local                    # Local environment
├── .env.example
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## Database Schema

### PostgreSQL Tables (VPS Supabase)

```sql
-- Schema: schema_validator

-- Validation history for analytics
CREATE TABLE schema_validator.validation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  source_type VARCHAR(20) NOT NULL, -- 'url' | 'json-ld'
  schemas_detected JSONB NOT NULL,  -- Array of detected schema types
  overall_score INTEGER NOT NULL,
  errors_count INTEGER DEFAULT 0,
  warnings_count INTEGER DEFAULT 0,
  passed_count INTEGER DEFAULT 0,
  validation_result JSONB NOT NULL, -- Full validation result
  user_ip INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  processing_time_ms INTEGER
);

CREATE INDEX idx_validation_url ON schema_validator.validation_history(url);
CREATE INDEX idx_validation_created ON schema_validator.validation_history(created_at DESC);

-- Batch validation jobs
CREATE TABLE schema_validator.batch_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status VARCHAR(20) NOT NULL, -- 'pending' | 'processing' | 'completed' | 'failed'
  total_urls INTEGER NOT NULL,
  processed_urls INTEGER DEFAULT 0,
  urls JSONB NOT NULL,          -- Array of URLs
  results JSONB,                -- Validation results
  email VARCHAR(255),           -- Optional notification email
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE INDEX idx_batch_status ON schema_validator.batch_jobs(status);

-- Schema type definitions (reference data)
CREATE TABLE schema_validator.schema_types (
  id SERIAL PRIMARY KEY,
  type_name VARCHAR(100) NOT NULL UNIQUE, -- 'Article', 'Product', etc.
  required_properties JSONB NOT NULL,      -- Array of required property names
  recommended_properties JSONB,            -- Array of recommended properties
  google_rich_results_eligible BOOLEAN DEFAULT false,
  priority INTEGER DEFAULT 100,            -- Lower = higher priority
  documentation_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-populate schema types
INSERT INTO schema_validator.schema_types (type_name, required_properties, google_rich_results_eligible, priority) VALUES
  ('Article', '["headline", "image", "datePublished", "author"]'::jsonb, true, 1),
  ('Product', '["name", "image", "offers"]'::jsonb, true, 2),
  ('Organization', '["name", "url"]'::jsonb, true, 3),
  ('BreadcrumbList', '["itemListElement"]'::jsonb, false, 4);

-- Validation rules (configurable)
CREATE TABLE schema_validator.validation_rules (
  id SERIAL PRIMARY KEY,
  schema_type VARCHAR(100) NOT NULL,
  property_name VARCHAR(100) NOT NULL,
  rule_type VARCHAR(50) NOT NULL,  -- 'required' | 'type' | 'format' | 'enum'
  rule_config JSONB NOT NULL,       -- Rule-specific configuration
  severity VARCHAR(20) DEFAULT 'error', -- 'error' | 'warning' | 'info'
  seo_impact VARCHAR(20),           -- 'high' | 'medium' | 'low'
  error_message TEXT NOT NULL,
  fix_suggestion TEXT,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_rules_schema_type ON schema_validator.validation_rules(schema_type);
```

## Core Implementation Components

### 1. Schema Fetcher (`lib/validation/fetcher.ts`)

```typescript
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

export class SchemaFetcher {
  async fetchUrl(url: string, options?: FetchOptions): Promise<FetchResult>

  private validateUrl(url: string): void
  private handleRedirects(response: Response): string[]
  private sanitizeHtml(html: string): string
}
```

**Implementation Details:**
- Use `fetch()` with AbortController for timeout
- Follow up to 3 redirects
- User-Agent: "Schema-Validator/1.0 (SEO Tool; +https://schema-validator.com)"
- Respect robots.txt (optional, check meta robots tag)
- Handle errors: timeout, DNS failure, SSL errors

### 2. Schema Parser (`lib/validation/parser.ts`)

```typescript
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

export class SchemaParser {
  parseHtml(html: string): ParsedSchema[]

  private extractJsonLdBlocks(html: string): string[]
  private parseJsonLd(json: string): ParsedSchema
  private handleGraphArray(data: unknown): ParsedSchema[]
  private normalizeContext(context: unknown): string
}
```

**Implementation Details:**
- Use `cheerio` for HTML parsing
- Extract all `<script type="application/ld+json">` tags
- Handle escaped JSON strings
- Support @graph arrays (split into individual schemas)
- Normalize @context variations
- Detect nested schemas

### 3. Validation Engine (`lib/validation/validator.ts`)

```typescript
export interface ValidationResult {
  schema: ParsedSchema;
  errors: ValidationError[];
  warnings: ValidationWarning[];
  passed: ValidationPass[];
  completeness: number; // 0-100
  richResultsEligible: boolean;
  seoScore: number; // 0-100
}

export interface ValidationError {
  severity: 'error' | 'warning' | 'info';
  property: string;
  message: string;
  fix: string;
  seoImpact: 'high' | 'medium' | 'low';
  documentation: string;
}

export class ValidationEngine {
  async validate(schemas: ParsedSchema[]): Promise<ValidationResult[]>

  private validateSyntax(schema: ParsedSchema): ValidationError[]
  private validateSchemaOrg(schema: ParsedSchema): ValidationError[]
  private validateGoogleRequirements(schema: ParsedSchema): ValidationError[]
  private calculateCompleteness(schema: ParsedSchema): number
  private generateRecommendations(schema: ParsedSchema): ValidationWarning[]
}
```

**Validation Layers:**

1. **Syntax Validation**
   - Valid JSON structure
   - @context present and valid
   - @type present and recognized

2. **Schema.org Validation**
   - Required properties present
   - Property types correct (Text, URL, Date, etc.)
   - Value formats valid
   - Nested objects valid

3. **Google Rich Results**
   - Meets Google's minimum requirements
   - Image requirements (min 696px wide)
   - Date formats (ISO 8601)
   - Author/publisher requirements

4. **SEO Enhancement**
   - Completeness score
   - Missing recommended properties
   - Best practice suggestions

### 4. Rule Engine (`lib/validation/rules/`)

Each schema type has its own rule module:

```typescript
// lib/validation/rules/article.ts

export const articleRules: ValidationRule[] = [
  {
    property: 'headline',
    required: true,
    type: 'Text',
    minLength: 10,
    maxLength: 110,
    seoImpact: 'high',
    errorMessage: 'Article headline is required and must be 10-110 characters',
    fix: 'Add "headline": "Your Article Title Here"'
  },
  {
    property: 'image',
    required: true,
    type: 'URL' | 'ImageObject',
    googleRequirement: {
      minWidth: 696,
      minHeight: 400,
      aspectRatio: [16/9, 4/3, 1/1]
    },
    seoImpact: 'high',
    errorMessage: 'Article must have an image at least 696px wide',
    fix: 'Add "image": "https://example.com/image.jpg"'
  },
  {
    property: 'datePublished',
    required: true,
    type: 'Date',
    format: 'ISO8601',
    seoImpact: 'high',
    errorMessage: 'Article must have a publication date',
    fix: 'Add "datePublished": "2025-10-26T10:00:00Z"'
  },
  {
    property: 'author',
    required: true,
    type: 'Person' | 'Organization',
    nestedRequired: ['name'],
    seoImpact: 'medium',
    errorMessage: 'Article must have an author',
    fix: 'Add "author": {"@type": "Person", "name": "Author Name"}'
  }
];
```

### 5. API Routes

#### `/api/validate/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { SchemaFetcher } from '@/lib/validation/fetcher';
import { SchemaParser } from '@/lib/validation/parser';
import { ValidationEngine } from '@/lib/validation/validator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { source, input, options } = body;

    // Rate limiting
    const ip = request.ip || 'unknown';
    await checkRateLimit(ip);

    // Fetch or parse
    let html: string;
    if (source === 'url') {
      const fetcher = new SchemaFetcher();
      const result = await fetcher.fetchUrl(input);
      html = result.html;
    } else {
      html = `<script type="application/ld+json">${input}</script>`;
    }

    // Parse schemas
    const parser = new SchemaParser();
    const schemas = parser.parseHtml(html);

    // Validate
    const engine = new ValidationEngine();
    const results = await engine.validate(schemas);

    // Calculate overall score
    const overallScore = calculateOverallScore(results);

    // Store in database (async, don't wait)
    storeValidationHistory({
      url: source === 'url' ? input : null,
      sourceType: source,
      schemas,
      results,
      overallScore,
      userIp: ip
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      url: source === 'url' ? input : null,
      timestamp: new Date().toISOString(),
      overallScore,
      schemas: results,
      summary: {
        totalErrors: results.reduce((sum, r) => sum + r.errors.length, 0),
        totalWarnings: results.reduce((sum, r) => sum + r.warnings.length, 0),
        richResultsEligible: results.every(r => r.richResultsEligible)
      }
    });

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

## Frontend Components

### ValidationForm Component

```tsx
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export function ValidationForm() {
  const [mode, setMode] = useState<'url' | 'json-ld'>('url');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleValidate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: mode,
          input,
          options: {
            includeWarnings: true,
            checkImages: true
          }
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
        <TabsList>
          <TabsTrigger value="url">URL</TabsTrigger>
          <TabsTrigger value="json-ld">JSON-LD</TabsTrigger>
        </TabsList>

        <TabsContent value="url" className="space-y-4">
          <Input
            type="url"
            placeholder="https://example.com/article"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </TabsContent>

        <TabsContent value="json-ld" className="space-y-4">
          <Textarea
            placeholder='{"@context": "https://schema.org", ...}'
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </TabsContent>
      </Tabs>

      <Button
        onClick={handleValidate}
        disabled={!input || loading}
        className="mt-4 w-full"
      >
        {loading ? 'Validating...' : 'Validate Schema'}
      </Button>

      {result && <ResultsDisplay result={result} />}
    </div>
  );
}
```

## Testing Strategy

### Unit Tests (Vitest)
- `parser.test.ts`: JSON-LD extraction, @graph handling
- `validator.test.ts`: Validation logic for each rule
- `rules/article.test.ts`: Article-specific validation rules

### Integration Tests
- `/api/validate`: End-to-end API validation
- Database queries and caching

### E2E Tests (Playwright)
- User flow: Enter URL → View results → Fix errors
- JSON-LD validation flow
- Batch validation flow

## Deployment Plan

### Phase 1: MVP Deployment
1. **Setup Vercel project**
   ```bash
   vercel login
   vercel link
   vercel env pull .env.local
   ```

2. **Configure environment variables**
   - `DATABASE_URL`: VPS Supabase connection
   - `KV_URL`: Cloudflare KV or Vercel KV
   - `RATE_LIMIT_REQUESTS`: 10
   - `RATE_LIMIT_WINDOW`: 60000 (1 minute)

3. **Deploy to preview**
   ```bash
   vercel --prod
   ```

4. **Verify production**
   - Test all API endpoints
   - Run Lighthouse audit
   - Check error logging

### Performance Optimizations

1. **Caching Strategy**
   - Cache validation results by URL hash (TTL: 1 hour)
   - Cache schema type definitions in memory
   - CDN caching for static assets

2. **Edge Runtime**
   - Use Edge Runtime for API routes when possible
   - Reduce cold start times

3. **Database Optimization**
   - Index on `url` and `created_at`
   - Periodic cleanup of old validation history (> 30 days)

## Monitoring & Observability

- **Vercel Analytics**: Page views, performance metrics
- **Error tracking**: Sentry or similar
- **API monitoring**: Response times, error rates
- **Database monitoring**: Query performance, connection pool

## Security Measures

1. **Rate Limiting**: 10 requests/minute per IP
2. **Input Validation**: Sanitize all URLs and JSON input
3. **HTTPS Only**: Force HTTPS in production
4. **CSP Headers**: Restrict inline scripts
5. **CORS**: Whitelist origins for API access

---

**Implementation Timeline:**
- Week 1: Database setup, backend validation engine
- Week 2: API routes, frontend components
- Week 3: Testing, optimization
- Week 4: Deployment, monitoring setup

**Next: Break down into actionable tasks**
