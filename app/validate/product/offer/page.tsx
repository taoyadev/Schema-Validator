'use client';

import { useState } from 'react';
import { ValidationForm } from '@/components/validation/ValidationForm';
import { ResultsDisplay } from '@/components/validation/ResultsDisplay';
import { FAQSection, TLDR, KeyTakeaways } from '@/components/seo/FAQSection';
import { RelatedResources, CTA, BreadcrumbNav } from '@/components/seo/RelatedResources';
import { offerFAQs } from '@/lib/seo/faq-data';
import type { ValidationResponse } from '@/lib/validation/types';


export default function OfferPage() {
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
      description: 'Validate complete Product schema with offers, reviews, and ratings',
      href: '/validate/product',
      icon: '🛍️',
      category: 'validator' as const
    },
    {
      title: 'AggregateRating Validator',
      description: 'Validate product reviews and star ratings',
      href: '/validate/product/reviews',
      icon: '⭐',
      category: 'validator' as const
    },
    {
      title: 'Batch Schema Audit',
      description: 'Validate multiple product pages at once',
      href: '/audit',
      icon: '📊',
      category: 'tool' as const
    }
  ];

  const keyTakeaways = [
    'Price must be numeric (e.g., "299.99") with separate priceCurrency (USD, EUR, etc.)',
    'Use full Schema.org URLs for availability: https://schema.org/InStock, OutOfStock, PreOrder',
    'Set priceValidUntil 30-90 days in future for regular pricing, exact date for sales',
    'Include shipping details (rate, delivery time) for better Google Shopping display',
    'Specify itemCondition for used/refurbished products: NewCondition, UsedCondition, etc.'
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
                { label: 'Offer Schema', href: '/validate/product/offer' }
              ]} />
            </div>

            {/* Compact Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <span className="text-sm text-white/90">Offer Schema Validator</span>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-xs font-semibold text-white">Pricing</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Validate Product Offer Schema
              </h1>
              <p className="text-base text-slate-300 max-w-2xl mx-auto">
                Check pricing, availability, and offer details for Google Shopping compliance
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
                <strong>Offer Schema</strong> defines product pricing, availability, and purchase details for e-commerce. This validator checks price format (numeric with currency), availability status (InStock/OutOfStock/PreOrder), optional priceValidUntil dates, shipping details, and seller information. Essential for Google Shopping rich results.
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
              <p className="text-lg font-medium">Validating Offer schema...</p>
            </div>
          </div>
        )}

        {/* Results */}
        {results && !isValidating && <ResultsDisplay results={results} />}

        {/* Requirements Section */}
        {!results && !isValidating && (
          <>
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">Offer Requirements</h2>
              <div className="space-y-4">
                <div className="border-l-4 border-green-600 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Required Properties</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        <strong>price:</strong> Numeric value (e.g., "299.99")
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        <strong>priceCurrency:</strong> ISO 4217 currency code
                        (e.g., "USD", "EUR")
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        <strong>availability:</strong> Schema.org availability
                        status URL
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-slate-800 pl-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Availability Values
                  </h3>
                  <div className="space-y-2 text-sm">
                    <code className="block bg-gray-100 p-2 rounded">
                      https://schema.org/InStock
                    </code>
                    <code className="block bg-gray-100 p-2 rounded">
                      https://schema.org/OutOfStock
                    </code>
                    <code className="block bg-gray-100 p-2 rounded">
                      https://schema.org/PreOrder
                    </code>
                    <code className="block bg-gray-100 p-2 rounded">
                      https://schema.org/SoldOut
                    </code>
                    <code className="block bg-gray-100 p-2 rounded">
                      https://schema.org/Discontinued
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Example */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">Example Offer Schema</h2>
              <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto text-sm">
                <code>{`{
  "@type": "Offer",
  "url": "https://example.com/products/wireless-headphones",
  "priceCurrency": "USD",
  "price": "299.99",
  "priceValidUntil": "2025-12-31",
  "availability": "https://schema.org/InStock",
  "itemCondition": "https://schema.org/NewCondition",
  "seller": {
    "@type": "Organization",
    "name": "Example Electronics Store"
  }
}`}</code>
              </pre>
            </div>

            {/* Best Practices */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">
                Offer Best Practices
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Pricing</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Keep prices accurate and up-to-date</li>
                    <li>• Include tax information if applicable</li>
                    <li>• Use decimal format (299.99, not $299.99)</li>
                    <li>• Add priceValidUntil for sales</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Shipping</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Include shipping cost if possible</li>
                    <li>• Specify delivery timeframes</li>
                    <li>• List shipping restrictions</li>
                    <li>• Add free shipping information</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Availability</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Update stock status regularly</li>
                    <li>• Use PreOrder for upcoming products</li>
                    <li>• Mark discontinued items properly</li>
                    <li>• Include expected restock dates</li>
                  </ul>
                </div>
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Seller Info</h3>
                  <ul className="text-sm text-gray-700 space-y-1">
                    <li>• Include seller/merchant name</li>
                    <li>• Link to seller profile</li>
                    <li>• Add seller ratings if available</li>
                    <li>• Specify marketplace vs direct sale</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <CTA
              title="Validate Your Complete Product Schema"
              description="Check your entire Product schema including offers, reviews, and images. Get comprehensive validation for Google Shopping compliance."
              primaryButton={{ text: 'Validate Product Schema', href: '/validate/product' }}
              variant="slate"
              className="mt-16"
            />

            {/* FAQ Section */}
            <FAQSection
              faqs={offerFAQs}
              title="Offer Schema FAQ"
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
