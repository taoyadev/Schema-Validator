# Feature Specification: Core Schema Validation Engine

**Feature ID**: 001
**Status**: Planning
**Priority**: P0 (Critical)
**Created**: 2025-10-26

## What & Why

### Problem Statement
SEO professionals and web developers need to validate their Schema.org structured data to ensure:
1. Google can parse and display rich results correctly
2. Structured data follows Schema.org specifications
3. Implementation matches SEO best practices
4. Errors are caught before going to production

**Current Pain Points:**
- Google Rich Results Test is slow and sometimes unreliable
- Existing validators lack detailed SEO-focused recommendations
- No batch validation for multiple URLs
- Generic error messages don't explain SEO impact

### User Stories

#### US-001: Single URL Validation
**As an** SEO professional
**I want to** paste a URL and get instant Schema validation results
**So that** I can verify my client's website has correct structured data

**Acceptance Criteria:**
- User can paste any public URL
- System fetches HTML content
- Extracts all JSON-LD, Microdata, and RDFa markup
- Validates against Schema.org specs
- Displays errors, warnings, and recommendations
- Shows preview of how Google sees the data
- Response time < 2 seconds

#### US-002: JSON-LD Direct Validation
**As a** web developer
**I want to** paste JSON-LD code directly for validation
**So that** I can test schema before deploying to production

**Acceptance Criteria:**
- Text area for pasting JSON-LD code
- Real-time syntax validation as user types
- Semantic validation against Schema.org
- Google Rich Results eligibility check
- Provides fix suggestions with examples

#### US-003: Batch URL Validation
**As an** SEO agency
**I want to** upload a CSV of URLs for bulk validation
**So that** I can audit entire websites efficiently

**Acceptance Criteria:**
- Upload CSV with URLs (max 100 per batch)
- Queue-based processing
- Progress indicator
- Downloadable CSV report with results
- Summary dashboard of errors by type

#### US-004: Schema Type Detection
**As a** content manager
**I want** the tool to auto-detect Schema types on my page
**So that** I know what structured data is present

**Acceptance Criteria:**
- Automatic detection of all Schema types
- Visual display of Schema hierarchy
- Highlighting of missing required properties
- Suggestions for additional beneficial schemas

## Validation Rules & Coverage

### Schema Types (Priority Order)

**Phase 1 (MVP):**
1. Article (NewsArticle, BlogPosting)
2. Organization
3. Product + AggregateRating
4. BreadcrumbList
5. WebSite + SearchAction

**Phase 2:**
6. LocalBusiness
7. FAQ
8. HowTo
9. Recipe
10. VideoObject

**Phase 3:**
11. Event
12. Course
13. JobPosting
14. Review

### Validation Levels

#### 1. Syntax Validation
- Valid JSON-LD format
- Proper @context declaration
- Correct @type values
- No syntax errors

#### 2. Schema.org Compliance
- Required properties present
- Correct property types (Text, URL, Date, etc.)
- Valid value formats (ISO 8601 dates, URLs)
- Proper nesting and relationships

#### 3. Google Rich Results Requirements
- Meets minimum requirements for rich results
- Recommended properties for enhanced display
- Image size/format requirements
- Content policy compliance

#### 4. SEO Best Practices
- Completeness score (% of recommended properties filled)
- Duplicate schema detection
- Cross-page consistency checks
- Mobile-friendly considerations

## User Interface Design

### Main Page Layout

```
┌─────────────────────────────────────────────────┐
│ Schema-Validator                    [Docs] [API]│
├─────────────────────────────────────────────────┤
│                                                 │
│  Validate Your Structured Data                 │
│  ────────────────────────────────────────────  │
│                                                 │
│  [Tab: URL] [Tab: JSON-LD] [Tab: Batch]        │
│                                                 │
│  Enter URL to validate:                        │
│  ┌─────────────────────────────────────────┐   │
│  │ https://example.com/article             │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  [Validate] [Advanced Options ▼]               │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Results Display

```
┌─────────────────────────────────────────────────┐
│ Validation Results for: example.com/article     │
├─────────────────────────────────────────────────┤
│                                                 │
│ ✅ Overall Score: 92/100                        │
│                                                 │
│ Schemas Detected:                               │
│ • Article                           [Expand ▼] │
│ • Organization                      [Expand ▼] │
│ • BreadcrumbList                    [Expand ▼] │
│                                                 │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ │
│                                                 │
│ ���� 2 Errors (Must Fix)                         │
│ 🟡 3 Warnings (Recommended)                    │
│ 🟢 5 Passed                                    │
│                                                 │
│ ─────────────────────────────────────────────  │
│                                                 │
│ 🔴 ERROR: Article missing required property    │
│                                                 │
│   Property: "datePublished"                    │
│   Schema Type: Article                         │
│   Line: ~                                      │
│                                                 │
│   Why it matters:                              │
│   Google requires datePublished for Article    │
│   rich results. Without it, your content won't │
│   appear in Top Stories or article carousels.  │
│                                                 │
│   How to fix:                                  │
│   Add the publication date in ISO 8601 format: │
│                                                 │
│   "datePublished": "2025-10-26T10:00:00Z"      │
│                                                 │
│   [Copy Fix] [Learn More]                     │
│                                                 │
└─────────────────────────────────────────────────┘
```

## Technical Requirements

### Input Methods
1. **URL Fetching**
   - Support HTTPS URLs
   - Follow redirects (max 3)
   - Handle timeouts (5 second limit)
   - Respect robots.txt
   - Custom User-Agent

2. **JSON-LD Extraction**
   - Parse `<script type="application/ld+json">` tags
   - Handle escaped JSON
   - Support multiple JSON-LD blocks
   - Detect and merge @graph arrays

3. **Microdata/RDFa Support** (Phase 2)
   - Parse microdata attributes
   - Convert to JSON-LD equivalent
   - Validate combined markup

### Validation Engine Architecture

```
┌──────────────┐
│ Input Source │
│ (URL/JSON-LD)│
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  Fetch/Parse │
│              │
└──────┬───────┘
       │
       ▼
