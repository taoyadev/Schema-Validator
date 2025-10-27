'use client';

import { useState } from 'react';
import { ValidationForm } from '@/components/validation/ValidationForm';
import { ResultsDisplay } from '@/components/validation/ResultsDisplay';
import { SchemaExamples } from '@/components/schema/SchemaExamples';
import { FAQSection, TLDR, KeyTakeaways } from '@/components/seo/FAQSection';
import { RelatedResources, CTA, BreadcrumbNav } from '@/components/seo/RelatedResources';
import { newsArticleFAQs } from '@/lib/seo/faq-data';
import type { ValidationResponse } from '@/lib/validation/types';
import { newsArticleExamples } from '@/lib/seo/examples';


export default function NewsArticlePage() {
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
      title: 'BlogPosting Validator',
      description: 'Validate blog posts and informal content',
      href: '/validate/article/blog',
      icon: '✍️',
      category: 'validator' as const
    },
    {
      title: 'Batch Schema Audit',
      description: 'Validate all news articles at once',
      href: '/audit',
      icon: '📊',
      category: 'tool' as const
    }
  ];

  const keyTakeaways = [
    'NewsArticle is required for Google News and Top Stories features',
    'Images should be 1200×675px minimum (larger than regular Article requirement)',
    'Always update dateModified when making significant changes or corrections',
    'Use clear, attributed authorship with Person objects (not just names)',
    'NewsArticle should only be used for actual news reporting, not opinion or blogs'
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
                { label: 'NewsArticle', href: '/validate/article/news' }
              ]} />
            </div>

            {/* Compact Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <span className="text-sm text-white/90">NewsArticle Validator</span>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-xs font-semibold text-white">Google News</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Validate NewsArticle for Google News
              </h1>
              <p className="text-base text-slate-300 max-w-2xl mx-auto">
                Check NewsArticle schema for Google News and Top Stories eligibility
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
                <strong>NewsArticle Schema</strong> is specifically for news content and required for Google News and Top Stories features. It extends Article schema with stricter requirements around timeliness, author attribution, and image quality (1200×675px minimum). Use NewsArticle only for actual news reporting, not opinion pieces or blog posts.
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
                Validating NewsArticle schema...
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
                NewsArticle Requirements
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">
                  NewsArticle extends Article with additional requirements for
                  Google News and Top Stories rich results.
                </p>
                <div className="bg-slate-50 border-l-4 border-slate-800 p-4 mb-4">
                  <p className="font-semibold mb-2">Google News Eligibility:</p>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Must be timely and newsworthy content</li>
                    <li>Published on a news website</li>
                    <li>
                      Follow Google News content policies (no paywalls for crawlers)
                    </li>
                    <li>Include all required Article properties</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Code Examples */}
            <SchemaExamples examples={newsArticleExamples} />

            {/* Best Practices */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">Best Practices for Google News</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-600 pl-4">
                  <h3 className="font-semibold mb-2">For Google News:</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Use high-quality, relevant images (1200x675px minimum)</li>
                    <li>
                      • Include accurate datePublished and dateModified timestamps
                    </li>
                    <li>• Provide clear author attribution</li>
                    <li>• Use descriptive, accurate headlines</li>
                    <li>• Ensure fast page load times</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <CTA
              title="Validate All Your News Articles"
              description="Use Batch Schema Audit to check your entire news section for Google News compliance. Validate hundreds of articles at once."
              primaryButton={{ text: 'Start Batch Audit', href: '/audit' }}
              variant="slate"
              className="mt-16"
            />

            {/* FAQ Section */}
            <FAQSection
              faqs={newsArticleFAQs}
              title="NewsArticle Schema FAQ"
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
