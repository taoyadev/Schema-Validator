# Implementation Tasks: Schema Validation Engine

**Feature**: 001-core-validation-engine
**Sprint**: Week 1-4
**Status**: Ready for Implementation

## Task Breakdown

### Phase 1: Project Setup & Infrastructure (Day 1)

#### T-001: Initialize Next.js Project
- [ ] Create Next.js 14 app with TypeScript
- [ ] Configure Tailwind CSS
- [ ] Setup shadcn/ui
- [ ] Configure ESLint + Prettier
- [ ] Setup Git repository
- [ ] Create `.env.example`
**Estimate**: 2h

#### T-002: Database Setup
- [ ] Connect to VPS Supabase
- [ ] Create `schema_validator` schema
- [ ] Create tables: validation_history, batch_jobs, schema_types, validation_rules
- [ ] Add indexes
- [ ] Seed schema_types table
- [ ] Test connection
**Estimate**: 3h

#### T-003: Testing Infrastructure
- [ ] Setup Vitest
- [ ] Configure React Testing Library
- [ ] Setup Playwright for E2E
- [ ] Create test utilities
- [ ] Add test scripts to package.json
**Estimate**: 2h

---

### Phase 2: Core Validation Engine (Day 2-5)

#### T-004: Schema Fetcher Implementation
**File**: `lib/validation/fetcher.ts`
- [ ] Implement URL validation
- [ ] Add fetch with timeout (5s)
- [ ] Handle redirects (max 3)
- [ ] Error handling (timeout, DNS, SSL)
- [ ] Unit tests with mock responses
**Estimate**: 4h
**Tests**: `tests/unit/fetcher.test.ts`

#### T-005: Schema Parser Implementation
**File**: `lib/validation/parser.ts`
- [ ] HTML parsing with cheerio
- [ ] Extract JSON-LD script tags
- [ ] Parse JSON-LD blocks
- [ ] Handle @graph arrays
- [ ] Normalize @context
- [ ] Handle malformed JSON gracefully
- [ ] Unit tests with real-world examples
**Estimate**: 6h
**Tests**: `tests/unit/parser.test.ts`

#### T-006: Validation Rules - Article
**File**: `lib/validation/rules/article.ts`
- [ ] Define required properties (headline, image, datePublished, author)
- [ ] Type validation for each property
- [ ] Format validation (dates, URLs)
- [ ] Image size requirements
- [ ] Google Rich Results requirements
- [ ] Unit tests for all rules
**Estimate**: 4h
**Tests**: `tests/unit/rules/article.test.ts`

#### T-007: Validation Rules - Product
**File**: `lib/validation/rules/product.ts`
- [ ] Required properties (name, image, offers)
- [ ] Offers validation (price, currency)
- [ ] AggregateRating validation
- [ ] Unit tests
**Estimate**: 3h
**Tests**: `tests/unit/rules/product.test.ts`

#### T-008: Validation Rules - Organization
**File**: `lib/validation/rules/organization.ts`
- [ ] Required properties (name, url)
- [ ] Logo validation
- [ ] ContactPoint validation
- [ ] Unit tests
**Estimate**: 2h
**Tests**: `tests/unit/rules/organization.test.ts`

#### T-009: Validation Rules - BreadcrumbList
**File**: `lib/validation/rules/breadcrumb.ts`
- [ ] itemListElement validation
- [ ] Position ordering
- [ ] Unit tests
**Estimate**: 2h

#### T-010: Core Validation Engine
**File**: `lib/validation/validator.ts`
- [ ] Syntax validation layer
- [ ] Schema.org validation layer
- [ ] Google Rich Results layer
- [ ] SEO enhancement layer
- [ ] Completeness score calculation
- [ ] Report generation
- [ ] Integration tests with multiple schemas
**Estimate**: 8h
**Tests**: `tests/unit/validator.test.ts`, `tests/integration/validation.test.ts`

---

### Phase 3: API Implementation (Day 6-8)

