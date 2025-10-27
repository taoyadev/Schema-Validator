'use client';

import { useState } from 'react';
import { ValidationForm } from '@/components/validation/ValidationForm';
import { ResultsDisplay } from '@/components/validation/ResultsDisplay';
import { SchemaExamples } from '@/components/schema/SchemaExamples';
import { SchemaTypeCard } from '@/components/schema/SchemaTypeCard';
import { FAQSection, TLDR, KeyTakeaways } from '@/components/seo/FAQSection';
import { RelatedResources, CTA, BreadcrumbNav } from '@/components/seo/RelatedResources';
import { productFAQs } from '@/lib/seo/faq-data';
import type { ValidationResponse } from '@/lib/validation/types';
import { productExamples } from '@/lib/seo/examples';


export default function ProductPage() {
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
      title: 'Offer Schema Validator',
      description: 'Validate product offers, pricing, and availability information',
      href: '/validate/product/offer',
      icon: '💰',
      category: 'validator' as const
    },
    {
      title: 'AggregateRating Validator',
      description: 'Validate product reviews and star ratings for search results',
      href: '/validate/product/reviews',
      icon: '⭐',
      category: 'validator' as const
    },
    {
      title: 'Batch Schema Audit',
      description: 'Validate all your product pages at once from sitemap or CSV',
      href: '/audit',
      icon: '📊',
      category: 'tool' as const
    }
  ];

  const keyTakeaways = [
    'Product name, image (696x400px min), and at least one Offer are required',
    'Include aggregateRating with 5+ reviews to show star ratings in search',
    'Add GTIN, MPN, or SKU identifiers for Google Shopping eligibility',
    'Keep price and availability updated to avoid showing outdated information',
    'Use high-quality product images (1200x1200px recommended) for best results'
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
                { label: 'Product Schema', href: '/validate/product' }
              ]} />
            </div>

            {/* Compact Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <span className="text-sm text-white/90">Product Schema Validator</span>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-xs font-semibold text-white">E-commerce</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Validate Product Schema for Shopping
              </h1>
              <p className="text-base text-slate-300 max-w-2xl mx-auto">
                Ensure products display properly in search with pricing, reviews, and availability
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
                <strong>Product Schema</strong> is structured data that helps Google display your e-commerce products with rich results including prices, ratings, availability, and images. This validator checks all Google Shopping requirements: product name, images (696x400px minimum), valid offers with pricing and availability, and optional features like reviews and product identifiers (GTIN/MPN/SKU).
              </p>
            </TLDR>
          )}

          {/* Key Takeaways */}
          {!results && !isValidating && (
            <KeyTakeaways points={keyTakeaways} />
          )}

          {/* Product Schema Sub-Types Grid */}
          {!results && !isValidating && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SchemaTypeCard
                title="Offer Schema"
                description="Validate product offers, pricing, and availability"
                href="/validate/product/offer"
                icon="💰"
                color="green"
              />
              <SchemaTypeCard
                title="AggregateRating"
                description="Validate product reviews and star ratings"
                href="/validate/product/reviews"
                icon="⭐"
                color="orange"
              />
            </div>
          )}

        {/* Loading State */}
        {isValidating && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-transparent" />
              <p className="text-lg font-medium">Validating product schema...</p>
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
                Product Rich Results Requirements
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-600 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Required Properties</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        <strong>name:</strong> Product name/title
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        <strong>image:</strong> High-quality product image (minimum
                        696x400px)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        <strong>offers:</strong> At least one Offer with price and
                        availability
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-yellow-600 pl-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Recommended for Rich Results
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>
                        <strong>aggregateRating:</strong> Star ratings display in
                        search
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>
                        <strong>review:</strong> Individual customer reviews
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>
                        <strong>brand:</strong> Product manufacturer or brand
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span>
                        <strong>description:</strong> Detailed product description
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Code Examples */}
            <SchemaExamples examples={productExamples} />

            {/* E-commerce Best Practices */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">
                E-commerce Best Practices
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-l-4 border-green-600 pl-4">
                  <h3 className="font-semibold mb-2">Pricing Information</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Include currency code (USD, EUR, etc.)</li>
                    <li>• Keep prices up to date</li>
                    <li>• Add priceValidUntil for time-limited offers</li>
                    <li>• Specify availability (InStock, OutOfStock, etc.)</li>
                  </ul>
                </div>
                <div className="border-l-4 border-slate-800 pl-4">
                  <h3 className="font-semibold mb-2">Product Images</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Use multiple angles/views</li>
                    <li>• Minimum 696x400px, recommended 1200x1200px</li>
                    <li>• Include image alt text</li>
                    <li>• Use high-quality, clear images</li>
                  </ul>
                </div>
                <div className="border-l-4 border-purple-600 pl-4">
                  <h3 className="font-semibold mb-2">Reviews & Ratings</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Minimum 5 reviews for aggregateRating</li>
                    <li>• Use scale of 1-5 for ratings</li>
                    <li>• Include review count</li>
                    <li>• Keep reviews authentic and verified</li>
                  </ul>
                </div>
                <div className="border-l-4 border-orange-600 pl-4">
                  <h3 className="font-semibold mb-2">Google Shopping</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Add GTIN, MPN, or SKU identifiers</li>
                    <li>• Include shipping details</li>
                    <li>• Specify return policy</li>
                    <li>• Add merchant information</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Common Errors */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">Common Product Errors</h2>
              <div className="space-y-4">
                <details className="border rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">
                    Missing or invalid price
                  </summary>
                  <p className="mt-2 text-gray-700">
                    The price must be a valid number with currency code.
                    Example: "price": "299.99", "priceCurrency": "USD"
                  </p>
                </details>
                <details className="border rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">
                    Availability not specified
                  </summary>
                  <p className="mt-2 text-gray-700">
                    Always include availability using schema.org values:
                    https://schema.org/InStock, https://schema.org/OutOfStock,
                    https://schema.org/PreOrder
                  </p>
                </details>
                <details className="border rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">
                    Invalid review ratings
                  </summary>
                  <p className="mt-2 text-gray-700">
                    Rating values must be between bestRating (usually 5) and
                    worstRating (usually 1). The ratingValue must be within this
                    range.
                  </p>
                </details>
              </div>
            </div>

            {/* CTA Section */}
            <CTA
              title="Validate All Your Product Pages at Once"
              description="Use our Batch Schema Audit to validate your entire product catalog. Import from sitemap, CSV, or manual list. Export detailed reports."
              primaryButton={{ text: 'Start Batch Audit', href: '/audit' }}
              variant="slate"
              className="mt-16"
            />

            {/* FAQ Section */}
            <FAQSection
              faqs={productFAQs}
              title="Product Schema FAQ"
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
