/**
 * SchemaFetcher - Handles URL fetching with timeout, redirects, and error handling
 */

import { FetchOptions, FetchResult } from './types';

export class SchemaFetcher {
  private readonly defaultOptions: Required<FetchOptions> = {
    timeout: 5000,
    userAgent: 'Schema-Validator/1.0 (SEO Tool; +https://schema-validator.com)',
    followRedirects: true,
    maxRedirects: 3,
  };

  async fetchUrl(
    url: string,
    options?: FetchOptions
  ): Promise<FetchResult> {
    const opts = { ...this.defaultOptions, ...options };

    // Validate URL
    this.validateUrl(url);

    const startTime = Date.now();
    const redirectChain: string[] = [url];
    let currentUrl = url;
    let redirectCount = 0;

    try {
      // Create AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), opts.timeout);

      let response: Response;

      try {
        response = await fetch(currentUrl, {
          headers: {
            'User-Agent': opts.userAgent,
            Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.9',
          },
          signal: controller.signal,
          redirect: 'manual', // Handle redirects manually
        });
      } finally {
        clearTimeout(timeoutId);
      }

      // Handle redirects manually
      while (
        opts.followRedirects &&
        (response.status === 301 ||
          response.status === 302 ||
          response.status === 307 ||
          response.status === 308) &&
        redirectCount < opts.maxRedirects
      ) {
        const location = response.headers.get('location');
        if (!location) break;

        currentUrl = new URL(location, currentUrl).href;
        redirectChain.push(currentUrl);
        redirectCount++;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), opts.timeout);

        try {
          response = await fetch(currentUrl, {
            headers: {
              'User-Agent': opts.userAgent,
              Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            },
            signal: controller.signal,
            redirect: 'manual',
          });
        } finally {
          clearTimeout(timeoutId);
        }
      }

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} ${response.statusText}`
        );
      }

      const html = await response.text();
      const fetchTime = Date.now() - startTime;

      return {
        html: this.sanitizeHtml(html),
        finalUrl: currentUrl,
        statusCode: response.status,
        redirectChain,
        fetchTime,
      };
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(
            `Request timeout after ${opts.timeout}ms for URL: ${url}`
          );
        }

        // Handle network errors
        if (
          error.message.includes('ENOTFOUND') ||
          error.message.includes('DNS')
        ) {
          throw new Error(`DNS lookup failed for URL: ${url}`);
        }

        if (
          error.message.includes('ECONNREFUSED') ||
          error.message.includes('ECONNRESET')
        ) {
          throw new Error(`Connection failed for URL: ${url}`);
        }

        if (
          error.message.includes('certificate') ||
          error.message.includes('SSL')
        ) {
          throw new Error(`SSL certificate error for URL: ${url}`);
        }

        throw error;
      }

      throw new Error(`Failed to fetch URL: ${url}`);
    }
  }

  private validateUrl(url: string): void {
    try {
      const parsed = new URL(url);

      // Only allow HTTP and HTTPS
      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new Error('Only HTTP and HTTPS protocols are supported');
      }

      // Check for localhost or private IPs (security)
      const hostname = parsed.hostname.toLowerCase();
      if (
        hostname === 'localhost' ||
        hostname.startsWith('127.') ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('172.16.') ||
        hostname === '[::1]'
      ) {
        throw new Error('Localhost and private IP addresses are not allowed');
      }
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error(`Invalid URL format: ${url}`);
      }
      throw error;
    }
  }

  private sanitizeHtml(html: string): string {
    // Basic sanitization: remove null bytes and control characters
    return html
      .replace(/\x00/g, '')
      .replace(/[\x01-\x08\x0B\x0C\x0E-\x1F]/g, '')
      .trim();
  }
}

/**
 * Helper function for common use cases
 */
export async function fetchUrlSchema(url: string): Promise<FetchResult> {
  const fetcher = new SchemaFetcher();
  return fetcher.fetchUrl(url);
}
