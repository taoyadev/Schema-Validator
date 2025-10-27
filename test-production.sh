#!/bin/bash

PROD_URL="https://schema-validator-460f6yqt3-discoverprofiles-projects.vercel.app"

echo "Testing Schema Validator Production Deployment"
echo "=============================================="
echo ""

# Test 1: Homepage
echo "1. Testing Homepage..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL")
if [ "$STATUS" = "200" ]; then
  echo "✓ Homepage loads successfully (200)"
else
  echo "✗ Homepage failed with status: $STATUS"
fi
echo ""

# Test 2: API Health
echo "2. Testing API Validation Endpoint..."
RESPONSE=$(curl -s -X POST "$PROD_URL/api/validate" \
  -H "Content-Type: application/json" \
  -d '{"source":"json-ld","input":"{\"@context\":\"https://schema.org\",\"@type\":\"Article\",\"headline\":\"Test\",\"image\":\"https://example.com/img.jpg\",\"datePublished\":\"2025-10-26T10:00:00Z\",\"author\":{\"@type\":\"Person\",\"name\":\"Author\"}}"}')

SUCCESS=$(echo "$RESPONSE" | jq -r '.success' 2>/dev/null)
SCORE=$(echo "$RESPONSE" | jq -r '.overallScore' 2>/dev/null)

if [ "$SUCCESS" = "true" ]; then
  echo "✓ API validation works (Score: $SCORE)"
else
  echo "✗ API validation failed"
  echo "Response: $RESPONSE"
fi
echo ""

# Test 3: Invalid Input Handling
echo "3. Testing Error Handling..."
ERROR_RESPONSE=$(curl -s -X POST "$PROD_URL/api/validate" \
  -H "Content-Type: application/json" \
  -d '{"source":"json-ld","input":"{invalid json}"}')

ERROR_MSG=$(echo "$ERROR_RESPONSE" | jq -r '.error' 2>/dev/null)
if [ -n "$ERROR_MSG" ] && [ "$ERROR_MSG" != "null" ]; then
  echo "✓ Error handling works correctly"
  echo "  Error message: $ERROR_MSG"
else
  echo "✗ Error handling may have issues"
fi
echo ""

# Test 4: Rate Limiting
echo "4. Testing Rate Limiting (making 12 rapid requests)..."
RATE_LIMITED=false
for i in {1..12}; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$PROD_URL/api/validate" \
    -H "Content-Type: application/json" \
    -d '{"source":"json-ld","input":"{}"}')
  if [ "$STATUS" = "429" ]; then
    RATE_LIMITED=true
    break
  fi
done

if [ "$RATE_LIMITED" = true ]; then
  echo "✓ Rate limiting is working (got 429 status)"
else
  echo "⚠ Rate limiting may not be enforced (all requests succeeded)"
fi
echo ""

echo "=============================================="
echo "Production Testing Complete!"
echo ""
echo "Production URL: $PROD_URL"
echo "Next steps:"
echo "  - Test UI manually in browser"
echo "  - Monitor logs: vercel logs $PROD_URL"
echo "  - Set up monitoring and alerts"
