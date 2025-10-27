#!/bin/bash

# Test the validation API with sample Article JSON-LD

curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{
    "source": "json-ld",
    "input": "{\"@context\":\"https://schema.org\",\"@type\":\"Article\",\"headline\":\"Test Article for Schema Validation\",\"image\":\"https://example.com/image.jpg\",\"datePublished\":\"2024-01-01T00:00:00Z\",\"author\":{\"@type\":\"Person\",\"name\":\"John Doe\"},\"publisher\":{\"@type\":\"Organization\",\"name\":\"Test Publisher\",\"logo\":{\"@type\":\"ImageObject\",\"url\":\"https://example.com/logo.jpg\"}}}"
  }' | jq .
