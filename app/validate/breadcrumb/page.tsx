'use client';

import { useState } from 'react';
import { ValidationForm } from '@/components/validation/ValidationForm';
import { ResultsDisplay } from '@/components/validation/ResultsDisplay';
import { SchemaExamples } from '@/components/schema/SchemaExamples';
import { FAQSection, TLDR, KeyTakeaways } from '@/components/seo/FAQSection';
import { RelatedResources, CTA, BreadcrumbNav } from '@/components/seo/RelatedResources';
import { breadcrumbFAQs } from '@/lib/seo/faq-data';
import type { ValidationResponse } from '@/lib/validation/types';
import { breadcrumbExamples } from '@/lib/seo/examples';

export default function BreadcrumbPage() {
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
      description: 'Validate article pages with breadcrumb navigation',
      href: '/validate/article',
      icon: '📄',
      category: 'validator' as const
    },
    {
      title: 'Product Schema Validator',
      description: 'Validate product pages with category breadcrumbs',
      href: '/validate/product',
      icon: '🛍️',
      category: 'validator' as const
    },
    {
      title: 'Batch Schema Audit',
      description: 'Validate breadcrumbs across all pages',
      href: '/audit',
      icon: '📊',
      category: 'tool' as const
    }
  ];

  const keyTakeaways = [
    'Breadcrumb schema displays site hierarchy above page titles in Google search results',
    'Position numbers must be sequential (1, 2, 3...) with no gaps or duplicates',
    'Use absolute URLs with protocol (https://) not relative paths (/page)',
    'Each page should have only one BreadcrumbList - choose primary path for multi-category items',
    'Visual breadcrumbs on page should match structured data breadcrumbs exactly'
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
                { label: 'BreadcrumbList Schema', href: '/validate/breadcrumb' }
              ]} />
            </div>

            {/* Compact Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <span className="text-sm text-white/90">BreadcrumbList Validator</span>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-xs font-semibold text-white">Navigation SEO</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Validate BreadcrumbList Schema
              </h1>
              <p className="text-base text-slate-300 max-w-2xl mx-auto">
                Display site hierarchy clearly in Google search results with clickable breadcrumbs
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
                <strong>BreadcrumbList Schema</strong> displays navigation breadcrumbs in Google search results, showing users the page's position in your site hierarchy. This validator checks itemListElement structure, sequential position numbers (1, 2, 3...), proper item URLs (absolute, not relative), and name properties for each breadcrumb level. Improves click-through rates and user navigation.
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
                Validating BreadcrumbList schema...
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
                BreadcrumbList Requirements
              </h2>
              <div className="space-y-4">
                <div className="bg-slate-50 border-l-4 border-slate-800 p-4">
                  <p className="font-semibold mb-2">
                    What are Breadcrumbs in Search?
                  </p>
                  <p className="text-sm text-gray-700">
                    Breadcrumbs show the page's position in the site hierarchy.
                    They appear above the page title in Google search results,
                    helping users understand your site structure and navigate
                    directly to parent pages.
                  </p>
                </div>

                <div className="border-l-4 border-slate-800 pl-4">
                  <h3 className="font-semibold text-lg mb-2">
                    Required Structure
                  </h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        <strong>itemListElement:</strong> Array of ListItem objects
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        <strong>position:</strong> Numeric position starting at 1
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        <strong>name:</strong> Display text for each breadcrumb
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-green-600 mr-2">✓</span>
                      <span>
                        <strong>item:</strong> URL of the breadcrumb page
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="border-l-4 border-yellow-600 pl-4">
                  <h3 className="font-semibold text-lg mb-2">Important Rules</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li>• Position numbers must be sequential (1, 2, 3...)</li>
                    <li>• First item is typically the homepage</li>
                    <li>
                      • Last item can be the current page (but URL is optional)
                    </li>
                    <li>• URLs must be absolute, not relative paths</li>
                    <li>• Each page should have only one BreadcrumbList</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Code Examples */}
            <SchemaExamples examples={breadcrumbExamples} />

            {/* Visual Example */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">
                How Breadcrumbs Appear in Search
              </h2>
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Without breadcrumb markup:
                  </p>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="text-xs text-green-700 mb-1">
                      https://example.com › products › electronics › headphones
                    </div>
                    <div className="text-lg text-blue-600 font-medium">
                      Premium Wireless Headphones
                    </div>
                    <div className="text-sm text-gray-700">
                      High-quality wireless headphones with noise cancellation...
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    With breadcrumb markup:
                  </p>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        Home
                      </span>
                      <span>›</span>
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        Products
                      </span>
                      <span>›</span>
                      <span className="text-blue-600 hover:underline cursor-pointer">
                        Electronics
                      </span>
                    </div>
                    <div className="text-lg text-blue-600 font-medium">
                      Premium Wireless Headphones
                    </div>
                    <div className="text-sm text-gray-700">
                      High-quality wireless headphones with noise cancellation...
                    </div>
                  </div>
                  <p className="text-xs text-green-700 mt-2">
                    ✓ Breadcrumbs are clickable and show site structure
                  </p>
                </div>
              </div>
            </div>

            {/* Implementation Guide */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">
                Implementation Best Practices
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-l-4 border-slate-800 pl-4">
                  <h3 className="font-semibold mb-2">📁 Site Structure</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Match breadcrumbs to URL structure when possible</li>
                    <li>• Keep hierarchy depth reasonable (3-5 levels)</li>
                    <li>• Use logical categorization</li>
                    <li>• Avoid skipping levels in the hierarchy</li>
                  </ul>
                </div>

                <div className="border-l-4 border-green-600 pl-4">
                  <h3 className="font-semibold mb-2">🎨 Visual Breadcrumbs</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Show breadcrumbs visually on your pages too</li>
                    <li>• Place them near the top, above page title</li>
                    <li>• Use separators (›, /, &gt;) for clarity</li>
                    <li>• Make breadcrumb items clickable links</li>
                  </ul>
                </div>

                <div className="border-l-4 border-purple-600 pl-4">
                  <h3 className="font-semibold mb-2">🔗 URL Guidelines</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Use canonical URLs in breadcrumbs</li>
                    <li>• Include protocol (https://)</li>
                    <li>• Match exactly to actual page URLs</li>
                    <li>• Avoid URL parameters when possible</li>
                  </ul>
                </div>

                <div className="border-l-4 border-orange-600 pl-4">
                  <h3 className="font-semibold mb-2">⚡ Dynamic Pages</h3>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li>• Generate breadcrumbs server-side or at build time</li>
                    <li>• Update for category/filter changes</li>
                    <li>• Handle multi-path scenarios (products in multiple categories)</li>
                    <li>• Use primary category path for products</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Common Mistakes */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">Common Mistakes</h2>
              <div className="space-y-4">
                <details className="border rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">
                    Position numbers not sequential
                  </summary>
                  <div className="mt-2">
                    <p className="text-gray-700 text-sm mb-2">
                      ❌ Wrong: position: 1, 2, 4 (skipping 3)
                    </p>
                    <p className="text-gray-700 text-sm">
                      ✅ Correct: position: 1, 2, 3, 4 (sequential)
                    </p>
                  </div>
                </details>

                <details className="border rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">
                    Using relative URLs
                  </summary>
                  <div className="mt-2">
                    <p className="text-gray-700 text-sm mb-2">
                      ❌ Wrong: "item": "/products/electronics"
                    </p>
                    <p className="text-gray-700 text-sm">
                      ✅ Correct: "item": "https://example.com/products/electronics"
                    </p>
                  </div>
                </details>

                <details className="border rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">
                    Multiple BreadcrumbLists per page
                  </summary>
                  <div className="mt-2">
                    <p className="text-gray-700 text-sm">
                      Each page should have only one BreadcrumbList. If a product
                      is in multiple categories, choose the primary/canonical path.
                    </p>
                  </div>
                </details>

                <details className="border rounded-lg p-4">
                  <summary className="font-semibold cursor-pointer">
                    Breadcrumbs don't match visual UI
                  </summary>
                  <div className="mt-2">
                    <p className="text-gray-700 text-sm">
                      The structured data breadcrumbs should match what users see
                      on the page. Inconsistencies confuse both users and search
                      engines.
                    </p>
                  </div>
                </details>
              </div>
            </div>

            {/* E-commerce Example */}
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-4">
                E-commerce Category Pages
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-700 mb-4">
                  For e-commerce sites, breadcrumbs are especially important for
                  category and product pages:
                </p>

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gray-50 border rounded-lg p-4">
                    <p className="font-semibold mb-2">Category Page Example:</p>
                    <div className="text-sm">
                      Home › Men's Clothing › T-Shirts › Graphic Tees
                    </div>
                  </div>

                  <div className="bg-gray-50 border rounded-lg p-4">
                    <p className="font-semibold mb-2">Product Page Example:</p>
                    <div className="text-sm">
                      Home › Electronics › Audio › Headphones › Wireless Headphones
                    </div>
                  </div>

                  <div className="bg-gray-50 border rounded-lg p-4">
                    <p className="font-semibold mb-2">Blog Post Example:</p>
                    <div className="text-sm">
                      Home › Blog › Technology › Product Reviews
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <CTA
              title="Validate Your Complete Site Structure"
              description="Use Batch Schema Audit to validate breadcrumbs across all your pages. Import from sitemap to check navigation consistency."
              primaryButton={{ text: 'Start Batch Audit', href: '/audit' }}
              variant="slate"
              className="mt-16"
            />

            {/* FAQ Section */}
            <FAQSection
              faqs={breadcrumbFAQs}
              title="BreadcrumbList Schema FAQ"
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