#### T-011: Validation API Endpoint
**File**: `app/api/validate/route.ts`
- [ ] POST handler implementation
- [ ] Request validation
- [ ] Rate limiting (10/min per IP)
- [ ] Call SchemaFetcher
- [ ] Call SchemaParser
- [ ] Call ValidationEngine
- [ ] Response formatting
- [ ] Error handling
- [ ] Database logging (async)
- [ ] Integration tests
**Estimate**: 6h
**Tests**: `tests/integration/api.test.ts`

#### T-012: Batch Validation API
**File**: `app/api/validate/batch/route.ts`
- [ ] Batch job creation
- [ ] Queue-based processing
- [ ] Progress tracking
- [ ] Email notifications (optional)
- [ ] CSV export
- [ ] Tests
**Estimate**: 5h

#### T-013: Database Client & Queries
**File**: `lib/db/`
- [ ] Supabase client setup
- [ ] Query functions for validation_history
- [ ] Query functions for batch_jobs
- [ ] Query functions for schema_types
- [ ] Connection pooling
- [ ] Error handling
**Estimate**: 3h

#### T-014: Caching Layer
**File**: `lib/cache/kv.ts`
- [ ] Setup Vercel KV or Cloudflare KV
- [ ] Cache validation results by URL hash
- [ ] TTL: 1 hour
- [ ] Cache invalidation
**Estimate**: 2h

---

### Phase 4: Frontend Implementation (Day 9-12)

#### T-015: UI Components Setup
- [ ] Install and configure shadcn/ui
- [ ] Create base components: Button, Input, Textarea, Card, Tabs
- [ ] Create layout: Header, Footer
- [ ] Responsive design
**Estimate**: 3h

#### T-016: ValidationForm Component
**File**: `components/validation/ValidationForm.tsx`
- [ ] Tabs for URL / JSON-LD input
- [ ] Input validation
- [ ] Submit button with loading state
- [ ] Error handling
- [ ] Unit tests
**Estimate**: 4h
**Tests**: `tests/unit/components/ValidationForm.test.tsx`

#### T-017: ResultsDisplay Component
**File**: `components/validation/ResultsDisplay.tsx`
- [ ] Overall score display
- [ ] Schema list with expand/collapse
- [ ] Error/warning/pass counts
- [ ] Component tests
**Estimate**: 4h

#### T-018: SchemaCard Component
**File**: `components/validation/SchemaCard.tsx`
- [ ] Schema type icon/badge
- [ ] Expandable details
- [ ] Error list display
- [ ] Rich Results eligibility indicator
- [ ] Tests
**Estimate**: 3h

#### T-019: ErrorList Component
**File**: `components/validation/ErrorList.tsx`
- [ ] Error item with severity indicator
- [ ] Property name highlight
- [ ] Fix suggestion display
- [ ] Copy fix button
- [ ] Learn more link
- [ ] Tests
**Estimate**: 3h

#### T-020: ScoreIndicator Component
**File**: `components/validation/ScoreIndicator.tsx`
- [ ] Circular progress indicator
- [ ] Color coding (green/yellow/red)
- [ ] Animated transitions
- [ ] Tests
**Estimate**: 2h

#### T-021: Homepage Design
**File**: `app/page.tsx`
- [ ] Hero section with tagline
- [ ] ValidationForm integration
- [ ] Example schemas section
- [ ] Feature highlights
- [ ] SEO optimization (meta tags)
**Estimate**: 4h

---

### Phase 5: Testing & Quality Assurance (Day 13-15)

#### T-022: Unit Test Coverage
- [ ] Achieve 80%+ coverage for all modules
- [ ] Test edge cases in parser
- [ ] Test validation rules thoroughly
- [ ] Mock external dependencies
**Estimate**: 6h

#### T-023: Integration Tests
- [ ] API endpoint tests
- [ ] Database integration tests
- [ ] Cache integration tests
- [ ] End-to-end validation flow
**Estimate**: 4h

#### T-024: E2E Tests with Playwright
**File**: `tests/e2e/validation-flow.spec.ts`
- [ ] User enters URL and validates
- [ ] User enters JSON-LD and validates
- [ ] Error display and fix suggestions
- [ ] Mobile responsiveness tests
**Estimate**: 4h

#### T-025: Performance Testing
- [ ] Load test validation endpoint (100 concurrent requests)
- [ ] Measure response times (target: p95 < 2s)
- [ ] Database query optimization
- [ ] Bundle size optimization (target: < 200KB)
**Estimate**: 3h

