'use client';

import { useState } from 'react';
import { ValidationForm } from '@/components/validation/ValidationForm';
import { ResultsDisplay } from '@/components/validation/ResultsDisplay';
import { SchemaExamples } from '@/components/schema/SchemaExamples';
import { SchemaTypeCard } from '@/components/schema/SchemaTypeCard';
import { FAQSection, TLDR, KeyTakeaways } from '@/components/seo/FAQSection';
import { RelatedResources, CTA, BreadcrumbNav } from '@/components/seo/RelatedResources';
import { organizationFAQs } from '@/lib/seo/faq-data';
import type { ValidationResponse } from '@/lib/validation/types';
import { organizationExamples } from '@/lib/seo/examples';

export default function OrganizationPage() {
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
      title: 'LocalBusiness Schema Validator',
      description: 'Validate local business data with hours, location, and reviews',
      href: '/validate/organization/local-business',
      icon: '🏪',
      category: 'validator' as const
    },
    {
      title: 'Article Schema Validator',
      description: 'Validate article content from your organization',
      href: '/validate/article',
      icon: '📄',
      category: 'validator' as const
    },
    {
      title: 'Batch Schema Audit',
      description: 'Validate all your organization pages at once',
      href: '/audit',
      icon: '📊',
      category: 'tool' as const
    }
  ];

  const keyTakeaways = [
    'Organization schema powers Google Knowledge Panel for branded searches',
    'Include logo as ImageObject (112x112px minimum, square or rectangular)',
    'Add sameAs social profiles (Facebook, Twitter, LinkedIn, Wikipedia) for verification',
    'Use contactPoint for customer service with phone, email, and contact type',
    'Combine with LocalBusiness schema for businesses with physical locations'
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
                { label: 'Organization Schema', href: '/validate/organization' }
              ]} />
            </div>

            {/* Compact Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <span className="text-sm text-white/90">Organization Schema Validator</span>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-xs font-semibold text-white">Knowledge Panel</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Validate Organization Schema
              </h1>
              <p className="text-base text-slate-300 max-w-2xl mx-auto">
                Ensure company information appears correctly in Google's Knowledge Graph
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
                <strong>Organization Schema</strong> helps Google create and display your company's Knowledge Panel in search results. This validator checks company name, logo (112x112px min), official URL, social profiles (sameAs), and contact information. Essential for brand SERP (search engine results page) and establishing company identity in Google's Knowledge Graph.
              </p>
            </TLDR>
          )}

          {/* Key Takeaways */}
          {!results && !isValidating && (
            <KeyTakeaways points={keyTakeaways} />
          )}

          {/* Related Schema Types */}
          {!results && !isValidating && (
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <SchemaTypeCard
                title="LocalBusiness Schema"
                description="For businesses with physical locations, hours, and local SEO"
                href="/validate/organization/local-business"
                icon="🏪"
                color="purple"
              />
            </div>
          )}

        {/* Loading State */}
        {isValidating && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-transparent" />
              <p className="text-lg font-medium">
                Validating organization schema...
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
                Organization Schema Requirements
              </h2>
              <div className="space-y-4">
                <div className="border-l-4 border-slate-800 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Required Properties</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        <strong>name:</strong> Official company/organization name
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        <strong>url:</strong> Official website URL
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-slate-800 pl-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Recommended for Knowledge Graph
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>logo:</strong> Company logo (ImageObject or URL)
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>contactPoint:</strong> Customer service phone/email
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>sameAs:</strong> Social media profile URLs
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>description:</strong> Brief company description
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-slate-600 mr-2">•</span>
                      <span>
                        <strong>address:</strong> Headquarters or main office address
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Code Examples */}
            <SchemaExamples examples={organizationExamples} />

            {/* Knowledge Graph Tips */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">
                Knowledge Graph Optimization
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">
                  Organization schema helps Google create and enhance your
                  company's Knowledge Panel, which appears in search results for
                  branded queries.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border-l-4 border-slate-800 pl-4">
                    <h3 className="font-semibold mb-2">Logo Requirements</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Square or rectangular format</li>
                      <li>• Minimum 112x112px</li>
                      <li>• Transparent or white background preferred</li>
                      <li>• PNG or SVG format recommended</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-slate-800 pl-4">
                    <h3 className="font-semibold mb-2">Social Profiles</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Facebook, Twitter/X, LinkedIn, Instagram</li>
                      <li>• YouTube channel URL</li>
                      <li>• Wikipedia page (if available)</li>
                      <li>• Crunchbase profile</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-green-600 pl-4">
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• Use contactPoint for customer service</li>
                      <li>• Include phone number with country code</li>
                      <li>• Specify contactType (e.g., "Customer Service")</li>
                      <li>• Add available languages if multilingual</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-orange-600 pl-4">
                    <h3 className="font-semibold mb-2">Additional Details</h3>
                    <ul className="space-y-1 text-sm text-gray-700">
                      <li>• FoundingDate for company history</li>
                      <li>• Founders/employees (Person objects)</li>
                      <li>• ParentOrganization if applicable</li>
                      <li>• Awards and recognitions</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Common Use Cases */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">Common Use Cases</h2>
              <div className="space-y-4">
                <details className="border rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">
                    Corporation / Large Company
                  </summary>
                  <p className="mt-2 text-gray-700">
                    Use Organization schema on your homepage. Include extensive
                    social profiles, multiple contact points (sales, support,
                    investor relations), and organizational structure with
                    departments.
                  </p>
                </details>
                <details className="border rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">
                    Startup / SMB
                  </summary>
                  <p className="mt-2 text-gray-700">
                    Focus on name, logo, url, and sameAs social profiles. Add
                    founder information and founding date to establish credibility.
                  </p>
                </details>
                <details className="border rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">
                    Non-Profit Organization
                  </summary>
                  <p className="mt-2 text-gray-700">
                    Include mission statement in description, add donation
                    information, and specify tax-exempt status. Link to charity
                    rating platforms (GuideStar, Charity Navigator).
                  </p>
                </details>
                <details className="border rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">
                    Educational Institution
                  </summary>
                  <p className="mt-2 text-gray-700">
                    Use EducationalOrganization subtype. Include address,
                    accreditation info, programs offered, and alumni associations.
                  </p>
                </details>
              </div>
            </div>

            {/* CTA Section */}
            <CTA
              title="Validate Your Local Business Schema"
              description="If your organization has physical locations, use our LocalBusiness validator to optimize for local search and Google Maps."
              primaryButton={{ text: 'Validate LocalBusiness Schema', href: '/validate/organization/local-business' }}
              variant="slate"
              className="mt-16"
            />

            {/* FAQ Section */}
            <FAQSection
              faqs={organizationFAQs}
              title="Organization Schema FAQ"
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
