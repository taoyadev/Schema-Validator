'use client';

import { useState } from 'react';
import { ValidationForm } from '@/components/validation/ValidationForm';
import { ResultsDisplay } from '@/components/validation/ResultsDisplay';
import { SchemaExamples } from '@/components/schema/SchemaExamples';
import { SchemaTypeCard } from '@/components/schema/SchemaTypeCard';
import { FAQSection, TLDR, KeyTakeaways } from '@/components/seo/FAQSection';
import { RelatedResources, CTA, BreadcrumbNav } from '@/components/seo/RelatedResources';
import { jsonldFAQs } from '@/lib/seo/faq-data';
import type { ValidationResponse } from '@/lib/validation/types';
import { jsonldExamples } from '@/lib/seo/examples';

export default function JsonLdValidatorPage() {
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
      description: 'Validate Article JSON-LD for Google Rich Results',
      href: '/validate/article',
      icon: '📄',
      category: 'validator' as const
    },
    {
      title: 'Product Schema Validator',
      description: 'Validate Product JSON-LD with offers and reviews',
      href: '/validate/product',
      icon: '🛍️',
      category: 'validator' as const
    },
    {
      title: 'Organization Schema Validator',
      description: 'Validate Organization JSON-LD for Knowledge Graph',
      href: '/validate/organization',
      icon: '🏢',
      category: 'validator' as const
    },
    {
      title: 'Batch Schema Audit',
      description: 'Validate JSON-LD on multiple URLs at once',
      href: '/audit',
      icon: '📊',
      category: 'tool' as const
    }
  ];

  const keyTakeaways = [
    'JSON-LD is Google\'s recommended format for structured data',
    'Use <script type="application/ld+json"> tags to embed JSON-LD',
    'Always include @context: "https://schema.org" and @type properties',
    'You can have multiple JSON-LD blocks per page for different schema types',
    'JSON-LD is easier to implement and maintain than Microdata or RDFa',
    'Validate JSON-LD before deployment to avoid Rich Results errors'
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
                { label: 'JSON-LD Validator', href: '/json-ld-validator' }
              ]} />
            </div>

            {/* Compact Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <span className="text-sm text-white/90">JSON-LD Schema Validator</span>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-xs font-semibold text-white">Google Preferred</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                JSON-LD Validator - Schema.org Structured Data Tool
              </h1>
              <p className="text-base text-slate-300 max-w-2xl mx-auto">
                Free JSON-LD schema validator for Schema.org structured data. Validate JSON-LD markup for Google Rich Results compliance with instant feedback.
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
                <strong>JSON-LD (JavaScript Object Notation for Linked Data)</strong> is Google's recommended format for implementing Schema.org structured data. This JSON-LD validator checks your structured data syntax, Schema.org compliance, and Google Rich Results requirements. Simply paste your JSON-LD code or enter a URL to validate. Our free JSON-LD schema validator provides instant error detection, fix suggestions, and SEO recommendations.
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
                <p className="text-lg font-medium">Validating JSON-LD structured data...</p>
              </div>
            </div>
          )}

          {/* Results */}
          {results && !isValidating && <ResultsDisplay results={results} />}

          {/* What is JSON-LD Section */}
          {!results && !isValidating && (
            <>
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6">
                  What is JSON-LD?
                </h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    <strong>JSON-LD (JavaScript Object Notation for Linked Data)</strong> is a lightweight data format for implementing Schema.org structured data on web pages. It's Google's preferred method because:
                  </p>
                  <ul className="space-y-2 ml-6 list-disc">
                    <li><strong>Easy to implement:</strong> JSON-LD sits in a separate script block, not mixed with HTML</li>
                    <li><strong>Maintainable:</strong> Changes don't affect page layout or design</li>
                    <li><strong>Flexible:</strong> Easy to add, update, or remove structured data</li>
                    <li><strong>Dynamic-friendly:</strong> Works well with JavaScript frameworks and CMSes</li>
                    <li><strong>Validation-ready:</strong> Easy to test with JSON-LD validators before deployment</li>
                  </ul>
                  <p className="mt-4">
                    Unlike Microdata and RDFa which inline markup within HTML elements, JSON-LD uses a <code className="bg-gray-100 px-2 py-1 rounded">&lt;script type="application/ld+json"&gt;</code> tag, making it cleaner and more developer-friendly.
                  </p>
                </div>
              </div>

              {/* JSON-LD Format Requirements */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-4">
                  JSON-LD Format Requirements
                </h2>
                <div className="space-y-4">
                  <div className="border-l-4 border-slate-800 pl-4">
                    <h3 className="font-semibold text-lg mb-2">Required Elements</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>
                          <strong>@context:</strong> Must be "https://schema.org"
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>
                          <strong>@type:</strong> The Schema.org type (Article, Product, Organization, etc.)
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>
                          <strong>Valid JSON syntax:</strong> Proper commas, quotes, and brackets
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-green-600 mr-2">✓</span>
                        <span>
                          <strong>Required properties:</strong> Based on the schema type (varies by @type)
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-blue-600 pl-4">
                    <h3 className="font-semibold text-lg mb-2">
                      Best Practices
                    </h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>
                          Place JSON-LD in the &lt;head&gt; section for consistency
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>
                          Use multiple JSON-LD blocks for different schema types on the same page
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>
                          Validate JSON-LD before publishing using our validator tool
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>
                          Include recommended properties for better rich results eligibility
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Schema Type Validators */}
              <div className="mt-20">
                <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4 text-slate-900">
                  Validate by Schema Type
                </h2>
                <p className="text-center text-slate-600 mb-12 text-lg">
                  Choose a specific schema type for targeted JSON-LD validation
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <SchemaTypeCard
                    title="Article Schema"
                    description="Validate Article JSON-LD for rich results"
                    href="/validate/article"
                    icon="📄"
                    color="blue"
                  />
                  <SchemaTypeCard
                    title="Product Schema"
                    description="Validate Product JSON-LD with offers and reviews"
                    href="/validate/product"
                    icon="🛍️"
                    color="green"
                  />
                  <SchemaTypeCard
                    title="Organization Schema"
                    description="Validate Organization JSON-LD for Knowledge Graph"
                    href="/validate/organization"
                    icon="🏢"
                    color="purple"
                  />
                  <SchemaTypeCard
                    title="LocalBusiness Schema"
                    description="Validate LocalBusiness JSON-LD for Google Maps"
                    href="/validate/organization/local-business"
                    icon="🏪"
                    color="orange"
                  />
                  <SchemaTypeCard
                    title="Breadcrumb Schema"
                    description="Validate BreadcrumbList JSON-LD for search"
                    href="/validate/breadcrumb"
                    icon="🔗"
                    color="blue"
                  />
                  <SchemaTypeCard
                    title="NewsArticle Schema"
                    description="Validate NewsArticle JSON-LD for Google News"
                    href="/validate/article/news"
                    icon="📰"
                    color="green"
                  />
                </div>
              </div>

              {/* Code Examples */}
              <SchemaExamples examples={jsonldExamples} />

              {/* Common JSON-LD Errors */}
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-4">Common JSON-LD Errors</h2>
                <div className="space-y-4">
                  <details className="border rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer">
                      Missing @context or @type
                    </summary>
                    <p className="mt-2 text-gray-700">
                      Every JSON-LD block must include <code className="bg-gray-100 px-2 py-1 rounded">"@context": "https://schema.org"</code> and <code className="bg-gray-100 px-2 py-1 rounded">"@type"</code> properties. These tell Google what vocabulary and schema type you're using.
                    </p>
                  </details>
                  <details className="border rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer">
                      Invalid JSON syntax
                    </summary>
                    <p className="mt-2 text-gray-700">
                      Common JSON syntax errors include: missing commas between properties, trailing commas after the last property, unescaped quotes in strings, and mismatched brackets. Our JSON-LD validator catches these immediately with specific error messages.
                    </p>
                  </details>
                  <details className="border rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer">
                      Incorrect property names
                    </summary>
                    <p className="mt-2 text-gray-700">
                      Property names must match Schema.org vocabulary exactly. For example, use <code className="bg-gray-100 px-2 py-1 rounded">datePublished</code> (camelCase), not <code className="bg-gray-100 px-2 py-1 rounded">date_published</code> or <code className="bg-gray-100 px-2 py-1 rounded">DatePublished</code>. Check Schema.org documentation for correct property names.
                    </p>
                  </details>
                  <details className="border rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer">
                      Missing required properties
                    </summary>
                    <p className="mt-2 text-gray-700">
                      Each schema type has required properties for Google Rich Results. For example, Article requires headline, image, datePublished, author, and publisher. Our JSON-LD schema validator checks all required properties and provides fix suggestions.
                    </p>
                  </details>
                  <details className="border rounded-lg p-4">
                    <summary className="font-semibold cursor-pointer">
                      Nested object errors
                    </summary>
                    <p className="mt-2 text-gray-700">
                      Complex properties like author, publisher, or offers must be properly nested objects with their own @type. For example, publisher must be an Organization with a logo ImageObject. Our validator checks nested object structure and requirements.
                    </p>
                  </details>
                </div>
              </div>

              {/* CTA Section */}
              <CTA
                title="Need to Validate JSON-LD on Multiple Pages?"
                description="Use our Batch Schema Audit tool to validate JSON-LD structured data across your entire website. Perfect for SEO audits and quality assurance."
                primaryButton={{ text: 'Start Batch Audit', href: '/audit' }}
                variant="blue"
                className="mt-16"
              />

              {/* FAQ Section */}
              <FAQSection
                faqs={jsonldFAQs}
                title="JSON-LD Validator FAQ"
                className="mt-16"
              />

              {/* Related Resources */}
              <RelatedResources
                resources={relatedResources}
                title="Related Validators"
                columns={2}
                className="mt-16"
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
