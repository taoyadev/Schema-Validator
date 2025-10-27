# Schema-Validator Constitution

## Project Vision
Build the most accurate, user-friendly, and comprehensive Schema.org validation tool that helps SEO professionals and web developers ensure their structured data is Google-compliant and optimized for rich results.

## Core Principles

### 1. Data Accuracy & Reliability
- **NO MOCK DATA**: All validation uses real Schema.org specifications and Google's Rich Results Test requirements
- Production-quality validation from day one
- Keep validation rules synchronized with latest Schema.org and Google guidelines
- Provide accurate error detection with detailed fix recommendations

### 2. Code Quality Standards
- TypeScript strict mode, no `any` types
- Functional programming patterns, React hooks only
- 2 spaces indentation, single quotes
- Comprehensive test coverage (80%+ unit, integration, e2e)
- TDD approach for validation engine

### 3. Performance & UX Excellence
- Sub-second validation response time for single URLs
- Real-time validation feedback as user types JSON-LD
- Progressive enhancement: works without JavaScript for basic validation
- Accessible (WCAG 2.1 AA compliant)
- Mobile-responsive design

### 4. SEO-First Development
- Built by SEO professionals for SEO professionals
- Support all Google-recognized Schema types:
  - Article, BlogPosting, NewsArticle
  - Product, Review, AggregateRating
  - Organization, LocalBusiness
  - FAQ, HowTo, Recipe
  - BreadcrumbList, VideoObject
  - Event, Course, JobPosting
- Prioritize validation rules that impact Rich Results eligibility

### 5. Development Workflow
- Feature branch workflow with PR reviews
- Automated testing on every commit
- Continuous deployment to staging/production
- Semantic versioning
- Comprehensive documentation

### 6. User Privacy & Security
- No storage of user-submitted URLs or schemas without explicit consent
- Rate limiting to prevent abuse
- HTTPS-only in production
- No tracking beyond essential analytics

## Tech Stack Mandate

### Frontend
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Language**: TypeScript strict mode
- **State**: React hooks, SWR for data fetching
- **Testing**: Vitest, React Testing Library, Playwright

### Backend
- **API**: Next.js API Routes / Edge Functions
- **Validation Engine**: Custom TypeScript validator
- **Schema Parsing**: cheerio for HTML parsing, JSON-LD extraction
- **External APIs**: Google Rich Results Test API (if available)
- **Caching**: Redis/Cloudflare KV for validation results

### Database
- **Primary**: PostgreSQL (VPS Supabase)
- **Schema**: `schema_validator` namespace
- **Tables**:
  - validation_history
  - schema_types
  - validation_rules
  - user_reports (optional analytics)

### Infrastructure
- **Hosting**: Vercel (frontend + API routes)
- **CDN**: Cloudflare
- **Monitoring**: Vercel Analytics
- **Deployment**: Automatic via GitHub Actions

## Quality Gates

### Every PR Must Pass:
1. TypeScript compilation (no errors)
2. ESLint (no warnings)
3. Unit tests (80%+ coverage)
4. Integration tests (all critical paths)
5. E2E tests (core user flows)
6. Lighthouse score (90+ Performance, 100 Accessibility)
7. Bundle size check (< 200KB initial load)

### Before Production:
1. Security audit (dependencies, API endpoints)
2. Performance testing (load test validation endpoint)
3. Cross-browser testing (Chrome, Firefox, Safari, Edge)
4. Mobile device testing (iOS, Android)
5. Schema validation against real-world examples

## Success Metrics

### Technical KPIs:
- 99.9% uptime
- < 500ms p95 validation latency
- < 2s initial page load
- 0 critical security vulnerabilities

### User KPIs:
- Validation accuracy: 99%+ match with Google Rich Results Test
- User retention: Track repeat usage
- Error detection rate: Measure true positives vs false positives

## Non-Negotiables

1. **Never compromise accuracy for speed** - Validation must be correct first, fast second
2. **No paid features for basic validation** - Core validation always free
3. **Privacy-first** - Don't store user data without explicit consent
4. **Open documentation** - Explain why each error matters for SEO
5. **Accessible to all** - No CAPTCHA barriers, screen reader compatible

---

**Last Updated**: 2025-10-26
**Version**: 1.0.0
**Status**: Active
