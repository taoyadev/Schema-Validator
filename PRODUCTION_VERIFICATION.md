# Production Verification Guide

## Quick Verification Steps

### 1. Test Homepage
```bash
curl -I https://schema-validator-460f6yqt3-discoverprofiles-projects.vercel.app
# Expected: HTTP 200 OK
```

### 2. Test API Validation
```bash
curl -X POST https://schema-validator-460f6yqt3-discoverprofiles-projects.vercel.app/api/validate \
  -H "Content-Type: application/json" \
  -d '{
    "source": "json-ld",
    "input": "{\"@context\":\"https://schema.org\",\"@type\":\"Article\",\"headline\":\"Test Article\",\"image\":\"https://example.com/image.jpg\",\"datePublished\":\"2025-10-26T10:00:00Z\",\"author\":{\"@type\":\"Person\",\"name\":\"Test Author\"}}"
  }'
```

Expected response:
```json
{
  "success": true,
  "overallScore": 92,
  "schemas": [...],
  "summary": {
    "totalErrors": 0,
    "totalWarnings": 1,
    "richResultsEligible": true
  }
}
```

### 3. Test Error Handling
```bash
curl -X POST https://schema-validator-460f6yqt3-discoverprofiles-projects.vercel.app/api/validate \
  -H "Content-Type: application/json" \
  -d '{"source":"json-ld","input":"{invalid}"}'
```

Expected: Error response with helpful message

### 4. Test Rate Limiting
Run 12 rapid requests - should get 429 (Too Many Requests) after 10 requests

### 5. Manual UI Testing

Visit: https://schema-validator-460f6yqt3-discoverprofiles-projects.vercel.app

Test scenarios:
1. ✓ Homepage loads with validation form
2. ✓ Switch between URL and JSON-LD tabs
3. ✓ Enter valid JSON-LD and validate
4. ✓ See results with score, errors, warnings
5. ✓ Enter invalid JSON-LD and see error messages
6. ✓ Test on mobile viewport (responsive design)

### 6. Verify Deployment Status
```bash
vercel ls schema-validator
# Should show "● Ready" status
```

### 7. Check Logs
```bash
vercel logs https://schema-validator-460f6yqt3-discoverprofiles-projects.vercel.app
```

## Test Examples

### Valid Article Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Complete Article Example",
  "image": "https://example.com/image.jpg",
  "datePublished": "2025-10-26T10:00:00Z",
  "dateModified": "2025-10-26T12:00:00Z",
  "author": {
    "@type": "Person",
    "name": "John Doe",
    "url": "https://example.com/author/john"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Example Publisher",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  }
}
```

### Invalid Article (Missing Required Properties)
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Incomplete Article"
}
```
Expected errors: Missing image, datePublished, author

### Valid Product Schema
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Example Product",
  "image": "https://example.com/product.jpg",
  "description": "Product description",
  "offers": {
    "@type": "Offer",
    "price": "29.99",
    "priceCurrency": "USD"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "100"
  }
}
```

## Performance Benchmarks

Target metrics:
- Response Time (p95): < 2 seconds
- Bundle Size: < 200 KB
- Lighthouse Performance: > 90
- Lighthouse Accessibility: 100

## Monitoring Checklist

- [ ] Homepage loads successfully
- [ ] API endpoint responds correctly
- [ ] Error handling works
- [ ] Rate limiting enforces limits
- [ ] Mobile responsive design works
- [ ] All validation rules function correctly
- [ ] Fix suggestions are helpful
- [ ] Documentation links work

## Troubleshooting

### If homepage doesn't load:
1. Check Vercel deployment status
2. Check build logs for errors
3. Verify environment variables
4. Try redeploying

### If API returns errors:
1. Check request format
2. Verify JSON is valid
3. Check rate limit status
4. Review API logs

### If validation seems incorrect:
1. Compare with Google Rich Results Test
2. Check validation rules in `lib/validation/rules/`
3. Review test cases
4. Check Schema.org documentation

## Success Criteria

✅ All manual tests pass
✅ API responds within 2 seconds
✅ Error messages are clear
✅ UI is responsive on mobile
✅ Rate limiting works
✅ No console errors
✅ Lighthouse scores meet targets

---

**Production URL**: https://schema-validator-460f6yqt3-discoverprofiles-projects.vercel.app
**Last Updated**: October 26, 2025
