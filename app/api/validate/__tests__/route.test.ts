import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';

describe('/api/validate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should validate JSON-LD input successfully', async () => {
    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Test Article for Validation',
      image: 'https://example.com/image.jpg',
      datePublished: '2024-01-01T00:00:00Z',
      author: {
        '@type': 'Person',
        name: 'John Doe',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Test Publisher',
        logo: {
          '@type': 'ImageObject',
          url: 'https://example.com/logo.jpg',
        },
      },
    });

    const request = new NextRequest('http://localhost:3000/api/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'json-ld',
        input: jsonLd,
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.schemas).toHaveLength(1);
    expect(data.schemas[0].schema.type).toBe('Article');
    expect(data.overallScore).toBeGreaterThan(0);
  });

  it('should return 400 for missing required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });

  it('should return 400 for invalid source type', async () => {
    const request = new NextRequest('http://localhost:3000/api/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'invalid',
        input: '{}',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toContain('Invalid source type');
  });

  it('should return 400 for invalid JSON-LD', async () => {
    const request = new NextRequest('http://localhost:3000/api/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'json-ld',
        input: '{ invalid json }',
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(400);

    const data = await response.json();
    expect(data.success).toBe(false);
  });

  it('should calculate summary metrics correctly', async () => {
    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Test Article',
      // Missing required properties will generate errors
    });

    const request = new NextRequest('http://localhost:3000/api/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        source: 'json-ld',
        input: jsonLd,
      }),
    });

    const response = await POST(request);
    expect(response.status).toBe(200);

    const data = await response.json();
    expect(data.summary).toBeDefined();
    expect(data.summary.totalErrors).toBeGreaterThan(0);
    expect(typeof data.summary.totalWarnings).toBe('number');
    expect(typeof data.summary.totalPassed).toBe('number');
  });
});