#### T-026: Accessibility Audit
- [ ] Run axe DevTools
- [ ] Keyboard navigation testing
- [ ] Screen reader testing
- [ ] WCAG 2.1 AA compliance
**Estimate**: 2h

---

### Phase 6: Documentation & Deployment (Day 16-18)

#### T-027: API Documentation
**File**: `docs/api.md`
- [ ] Document /api/validate endpoint
- [ ] Document /api/validate/batch endpoint
- [ ] Example requests/responses
- [ ] Error codes reference
**Estimate**: 2h

#### T-028: User Documentation
**File**: `docs/user-guide.md`
- [ ] How to validate a URL
- [ ] How to validate JSON-LD
- [ ] Understanding validation results
- [ ] Common errors and fixes
**Estimate**: 2h

#### T-029: README & Contributing Guide
- [ ] Project overview
- [ ] Installation instructions
- [ ] Development workflow
- [ ] Contributing guidelines
**Estimate**: 1h

#### T-030: Environment Configuration
- [ ] Setup Vercel project
- [ ] Configure environment variables
- [ ] Setup production database
- [ ] Configure Cloudflare KV
**Estimate**: 2h

#### T-031: Deployment to Vercel
- [ ] Deploy to preview environment
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Configure custom domain (if available)
**Estimate**: 2h

#### T-032: Monitoring Setup
- [ ] Setup Vercel Analytics
- [ ] Configure error tracking (Sentry)
- [ ] Setup uptime monitoring
- [ ] Create dashboard for key metrics
**Estimate**: 2h

---

### Phase 7: Post-Launch (Day 19-20)

#### T-033: Production Validation
- [ ] Test all features in production
- [ ] Validate real-world URLs (top 10 sites)
- [ ] Compare results with Google Rich Results Test
- [ ] Fix any discrepancies
**Estimate**: 4h

#### T-034: Performance Monitoring
- [ ] Monitor response times
- [ ] Check database performance
- [ ] Optimize slow queries
- [ ] Review error logs
**Estimate**: 2h

#### T-035: User Feedback Collection
- [ ] Add feedback form
- [ ] Monitor error reports
- [ ] Collect validation accuracy feedback
**Estimate**: 2h

---

## Task Dependencies

```
T-001 (Next.js Setup)
  └─> T-003 (Testing Setup)
  └─> T-015 (UI Components)

T-002 (Database Setup)
  └─> T-013 (DB Client)

T-004 (Fetcher)
  └─> T-010 (Validation Engine)

T-005 (Parser)
  └─> T-010 (Validation Engine)

T-006, T-007, T-008, T-009 (Rules)
  └─> T-010 (Validation Engine)

T-010 (Validation Engine)
  └─> T-011 (API Endpoint)

T-011 (API Endpoint)
  └─> T-016 (ValidationForm)

T-016, T-017, T-018, T-019, T-020 (Components)
  └─> T-021 (Homepage)

T-021 (Homepage)
  └─> T-024 (E2E Tests)

All Implementation Tasks
  └─> T-022, T-023 (Testing)
  └─> T-030, T-031 (Deployment)
```

## Sprint Schedule

### Sprint 1 (Days 1-5): Foundation
- T-001 to T-010
- **Goal**: Core validation engine working

### Sprint 2 (Days 6-10): API & Frontend
- T-011 to T-021
- **Goal**: Full validation flow end-to-end

### Sprint 3 (Days 11-15): Testing & Polish
- T-022 to T-026
- **Goal**: Production-ready quality

### Sprint 4 (Days 16-20): Deploy & Monitor
- T-027 to T-035
- **Goal**: Live in production

---

## Success Criteria

- [ ] All tests passing (unit, integration, e2e)
- [ ] Test coverage > 80%
- [ ] Lighthouse score: Performance 90+, Accessibility 100
- [ ] Bundle size < 200KB
- [ ] API response time p95 < 2s
- [ ] Deployed to production on Vercel
- [ ] Validated against 10 real-world URLs successfully
- [ ] 99%+ accuracy vs Google Rich Results Test

**Next: Begin implementation starting with T-001**
