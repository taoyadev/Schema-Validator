'use client';

import { useState } from 'react';
import { ValidationForm } from '@/components/validation/ValidationForm';
import { ResultsDisplay } from '@/components/validation/ResultsDisplay';
import { SchemaExamples } from '@/components/schema/SchemaExamples';
import { FAQSection, TLDR, KeyTakeaways } from '@/components/seo/FAQSection';
import { RelatedResources, CTA, BreadcrumbNav } from '@/components/seo/RelatedResources';
import { localBusinessFAQs } from '@/lib/seo/faq-data';
import type { ValidationResponse } from '@/lib/validation/types';
import { localBusinessExamples } from '@/lib/seo/examples';

export default function LocalBusinessPage() {
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
      title: 'Organization Schema Validator',
      description: 'Validate parent organization and company information',
      href: '/validate/organization',
      icon: '🏢',
      category: 'validator' as const
    },
    {
      title: 'Product Schema Validator',
      description: 'Validate products sold by your local business',
      href: '/validate/product',
      icon: '🛍️',
      category: 'validator' as const
    },
    {
      title: 'Batch Schema Audit',
      description: 'Validate all location pages at once',
      href: '/audit',
      icon: '📊',
      category: 'tool' as const
    }
  ];

  const keyTakeaways = [
    'NAP (Name, Address, Phone) consistency is critical for local SEO ranking',
    'Include opening hours in OpeningHoursSpecification format or simple string',
    'Add precise GPS coordinates (geo property) for better map placement',
    'Use specific business type (Restaurant, CoffeeShop) instead of generic LocalBusiness',
    'Multi-location businesses need separate schema on each location page'
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
                { label: 'Organization', href: '/validate/organization' },
                { label: 'LocalBusiness', href: '/validate/organization/local-business' }
              ]} />
            </div>

            {/* Compact Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <span className="text-sm text-white/90">LocalBusiness Validator</span>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-xs font-semibold text-white">Local SEO</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Validate LocalBusiness Schema
              </h1>
              <p className="text-base text-slate-300 max-w-2xl mx-auto">
                Optimize your business for local SEO and Google Maps visibility
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
                <strong>LocalBusiness Schema</strong> is essential for local SEO and Google Maps visibility. This validator checks NAP (Name, Address, Phone) consistency, business hours in proper format, GPS coordinates (latitude/longitude), and local-specific properties like priceRange and service areas. Critical for appearing in "near me" searches and Google Maps results.
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
                Validating LocalBusiness schema...
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
                LocalBusiness Requirements
              </h2>
              <div className="space-y-4">
                <div className="bg-slate-50 border-l-4 border-slate-800 p-4">
                  <p className="font-semibold mb-2">NAP Consistency:</p>
                  <p className="text-sm text-gray-700">
                    Ensure your business Name, Address, and Phone (NAP) are
                    consistent across your website, Google Business Profile, and
                    all online directories. Inconsistencies hurt local SEO.
                  </p>
                </div>

                <div className="border-l-4 border-slate-800 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Required Properties</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        <strong>name:</strong> Business name (exactly as it appears
                        on signage)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        <strong>address:</strong> Complete PostalAddress with
                        street, city, state, zip
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-slate-800 pl-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Recommended for Local SEO
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>telephone:</strong> Phone number with area code
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>openingHours:</strong> Business hours in
                        OpeningHoursSpecification format
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>geo:</strong> GPS coordinates (latitude/longitude)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>priceRange:</strong> Price level ($, $$, $$$, $$$$)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>image:</strong> Exterior photo of business location
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>aggregateRating:</strong> Customer reviews and
                        ratings
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Code Examples */}
            <SchemaExamples examples={localBusinessExamples} />

            {/* Business Hours Format */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">
                Opening Hours Format
              </h2>
              <div className="space-y-4">
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Simple Format (Recommended)</h3>
                  <code className="block bg-gray-100 p-3 rounded text-sm">
                    "openingHours": "Mo-Fr 09:00-17:00, Sa 10:00-16:00"
                  </code>
                  <p className="text-sm text-gray-600 mt-2">
                    Days: Mo, Tu, We, Th, Fr, Sa, Su | Time: 24-hour format
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-2">
                    OpeningHoursSpecification (Detailed)
                  </h3>
                  <pre className="bg-gray-100 p-3 rounded text-xs overflow-x-auto">
                    <code>{`"openingHoursSpecification": [
  {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "09:00",
    "closes": "17:00"
  },
  {
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": "Saturday",
    "opens": "10:00",
    "closes": "16:00"
  }
]`}</code>
                  </pre>
                </div>
              </div>
            </div>

            {/* Local SEO Tips */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">Local SEO Best Practices</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-l-4 border-slate-800 pl-4">
                  <h3 className="font-semibold mb-2">📍 Location Data</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>
                      • Use precise GPS coordinates (not just approximate city
                      center)
                    </li>
                    <li>• Include full address with suite/unit numbers</li>
                    <li>• Add service area for businesses serving multiple cities</li>
                    <li>• Embed Google Maps on contact page</li>
                  </ul>
                </div>

                <div className="border-l-4 border-slate-800 pl-4">
                  <h3 className="font-semibold mb-2">⭐ Reviews & Ratings</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Display recent customer reviews on your site</li>
                    <li>• Respond to reviews (shows engagement)</li>
                    <li>• Include review schema for star ratings</li>
                    <li>• Link to Google Business Profile reviews</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-600 pl-4">
                  <h3 className="font-semibold mb-2">📞 Contact Options</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Add click-to-call phone links on mobile</li>
                    <li>• Include email address for inquiries</li>
                    <li>• Provide booking/appointment URLs if applicable</li>
                    <li>• List emergency/after-hours contact</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-600 pl-4">
                  <h3 className="font-semibold mb-2">🏪 Business Categories</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Use specific business types (Restaurant, not just Food)</li>
                    <li>• Examples: CoffeeShop, LegalService, AutoRepair</li>
                    <li>• Match category to Google Business Profile category</li>
                    <li>
                      • See{' '}
                      <a
                        href="https://schema.org/LocalBusiness"
                        className="text-blue-600 hover:underline"
                      >
                        schema.org/LocalBusiness
                      </a>{' '}
                      for subtypes
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Multi-Location Businesses */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">
                Multi-Location Businesses
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">
                  If you have multiple locations, implement LocalBusiness schema on
                  each location page individually:
                </p>

                <div className="bg-slate-50 border-l-4 border-slate-800 p-4">
                  <p className="font-semibold mb-2">Implementation Strategy:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
                    <li>
                      Create a unique page for each location (/locations/new-york,
                      /locations/boston)
                    </li>
                    <li>
                      Add LocalBusiness schema to each location page with specific
                      NAP data
                    </li>
                    <li>
                      Use Organization schema on homepage with address of
                      headquarters
                    </li>
                    <li>Create a locations landing page linking to all locations</li>
                    <li>
                      Match each location page URL to Google Business Profile
                      website field
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <CTA
              title="Validate All Your Location Pages"
              description="Use Batch Schema Audit to validate LocalBusiness schema across all your location pages. Perfect for multi-location businesses."
              primaryButton={{ text: 'Start Batch Audit', href: '/audit' }}
              variant="slate"
              className="mt-16"
            />

            {/* FAQ Section */}
            <FAQSection
              faqs={localBusinessFAQs}
              title="LocalBusiness Schema FAQ"
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
