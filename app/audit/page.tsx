'use client';

import { useState } from 'react';
import { SitemapParser } from '@/lib/audit/sitemap-parser';
import { validateBatch } from '@/lib/audit/batch-validator';
import {
  generatePDFReport,
  generateExcelReport,
  generateJSONReport,
} from '@/lib/audit/report-generators';
import { FAQSection, TLDR, KeyTakeaways } from '@/components/seo/FAQSection';
import { RelatedResources } from '@/components/seo/RelatedResources';
import { batchAuditFAQs } from '@/lib/seo/faq-data';
import type { BatchAuditResult, AuditProgress } from '@/lib/audit/types';

type InputMethod = 'sitemap' | 'manual' | 'file';

export default function AuditPage() {
  const [inputMethod, setInputMethod] = useState<InputMethod>('sitemap');
  const [sitemapUrl, setSitemapUrl] = useState('');
  const [manualUrls, setManualUrls] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [progress, setProgress] = useState<AuditProgress | null>(null);
  const [result, setResult] = useState<BatchAuditResult | null>(null);
  const [error, setError] = useState('');

  const relatedTools = [
    {
      title: 'Single URL Validator',
      description: 'Validate one URL at a time with detailed error analysis and recommendations',
      href: '/',
      icon: '🔍',
      category: 'tool' as const
    },
    {
      title: 'Article Schema Validator',
      description: 'Specialized validator for Article, NewsArticle, and BlogPosting',
      href: '/validate/article',
      icon: '📄',
      category: 'validator' as const
    },
    {
      title: 'Product Schema Validator',
      description: 'Validate Product schemas with pricing and review data',
      href: '/validate/product',
      icon: '🛍️',
      category: 'validator' as const
    }
  ];

  const handleSitemapSubmit = async () => {
    setIsLoading(true);
    setLoadingStage('Fetching sitemap...');
    setError('');
    setResult(null);
    setProgress(null);

    try {
      // Parse sitemap
      const parser = new SitemapParser(50); // Limit to 50 URLs
      const urls = await parser.parseSitemapFromUrl(sitemapUrl);

      if (urls.length === 0) {
        throw new Error('No URLs found in sitemap');
      }

      setLoadingStage(`Found ${urls.length} URLs. Starting validation...`);

      // Validate all URLs
      const auditResult = await validateBatch(urls, {
        concurrent: 5,
        timeout: 30000,
        onProgress: (p) => setProgress(p),
      });

      setResult(auditResult);
      setLoadingStage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualSubmit = async () => {
    setIsLoading(true);
    setLoadingStage('Parsing URLs...');
    setError('');
    setResult(null);
    setProgress(null);

    try {
      const urls = SitemapParser.parseUrlList(manualUrls);

      if (urls.length === 0) {
        throw new Error('No valid URLs found');
      }

      setLoadingStage(`Found ${urls.length} URLs. Starting validation...`);

      const auditResult = await validateBatch(urls, {
        concurrent: 5,
        timeout: 30000,
        onProgress: (p) => setProgress(p),
      });

      setResult(auditResult);
      setLoadingStage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setLoadingStage('Reading file...');
    setError('');
    setResult(null);
    setProgress(null);

    try {
      const text = await file.text();
      const urls = SitemapParser.parseUrlList(text);

      if (urls.length === 0) {
        throw new Error('No valid URLs found in file');
      }

      setLoadingStage(`Found ${urls.length} URLs. Starting validation...`);

      const auditResult = await validateBatch(urls, {
        concurrent: 5,
        timeout: 30000,
        onProgress: (p) => setProgress(p),
      });

      setResult(auditResult);
      setLoadingStage('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const keyTakeaways = [
    'Validate up to 50 URLs in a single batch audit',
    'Import URLs from sitemap, upload text/CSV files, or paste manually',
    'Get comprehensive reports with errors, warnings, and scores for each URL',
    'Export results in PDF, Excel, or JSON format',
    'Track real-time progress with concurrent processing (5 URLs at once)'
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section with Dark Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"></div>
        </div>

        {/* Dot pattern overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.05)_1px,transparent_0)] bg-[size:40px_40px]"></div>

        <div className="container mx-auto px-6 lg:px-8 pt-20 pb-24 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Compact Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <span className="text-sm text-white/90">Batch Schema Audit</span>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-xs font-semibold text-white">50 URLs at Once</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Validate Multiple URLs Simultaneously
              </h1>
              <p className="text-base text-slate-300 max-w-2xl mx-auto">
                Import from sitemap, upload file, or paste URL list. Get comprehensive reports in PDF, Excel, or JSON.
              </p>
            </div>

          {/* Input Method Tabs */}
          <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
            <div className="flex border-b mb-6">
              <button
                onClick={() => setInputMethod('sitemap')}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  inputMethod === 'sitemap'
                    ? 'border-slate-800 text-slate-800'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Sitemap URL
              </button>
              <button
                onClick={() => setInputMethod('manual')}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  inputMethod === 'manual'
                    ? 'border-slate-800 text-slate-800'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Manual Input
              </button>
              <button
                onClick={() => setInputMethod('file')}
                className={`px-6 py-3 font-medium border-b-2 transition-colors ${
                  inputMethod === 'file'
                    ? 'border-slate-800 text-slate-800'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Upload File
              </button>
            </div>

            {/* Sitemap Input */}
            {inputMethod === 'sitemap' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sitemap URL
                  </label>
                  <input
                    type="url"
                    value={sitemapUrl}
                    onChange={(e) => setSitemapUrl(e.target.value)}
                    placeholder="https://example.com/sitemap.xml"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Common paths: /sitemap.xml, /sitemap_index.xml
                  </p>
                </div>
                <button
                  onClick={handleSitemapSubmit}
                  disabled={isLoading || !sitemapUrl}
                  className="w-full bg-slate-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Processing...' : 'Start Audit'}
                </button>
              </div>
            )}

            {/* Manual Input */}
            {inputMethod === 'manual' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URLs (one per line)
                  </label>
                  <textarea
                    value={manualUrls}
                    onChange={(e) => setManualUrls(e.target.value)}
                    placeholder="https://example.com/page1&#10;https://example.com/page2&#10;https://example.com/page3"
                    rows={10}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent font-mono text-sm"
                    disabled={isLoading}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Enter one URL per line. Lines starting with # will be ignored.
                  </p>
                </div>
                <button
                  onClick={handleManualSubmit}
                  disabled={isLoading || !manualUrls.trim()}
                  className="w-full bg-slate-800 text-white px-6 py-3 rounded-lg font-medium hover:bg-slate-900 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Processing...' : 'Start Audit'}
                </button>
              </div>
            )}

            {/* File Upload */}
            {inputMethod === 'file' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload URL List
                  </label>
                  <input
                    type="file"
                    accept=".txt,.csv"
                    onChange={handleFileUpload}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-transparent"
                    disabled={isLoading}
                  />
                  <p className="mt-2 text-sm text-gray-500">
                    Accepted formats: .txt, .csv (one URL per line)
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    <div className="container mx-auto px-6 lg:px-8 py-16">
      <div className="max-w-6xl mx-auto space-y-16">

        {/* TLDR Section */}
        {!result && !isLoading && (
          <TLDR>
            <p>
              The <strong>Batch Schema Audit</strong> tool lets you validate structured data for multiple URLs simultaneously. Perfect for SEO audits, site migrations, or monitoring schema health across your entire website. Process up to 50 URLs from a sitemap, CSV file, or manual input, with exportable reports showing errors, warnings, and rich results eligibility for each page.
            </p>
          </TLDR>
        )}

        {/* Key Takeaways */}
        {!result && !isLoading && (
          <KeyTakeaways points={keyTakeaways} />
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-transparent" />
                <p className="text-lg font-medium">{loadingStage}</p>
              </div>

              {progress && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>
                      Progress: {progress.completed}/{progress.total}
                    </span>
                    <span>{progress.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-slate-800 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>In Progress: {progress.inProgress}</span>
                    <span>Failed: {progress.failed}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-600 p-4 rounded">
            <p className="text-red-800 font-medium">Error</p>
            <p className="text-red-700 text-sm mt-1">{error}</p>
          </div>
        )}

        {/* Results Summary */}
        {result && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6">Audit Summary</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-slate-800">
                      {result.summary.totalUrls}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Total URLs</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-green-600">
                      {result.summary.successfulUrls}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-red-600">
                      {result.summary.failedUrls}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600">
                      {result.summary.avgScore}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Avg Score</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Errors:</span>
                      <span className="font-semibold text-red-600">
                        {result.summary.totalErrors}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Warnings:</span>
                      <span className="font-semibold text-yellow-600">
                        {result.summary.totalWarnings}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Rich Results Eligible:</span>
                      <span className="font-semibold text-green-600">
                        {result.summary.eligibleForRichResults}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6">Detailed Results</h2>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {result.results.map((item, index) => (
                    <div
                      key={index}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline font-medium break-all"
                          >
                            {item.url}
                          </a>
                          {item.validation && (
                            <div className="mt-2 flex gap-4 text-sm">
                              <span className="text-gray-600">
                                Score: <strong>{item.validation.overallScore}</strong>
                              </span>
                              {item.validation.summary.totalErrors > 0 && (
                                <span className="text-red-600">
                                  {item.validation.summary.totalErrors} errors
                                </span>
                              )}
                              {item.validation.summary.totalWarnings > 0 && (
                                <span className="text-yellow-600">
                                  {item.validation.summary.totalWarnings} warnings
                                </span>
                              )}
                              {item.validation.summary.richResultsEligible && (
                                <span className="text-green-600">✓ Eligible</span>
                              )}
                            </div>
                          )}
                          {item.error && (
                            <div className="mt-2 text-sm text-red-600">
                              Error: {item.error}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 ml-4">
                          {item.duration}ms
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Export Options */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-4">Export Report</h2>
                <div className="flex gap-4">
                  <button
                    onClick={() => generatePDFReport(result)}
                    className="flex-1 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
                  >
                    Export as PDF
                  </button>
                  <button
                    onClick={() => generateExcelReport(result)}
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
                  >
                    Export as Excel
                  </button>
                  <button
                    onClick={() => generateJSONReport(result)}
                    className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    Export as JSON
                  </button>
                </div>
            </div>

            {/* FAQ Section */}
            <FAQSection
              faqs={batchAuditFAQs}
              title="Batch Audit Frequently Asked Questions"
              className="mt-8"
            />

            {/* Related Tools */}
            <RelatedResources
              resources={relatedTools}
              title="Other Validation Tools"
              columns={3}
              className="mt-8"
            />
          </>
        )}
      </div>
    </div>
  </main>
  );
}
