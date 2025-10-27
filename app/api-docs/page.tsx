'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy, CheckCircle2, PlayCircle } from 'lucide-react';

export default function APIDocsPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            API Documentation
          </h1>
          <p className="text-lg text-gray-600">
            Integrate Schema.org validation into your applications with our RESTful API
          </p>
        </div>

        {/* Quick Start */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5" />
              Quick Start
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Base URL</h3>
              <CodeBlock
                code={`${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/v1`}
                id="base-url"
                onCopy={copyToClipboard}
                copied={copiedId === 'base-url'}
              />
            </div>

            <div>
              <h3 className="font-semibold mb-2">Authentication</h3>
              <p className="text-sm text-gray-600">
                No authentication required. Rate limited to 30 requests per minute per IP.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Endpoints */}
        <div className="space-y-8">
          <EndpointSection
            method="POST"
            path="/validate"
            title="Validate Schema"
            description="Validate structured data from a URL or raw JSON-LD"
            onCopy={copyToClipboard}
            copiedId={copiedId}
          />
        </div>

        {/* Rate Limiting */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Rate Limiting</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              The API is rate limited to ensure fair usage:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
              <li>30 requests per minute per IP address</li>
              <li>Rate limit headers included in responses</li>
              <li>HTTP 429 status code returned when limit exceeded</li>
            </ul>
          </CardContent>
        </Card>

        {/* Error Codes */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Error Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <ErrorCodeItem code="400" description="Bad Request - Invalid parameters" />
              <ErrorCodeItem
                code="429"
                description="Too Many Requests - Rate limit exceeded"
              />
              <ErrorCodeItem
                code="500"
                description="Internal Server Error - Something went wrong"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function EndpointSection({
  method,
  path,
  title,
  description,
  onCopy,
  copiedId,
}: {
  method: string;
  path: string;
  title: string;
  description: string;
  onCopy: (text: string, id: string) => void;
  copiedId: string | null;
}) {
  const examples = {
    url: {
      title: 'Validate from URL',
      request: JSON.stringify(
        {
          source: 'url',
          input: 'https://example.com',
        },
        null,
        2
      ),
      response: JSON.stringify(
        {
          success: true,
          url: 'https://example.com',
          timestamp: '2024-01-15T10:00:00.000Z',
          overallScore: 85,
          schemas: [
            {
              schema: {
                type: 'Article',
                context: 'https://schema.org',
              },
              seoScore: 85,
              completeness: 90,
              richResultsEligible: true,
              errors: [],
              warnings: [],
              passed: [],
            },
          ],
          summary: {
            totalErrors: 0,
            totalWarnings: 2,
            totalPassed: 8,
            richResultsEligible: true,
          },
        },
        null,
        2
      ),
    },
    jsonld: {
      title: 'Validate from JSON-LD',
      request: JSON.stringify(
        {
          source: 'json-ld',
          input:
            '{"@context":"https://schema.org","@type":"Article","headline":"Example Article"}',
        },
        null,
        2
      ),
      response: JSON.stringify(
        {
          success: true,
          timestamp: '2024-01-15T10:00:00.000Z',
          overallScore: 45,
          schemas: [
            {
              schema: {
                type: 'Article',
                context: 'https://schema.org',
              },
              seoScore: 45,
              completeness: 30,
              richResultsEligible: false,
              errors: [
                {
                  severity: 'error',
                  property: 'image',
                  message: 'Article must have at least one image',
                  fix: 'Add "image": ["https://example.com/image.jpg"]',
                  seoImpact: 'high',
                },
              ],
              warnings: [],
              passed: [],
            },
          ],
          summary: {
            totalErrors: 3,
            totalWarnings: 5,
            totalPassed: 2,
            richResultsEligible: false,
          },
        },
        null,
        2
      ),
    },
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <Badge className="bg-green-600">{method}</Badge>
          <code className="text-sm font-mono text-gray-700">{path}</code>
        </div>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-gray-600">{description}</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Request Example - URL */}
        <div>
          <h4 className="font-semibold mb-3">{examples.url.title}</h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-2">Request Body:</p>
              <CodeBlock
                code={examples.url.request}
                language="json"
                id="req-url"
                onCopy={onCopy}
                copied={copiedId === 'req-url'}
              />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Response:</p>
              <CodeBlock
                code={examples.url.response}
                language="json"
                id="res-url"
                onCopy={onCopy}
                copied={copiedId === 'res-url'}
              />
            </div>
          </div>
        </div>

        {/* Request Example - JSON-LD */}
        <div>
          <h4 className="font-semibold mb-3">{examples.jsonld.title}</h4>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600 mb-2">Request Body:</p>
              <CodeBlock
                code={examples.jsonld.request}
                language="json"
                id="req-jsonld"
                onCopy={onCopy}
                copied={copiedId === 'req-jsonld'}
              />
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-2">Response:</p>
              <CodeBlock
                code={examples.jsonld.response}
                language="json"
                id="res-jsonld"
                onCopy={onCopy}
                copied={copiedId === 'res-jsonld'}
              />
            </div>
          </div>
        </div>

        {/* cURL Example */}
        <div>
          <h4 className="font-semibold mb-2">cURL Example</h4>
          <CodeBlock
            code={`curl -X POST ${typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/v1/validate \\
  -H "Content-Type: application/json" \\
  -d '{"source":"url","input":"https://example.com"}'`}
            language="bash"
            id="curl"
            onCopy={onCopy}
            copied={copiedId === 'curl'}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function CodeBlock({
  code,
  language = 'text',
  id,
  onCopy,
  copied,
}: {
  code: string;
  language?: string;
  id: string;
  onCopy: (text: string, id: string) => void;
  copied: boolean;
}) {
  return (
    <div className="relative group">
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code className={`language-${language}`}>{code}</code>
      </pre>
      <button
        onClick={() => onCopy(code, id)}
        className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Copy to clipboard"
      >
        {copied ? (
          <CheckCircle2 className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}

function ErrorCodeItem({ code, description }: { code: string; description: string }) {
  return (
    <div className="flex items-start gap-3">
      <Badge variant="outline" className="font-mono">
        {code}
      </Badge>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
