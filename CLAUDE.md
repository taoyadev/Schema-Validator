# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Schema.org Validator - A production-ready Next.js 14 application that validates Schema.org structured data with Google Rich Results compliance checking. Built with TypeScript (strict mode), Tailwind CSS, and shadcn/ui components.

## Development Commands

```bash
# Development
npm run dev              # Start dev server at localhost:3000

# Testing
npm test                 # Run Vitest unit tests
npm run test:ui          # Run tests with Vitest UI
npm run test:coverage    # Generate test coverage report
npm run test:e2e         # Run Playwright E2E tests
npm run test:e2e:ui      # Run E2E tests with Playwright UI

# Build & Deploy
npm run build            # Production build
npm start                # Run production server locally
npm run type-check       # TypeScript type checking without emit
npm run lint             # Next.js linting

# Testing single file
npx vitest lib/validation/__tests__/validator.test.ts
```

## Architecture

### 4-Layer Validation Engine

The core validation system is implemented in `lib/validation/validator.ts` with a layered approach:

1. **Syntax Validation** - JSON-LD structure (@context, @type)
2. **Schema.org Compliance** - Required properties per schema type
3. **Google Rich Results** - Image dimensions, eligibility criteria
4. **SEO Recommendations** - Completeness scoring, optional properties

### Request Flow

```
API Route → Fetcher → Parser → Validator → Response
/api/validate/route.ts
  ↓
SchemaFetcher (lib/validation/fetcher.ts)
  - Fetches URL with security checks
  - Handles redirects, timeouts
  ↓
SchemaParser (lib/validation/parser.ts)
  - Extracts JSON-LD from HTML using Cheerio
  - Handles multiple schema blocks
  ↓
ValidationEngine (lib/validation/validator.ts)
  - Applies rule sets from lib/validation/rules/
  - Generates errors, warnings, passed checks
  - Calculates scores and eligibility
```

### Schema Rules System

Rules are defined per schema type in `lib/validation/rules/`:
- `article.ts` - Article, NewsArticle, BlogPosting
- `product.ts` - Product, AggregateRating, Offer
- `organization.ts` - Organization, LocalBusiness
- `breadcrumb.ts` - BreadcrumbList, ListItem
- `index.ts` - Central registry and exports

Each rule defines:
- `required`: boolean (mandatory vs recommended)
- `type`: expected Schema.org type or primitive
- `minLength/maxLength`: string constraints
- `format`: ISO8601, URL patterns
- `googleRequirement`: Rich Results criteria (image dimensions)
- `seoImpact`: high/medium/low scoring weight
- `fix`: actionable remediation text

### Type System

Core types in `lib/validation/types.ts`:
- `ParsedSchema` - Extracted JSON-LD structure
- `ValidationRule` - Rule definition with constraints
- `ValidationResult` - Complete validation output
- `ValidationRequest/Response` - API contracts

Type hierarchy support:
- NewsArticle/BlogPosting inherit Article rules
- LocalBusiness inherits Organization rules

### Components

UI split between shadcn/ui primitives (`components/ui/`) and validation-specific:
- `ValidationForm.tsx` - Dual-mode input (URL/JSON-LD) with tabs
- `ResultsDisplay.tsx` - Score visualization, error/warning/pass lists

### Rate Limiting

In-memory Map in `app/api/validate/route.ts`:
- 10 requests/minute per IP
- 60-second window reset
- **Production note**: Replace with Redis/Upstash for multi-instance deployments

## Testing

Test files use Vitest and are colocated in `__tests__/` directories:
- `lib/validation/__tests__/parser.test.ts` - HTML to JSON-LD extraction
- `lib/validation/__tests__/validator.test.ts` - Validation engine logic

When writing tests:
- Use `describe` blocks per validation layer
- Test both valid and invalid schema structures
- Include edge cases (missing required fields, wrong types)
- Verify SEO scoring calculations

## Key Constraints

### Google Rich Results Requirements

From validation rules:
- Article images: ≥696x400px
- Headlines: 10-110 characters
- Dates: ISO 8601 format
- Publisher must have logo as ImageObject

### SEO Scoring Algorithm

```typescript
// lib/validation/validator.ts:521
// Starts at 100, deducts:
// - High impact error: -20
// - Medium impact error: -10
// - Low impact error: -5
// - High impact warning: -10
// - Medium impact warning: -5
// - Low impact warning: -2
```

### Path Aliases

Configured in `tsconfig.json` and `vitest.config.ts`:
- `@/` → project root
- Import as: `import { SchemaFetcher } from '@/lib/validation/fetcher'`

## Deployment

Vercel deployment configured with Next.js 14. Optional environment variables:
- `DATABASE_URL` - PostgreSQL for validation history (planned feature)
- `NEXT_PUBLIC_API_URL` - CORS configuration for public API

## Adding New Schema Types

1. Create rule file in `lib/validation/rules/{type}.ts`:
   ```typescript
   import { ValidationRule } from '../types';

   export const mySchemaRules: ValidationRule[] = [
     {
       property: 'name',
       required: true,
       type: 'string',
       seoImpact: 'high',
       errorMessage: 'name is required',
       fix: 'Add "name": "..."',
       documentation: 'https://schema.org/name'
     }
   ];
   ```

2. Register in `lib/validation/rules/index.ts`:
   ```typescript
   import { mySchemaRules } from './myschema';

   export const schemaRulesMap: Record<string, ValidationRule[]> = {
     MySchema: mySchemaRules,
     // ...existing types
   };
   ```

3. Add type to Rich Results eligibility in `lib/validation/validator.ts:553`:
   ```typescript
   const richResultsTypes = [
     'Article', 'Product', 'MySchema', // ...
   ];
   ```

4. Write tests in `lib/validation/__tests__/validator.test.ts`
