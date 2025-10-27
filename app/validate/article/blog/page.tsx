'use client';

import { useState } from 'react';
import { ValidationForm } from '@/components/validation/ValidationForm';
import { ResultsDisplay } from '@/components/validation/ResultsDisplay';
import { SchemaExamples } from '@/components/schema/SchemaExamples';
import { FAQSection, TLDR, KeyTakeaways } from '@/components/seo/FAQSection';
import { RelatedResources, CTA, BreadcrumbNav } from '@/components/seo/RelatedResources';
import { blogPostingFAQs } from '@/lib/seo/faq-data';
import type { ValidationResponse } from '@/lib/validation/types';
import { articleExamples } from '@/lib/seo/examples';


export default function BlogPostingPage() {
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
      title: 'Article Schema Validator',
      description: 'General article validation for all content types',
      href: '/validate/article',
      icon: '📄',
      category: 'validator' as const
    },
    {
      title: 'NewsArticle Validator',
      description: 'Validate news content for Google News',
      href: '/validate/article/news',
      icon: '📰',
      category: 'validator' as const
    },
    {
      title: 'Batch Schema Audit',
      description: 'Validate all blog posts at once',
      href: '/audit',
      icon: '📊',
      category: 'tool' as const
    }
  ];

  const keyTakeaways = [
    'BlogPosting is for blog content and personal commentary (vs formal Article content)',
    'Include author social profiles (sameAs) for E-E-A-T credibility signals',
    'Use articleSection to categorize content (e.g., "Marketing", "Technology")',
    'Featured images should be 1200×675px for optimal social sharing',
    'Optional wordCount property signals content depth to search engines'
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
                { label: 'Article', href: '/validate/article' },
                { label: 'BlogPosting', href: '/validate/article/blog' }
              ]} />
            </div>

            {/* Compact Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <span className="text-sm text-white/90">BlogPosting Validator</span>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-xs font-semibold text-white">Blog SEO</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Validate BlogPosting Schema
              </h1>
              <p className="text-base text-slate-300 max-w-2xl mx-auto">
                Optimize blog posts for enhanced search results and better visibility
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
                <strong>BlogPosting Schema</strong> is specifically for blog content and personal commentary. While similar to Article schema, BlogPosting better represents informal content and helps establish author credibility through E-E-A-T signals like social profiles and bios. Perfect for WordPress, Medium, Ghost, and all blogging platforms.
              </p>
            </TLDR>
          )}

          {/* Key Takeaways */}
          {!results && !isValidating && (
            <KeyTakeaways points={keyTakeaways} />
          )}

        {/* Loading State */}
        {isValidating && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-transparent" />
              <p className="text-lg font-medium">
                Validating BlogPosting schema...
              </p>
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
                BlogPosting Requirements
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">
                  BlogPosting extends Article and is specifically for blog content.
                  It shares the same requirements as Article schema.
                </p>
                <div className="bg-slate-50 border-l-4 border-slate-800 p-4 mb-4">
                  <p className="font-semibold mb-2">Blog-Specific Best Practices:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Include author bio and profile information</li>
                    <li>Add categories/tags using articleSection</li>
                    <li>Include comment count if applicable</li>
                    <li>Link to related blog posts</li>
                    <li>Use featured images optimized for social sharing</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Code Examples */}
            <SchemaExamples examples={articleExamples} />

            {/* SEO Tips */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">SEO Tips for Blogs</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    Images
                  </h3>
                  <p className="text-sm text-gray-700">
                    Use multiple high-quality images. First image should be
                    1200x675px for social sharing. Include alt text for
                    accessibility.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    Author Info
                  </h3>
                  <p className="text-sm text-gray-700">
                    Include author name, bio, and optionally a profile URL. This
                    helps build E-E-A-T (Experience, Expertise, Authoritativeness,
                    Trust).
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    Publishing Dates
                  </h3>
                  <p className="text-sm text-gray-700">
                    Always include both datePublished and dateModified. Update
                    dateModified when making significant content changes.
                  </p>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    Content Quality
                  </h3>
                  <p className="text-sm text-gray-700">
                    Write comprehensive content (1500+ words for in-depth topics).
                    Use clear headings and structure for better readability.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <CTA
              title="Validate All Your Blog Posts"
              description="Use Batch Schema Audit to validate your entire blog. Import from sitemap or manually add URLs. Get detailed reports."
              primaryButton={{ text: 'Start Batch Audit', href: '/audit' }}
              variant="slate"
              className="mt-16"
            />

            {/* FAQ Section */}
            <FAQSection
              faqs={blogPostingFAQs}
              title="BlogPosting Schema FAQ"
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