┌──────────────────────────┐
│ Syntax Validator         │
│ - JSON validity          │
│ - @context/@type present │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Schema.org Validator     │
│ - Required properties    │
│ - Type checking          │
│ - Format validation      │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ Google Rich Results      │
│ - Eligibility checks     │
│ - Recommended properties │
└──────┬───────────────────┘
       │
       ▼
┌──────────────────────────┐
│ SEO Enhancement          │
│ - Completeness score     │
│ - Best practice checks   │
└──────┬───────────────────┘
       │
       ▼
┌──────────────┐
│ Report       │
│ Generation   │
└──────────────┘
```

### API Endpoints

#### POST /api/validate
**Request:**
```json
{
  "source": "url",
  "input": "https://example.com/page",
  "options": {
    "includeWarnings": true,
    "checkImages": true,
    "followLinks": false
  }
}
```

**Response:**
```json
{
  "success": true,
  "url": "https://example.com/page",
  "timestamp": "2025-10-26T10:30:00Z",
  "overallScore": 92,
  "schemas": [
    {
      "type": "Article",
      "errors": [
        {
          "severity": "error",
          "property": "datePublished",
          "message": "Required property missing",
          "fix": "Add \"datePublished\": \"2025-10-26T10:00:00Z\"",
          "seoImpact": "high",
          "documentation": "https://developers.google.com/..."
        }
      ],
      "warnings": [...],
      "passed": [...],
      "completeness": 85,
      "richResultsEligible": false
    }
  ],
  "recommendations": [...]
}
```

#### POST /api/validate/batch
**Request:**
```json
{
  "urls": [
    "https://example.com/page1",
    "https://example.com/page2"
  ],
  "email": "user@example.com" // optional for completion notification
}
```

**Response:**
```json
{
  "batchId": "uuid",
  "status": "processing",
  "totalUrls": 2,
  "processedUrls": 0,
  "estimatedCompletion": "2025-10-26T10:35:00Z"
}
```

#### GET /api/validate/batch/:batchId
**Response:**
```json
{
  "batchId": "uuid",
  "status": "completed",
  "results": [...],
  "summary": {
    "totalUrls": 2,
    "passed": 1,
    "warnings": 1,
    "errors": 0
  },
  "downloadUrl": "/downloads/batch-uuid.csv"
}
```

## Performance Requirements

- **Single URL validation**: < 2 seconds p95
- **Batch processing**: 5 URLs per second throughput
- **Concurrent users**: Support 100 simultaneous validations
- **Cache hit rate**: 80%+ for repeated URLs
- **API uptime**: 99.9%

## Security & Privacy

- Rate limiting: 10 requests/minute per IP (unauthenticated)
- No storage of validation results by default
- Optional: User can save results with authentication
- Sanitize all user inputs
- No execution of JavaScript from fetched pages
- HTTPS only

## Success Metrics

- **Accuracy**: 99%+ agreement with Google Rich Results Test
- **User satisfaction**: < 5% error reports
- **Performance**: 95% of validations < 2s
- **Adoption**: Track unique URLs validated per month
- **SEO impact**: User testimonials of improved rich results

## Out of Scope (Future Phases)

- User accounts and saved validations
- Monitoring/alerting for URL changes
- WordPress/CMS plugins
- API client libraries
- Slack/Discord integrations
- Custom validation rules

---

**Next Steps:**
1. Clarify ambiguities (if any)
2. Create technical implementation plan
3. Break down into tasks
4. Begin implementation
