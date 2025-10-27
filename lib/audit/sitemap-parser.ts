import { parseString } from 'xml2js';

/**
 * Parse sitemap XML to extract URLs
 */
export class SitemapParser {
  private maxUrls: number;
  private timeout: number;

  constructor(maxUrls: number = 1000, timeout: number = 30000) {
    this.maxUrls = maxUrls;
    this.timeout = timeout;
  }

  /**
   * Fetch and parse sitemap from URL
   */
  async parseSitemapFromUrl(sitemapUrl: string): Promise<string[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(sitemapUrl, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Schema-Validator/1.0',
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const xmlContent = await response.text();
      return this.parseSitemapXml(xmlContent);
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Sitemap fetch timeout');
        }
        throw new Error(`Failed to fetch sitemap: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Parse sitemap XML content
   */
  async parseSitemapXml(xmlContent: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      parseString(xmlContent, async (err, result) => {
        if (err) {
          reject(new Error(`XML parsing error: ${err.message}`));
          return;
        }

        try {
          // Check if this is a sitemap index
          if (result.sitemapindex) {
            const urls = await this.parseSitemapIndex(result);
            resolve(urls.slice(0, this.maxUrls));
            return;
          }

          // Regular sitemap
          if (result.urlset && result.urlset.url) {
            const urls = this.extractUrls(result.urlset.url);
            resolve(urls.slice(0, this.maxUrls));
            return;
          }

          reject(new Error('Invalid sitemap format'));
        } catch (error) {
          reject(error);
        }
      });
    });
  }

  /**
   * Parse sitemap index and fetch all child sitemaps
   */
  private async parseSitemapIndex(
    sitemapIndex: Record<string, unknown>
  ): Promise<string[]> {
    const allUrls: string[] = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sitemaps = (sitemapIndex.sitemapindex as any).sitemap;

    if (!Array.isArray(sitemaps)) {
      return allUrls;
    }

    // Fetch all child sitemaps (limit to prevent abuse)
    const maxSitemaps = 10;
    const sitemapsToFetch = sitemaps.slice(0, maxSitemaps);

    for (const sitemap of sitemapsToFetch) {
      if (allUrls.length >= this.maxUrls) break;

      try {
        const sitemapUrl = sitemap.loc?.[0];
        if (sitemapUrl) {
          const urls = await this.parseSitemapFromUrl(sitemapUrl);
          allUrls.push(...urls);
        }
      } catch (error) {
        console.warn(`Failed to fetch child sitemap:`, error);
        // Continue with other sitemaps
      }
    }

    return allUrls;
  }

  /**
   * Extract URLs from sitemap URL entries
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private extractUrls(urlEntries: any[]): string[] {
    const urls: string[] = [];

    for (const entry of urlEntries) {
      if (entry.loc && entry.loc[0]) {
        urls.push(entry.loc[0]);
      }
    }

    return urls;
  }

  /**
   * Validate sitemap URL format
   */
  static validateSitemapUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return (
        (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') &&
        (url.endsWith('.xml') || url.endsWith('sitemap.xml') || url.includes('sitemap'))
      );
    } catch {
      return false;
    }
  }

  /**
   * Parse URLs from text input (one URL per line)
   */
  static parseUrlList(text: string): string[] {
    return text
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => {
        if (!line || line.startsWith('#')) return false;
        try {
          new URL(line);
          return true;
        } catch {
          return false;
        }
      });
  }

  /**
   * Detect sitemap URL from domain
   */
  static detectSitemapUrls(domain: string): string[] {
    const normalizedDomain = domain.replace(/\/$/, '');
    const commonPaths = [
      '/sitemap.xml',
      '/sitemap_index.xml',
      '/sitemap-index.xml',
      '/post-sitemap.xml',
      '/page-sitemap.xml',
    ];

    return commonPaths.map((path) => `${normalizedDomain}${path}`);
  }
}
