'use client';

import { useState } from 'react';
import { ValidationForm } from '@/components/validation/ValidationForm';
import { ResultsDisplay } from '@/components/validation/ResultsDisplay';
import { FAQSection, TLDR, KeyTakeaways } from '@/components/seo/FAQSection';
import { RelatedResources, CTA, BreadcrumbNav } from '@/components/seo/RelatedResources';
import { aggregateRatingFAQs } from '@/lib/seo/faq-data';
import type { ValidationResponse } from '@/lib/validation/types';


export default function AggregateRatingPage() {
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
      title: 'Product Schema Validator',
      description: 'Validate complete Product schema with offers and reviews',
      href: '/validate/product',
      icon: '🛍️',
      category: 'validator' as const
    },
    {
      title: 'Offer Schema Validator',
      description: 'Validate product pricing and availability',
      href: '/validate/product/offer',
      icon: '💰',
      category: 'validator' as const
    },
    {
      title: 'Batch Schema Audit',
      description: 'Validate reviews across all product pages at once',
      href: '/audit',
      icon: '📊',
      category: 'tool' as const
    }
  ];

  const keyTakeaways = [
    'Minimum 5 authentic reviews recommended before displaying aggregate ratings',
    'ratingValue must be between worstRating (default 1) and bestRating (default 5)',
    'Reviews must be visible on your page - cannot use third-party ratings without permission',
    'Violating Google review policies can result in rich results removal or penalties',
    'Include both aggregateRating and individual Review objects for maximum visibility'
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
                { label: 'Product', href: '/validate/product' },
                { label: 'Reviews & Ratings', href: '/validate/product/reviews' }
              ]} />
            </div>

            {/* Compact Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <span className="text-sm text-white/90">AggregateRating Validator</span>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-xs font-semibold text-white">Star Ratings</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Validate Review Ratings Schema
              </h1>
              <p className="text-base text-slate-300 max-w-2xl mx-auto">
                Get star ratings displayed in Google search results with proper AggregateRating schema
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
                <strong>AggregateRating Schema</strong> displays average star ratings in Google search results. This validator checks ratingValue (average score), reviewCount (total reviews), and rating scale properties (bestRating/worstRating). Google typically requires 5+ authentic reviews before showing stars. Reviews must be visible on your page and follow Google's review policies.
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
                Validating AggregateRating schema...
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
                Star Ratings Requirements
              </h2>
              <div className="space-y-4">
                <div className="bg-orange-50 border-l-4 border-orange-600 p-4">
                  <p className="font-semibold mb-2">
                    Important: Google's Review Policies
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>Reviews must be authentic and from real customers</li>
                    <li>Self-reviews are not permitted</li>
                    <li>Minimum 5 reviews recommended for display</li>
                    <li>Review gating (selectively soliciting positive reviews) is prohibited</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-600 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Required Properties</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-2">⭐</span>
                      <span>
                        <strong>ratingValue:</strong> The average rating (e.g., "4.5")
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-600 mr-2">⭐</span>
                      <span>
                        <strong>reviewCount:</strong> Total number of reviews
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-slate-800 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Optional Properties</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>bestRating:</strong> Highest possible rating
                        (default: 5)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>worstRating:</strong> Lowest possible rating
                        (default: 1)
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Example */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">
                Example AggregateRating
              </h2>
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm">
                <code>{`{
  "@type": "Product",
  "name": "Premium Wireless Headphones",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "127",
    "bestRating": "5",
    "worstRating": "1"
  }
}`}</code>
              </pre>
            </div>

            {/* Rating Scale Examples */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">Rating Scale Examples</h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">5-Star System (Most Common)</h3>
                  <code className="block bg-gray-100 p-2 rounded text-sm">
                    ratingValue: "4.5", bestRating: "5", worstRating: "1"
                  </code>
                  <p className="text-sm text-gray-600 mt-2">
                    Standard 1-5 star rating. Works with Amazon, Google, etc.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">10-Point Scale</h3>
                  <code className="block bg-gray-100 p-2 rounded text-sm">
                    ratingValue: "8.5", bestRating: "10", worstRating: "1"
                  </code>
                  <p className="text-sm text-gray-600 mt-2">
                    Used by some review platforms. Converts to stars in search.
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">100-Point Scale</h3>
                  <code className="block bg-gray-100 p-2 rounded text-sm">
                    ratingValue: "85", bestRating: "100", worstRating: "0"
                  </code>
                  <p className="text-sm text-gray-600 mt-2">
                    Percentage-based ratings. Google normalizes to 5-star display.
                  </p>
                </div>
              </div>
            </div>

            {/* Best Practices */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">Review Best Practices</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <span className="text-2xl mr-2">✅</span>
                    Do's
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Collect authentic customer reviews</li>
                    <li>• Include both positive and negative reviews</li>
                    <li>• Verify reviewer identity when possible</li>
                    <li>• Update review counts regularly</li>
                    <li>• Display individual reviews on your site</li>
                    <li>• Allow customers to leave reviews easily</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2 flex items-center">
                    <span className="text-2xl mr-2">❌</span>
                    Don'ts
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Write your own reviews</li>
                    <li>• Pay for positive reviews</li>
                    <li>• Gate reviews (only ask happy customers)</li>
                    <li>• Delete negative reviews (unless spam/abuse)</li>
                    <li>• Inflate review counts</li>
                    <li>• Use fake or automated reviews</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-red-50 border-l-4 border-red-600 p-4">
                <p className="font-semibold text-red-900 mb-1">
                  Penalty Warning
                </p>
                <p className="text-sm text-red-800">
                  Violating Google's review policies can result in manual actions,
                  removal of rich results, or complete deindexing. Always follow
                  ethical review practices.
                </p>
              </div>
            </div>

            {/* CTA Section */}
            <CTA
              title="Validate Your Complete Product Schema"
              description="Check your entire Product schema with offers, images, and reviews. Ensure Google Shopping compliance."
              primaryButton={{ text: 'Validate Product Schema', href: '/validate/product' }}
              variant="slate"
              className="mt-16"
            />

            {/* FAQ Section */}
            <FAQSection
              faqs={aggregateRatingFAQs}
              title="AggregateRating FAQ"
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
