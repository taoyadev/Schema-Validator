'use client';

import { useState } from 'react';
import { ValidationForm } from '@/components/validation/ValidationForm';
import { ResultsDisplay } from '@/components/validation/ResultsDisplay';
import { SchemaExamples } from '@/components/schema/SchemaExamples';
import { SchemaTypeCard } from '@/components/schema/SchemaTypeCard';
import { FAQSection, TLDR, KeyTakeaways } from '@/components/seo/FAQSection';
import { RelatedResources, CTA, BreadcrumbNav } from '@/components/seo/RelatedResources';
import { articleFAQs } from '@/lib/seo/faq-data';
import type { ValidationResponse } from '@/lib/validation/types';
import { articleExamples } from '@/lib/seo/examples';


export default function ArticlePage() {
  const [results, setResults] = useState<ValidationResponse | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleValidationComplete = (response: ValidationResponse) => {
    setResults(response);
    setIsValidating(false);
  };

  const handleValidationStart = () => {
    setIsValidating(true);
    setResults(null);
  };

  const relatedResources = [
    {
      title: 'NewsArticle Schema Validator',
      description: 'Specialized validator for news content and Google News eligibility',
      href: '/validate/article/news',
      icon: '📰',
      category: 'validator' as const
    },
    {
      title: 'BlogPosting Schema Validator',
      description: 'Validate blog posts for enhanced search results',
      href: '/validate/article/blog',
      icon: '✍️',
      category: 'validator' as const
    },
    {
      title: 'Batch Schema Audit',
      description: 'Validate multiple article pages at once from your sitemap',
      href: '/audit',
      icon: '📊',
      category: 'tool' as const
    }
  ];

  const keyTakeaways = [
    'Images must be at least 696x400px (recommended 1200x675px)',
    'Headlines should be 10-110 characters for optimal display',
    'Use ISO 8601 date format (e.g., 2025-01-26T12:00:00+00:00)',
    'Publisher logo must be an ImageObject, not a string URL',
    'Include both datePublished (required) and dateModified (recommended)'
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
            {/* Breadcrumb Navigation */}
            <div className="mb-8">
              <BreadcrumbNav items={[
                { label: 'Validators', href: '/' },
                { label: 'Article Schema', href: '/validate/article' }
              ]} />
            </div>

            {/* Compact Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <span className="text-sm text-white/90">Article Schema Validator</span>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-xs font-semibold text-white">Rich Results</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Validate Article Schema for Google
              </h1>
              <p className="text-base text-slate-300 max-w-2xl mx-auto">
                Check Article, NewsArticle, and BlogPosting schemas for rich results compliance
              </p>
            </div>

            {/* Validation Form - The Hero Focus */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 lg:p-10">
              <ValidationForm
                onValidationComplete={handleValidationComplete}
                onValidationStart={handleValidationStart}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto space-y-16">

          {/* TLDR Section */}
          {!results && !isValidating && (
            <TLDR>
              <p>
                <strong>Article Schema</strong> is structured data that helps Google display your content with rich results including featured images, publication dates, and author information. This validator checks all Google requirements: proper image dimensions (696x400px minimum), ISO 8601 date formats, publisher details with logo, and headline length (10-110 characters). Works for Article, NewsArticle, and BlogPosting types.
              </p>
            </TLDR>
          )}

          {/* Key Takeaways */}
          {!results && !isValidating && (
            <KeyTakeaways points={keyTakeaways} />
          )}

          {/* Article Types Grid */}
          {!results && !isValidating && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SchemaTypeCard
                title="NewsArticle"
                description="Validate news articles for Google News and Top Stories"
                href="/validate/article/news"
                icon="📰"
                color="blue"
              />
              <SchemaTypeCard
                title="BlogPosting"
                description="Validate blog posts for enhanced search results"
                href="/validate/article/blog"
                icon="✍️"
                color="purple"
              />
            </div>
          )}

        {/* Loading State */}
        {isValidating && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-transparent" />
              <p className="text-lg font-medium">Validating article schema...</p>
            </div>
          </div>
        )}

        {/* Results */}
        {results && !isValidating && <ResultsDisplay results={results} />}

        {/* Requirements Section */}
        {!results && !isValidating && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-4">
                  Google Rich Results Requirements
                </h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-slate-800 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Required Properties</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>
                          <strong>headline:</strong> 10-110 characters for optimal
                          display
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>
                          <strong>image:</strong> Minimum 696x400px, recommended
                          1200x675px
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>
                          <strong>datePublished:</strong> ISO 8601 format (e.g.,
                          2025-01-26T12:00:00+00:00)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>
                          <strong>author:</strong> Person or Organization with name
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>
                          <strong>publisher:</strong> Organization with name and logo
                          (ImageObject)
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-yellow-600 pl-4">
                    <h3 className="font-semibold text-lg mb-2">
                      Recommended Properties
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span>
                          <strong>dateModified:</strong> When the article was last
                          updated
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span>
                          <strong>description:</strong> Brief summary of the article
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-yellow-600 mr-2">•</span>
                        <span>
                          <strong>articleBody:</strong> Full text content
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Code Examples */}
              <SchemaExamples examples={articleExamples} />

              {/* Common Errors */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-4">Common Errors</h2>
                <div className="space-y-4">
                  <details className="border rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer">
                      Missing or invalid image dimensions
                    </summary>
                    <p className="mt-2 text-gray-700">
                      Images must be at least 696x400 pixels. Use high-resolution
                      images (1200x675px or larger) for best results in article rich
                      results.
                    </p>
                  </details>
                  <details className="border rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer">
                      Incorrect date format
                    </summary>
                    <p className="mt-2 text-gray-700">
                      Dates must be in ISO 8601 format. Example:
                      "2025-01-26T12:00:00+00:00". Include timezone information for
                      accuracy.
                    </p>
                  </details>
                  <details className="border rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer">
                      Publisher logo not an ImageObject
                    </summary>
                    <p className="mt-2 text-gray-700">
                      The publisher logo must be defined as an ImageObject with a
                      URL property, not just a string URL.
                    </p>
                  </details>
                  <details className="border rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer">
                      Headline too long or too short
                    </summary>
                    <p className="mt-2 text-gray-700">
                      Headlines should be 10-110 characters. Headlines that are too
                      long may be truncated in search results.
                    </p>
                  </details>
                </div>
              </div>

              {/* CTA Section */}
              <CTA
                title="Validate Your Entire Site's Article Schema"
                description="Use our Batch Schema Audit to validate all your articles at once. Perfect for content audits and ongoing monitoring."
                primaryButton={{ text: 'Try Batch Audit', href: '/audit' }}
                variant="blue"
                className="mt-16"
              />

              {/* FAQ Section */}
              <FAQSection
                faqs={articleFAQs}
                title="Article Schema FAQ"
                className="mt-16"
              />

              {/* Related Resources */}
              <RelatedResources
                resources={relatedResources}
                title="Related Validators"
                columns={3}
                className="mt-16"
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
