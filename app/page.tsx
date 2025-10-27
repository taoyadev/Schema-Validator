'use client';

import { useState } from 'react';
import Script from 'next/script';
import { ValidationForm } from '@/components/validation/ValidationForm';
import { ResultsDisplay } from '@/components/validation/ResultsDisplay';
import { SchemaTypeCard } from '@/components/schema/SchemaTypeCard';
import { FAQSection, TLDR } from '@/components/seo/FAQSection';
import { RelatedResources, CTA } from '@/components/seo/RelatedResources';
import { homepageFAQs } from '@/lib/seo/faq-data';
import type { ValidationResponse } from '@/lib/validation/types';

export default function HomePage() {
  const [results, setResults] = useState<ValidationResponse | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Schema Validator',
    alternateName: 'Schema.org Validator',
    url: 'https://www.schemavalidator.com',
    description:
      'Free online tool for validating Schema.org structured data and ensuring Google Rich Results compliance',
    inLanguage: 'en-US',
    copyrightYear: 2024,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.schemavalidator.com?url={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const handleValidationComplete = (response: ValidationResponse) => {
    setResults(response);
    setIsValidating(false);
  };

  const handleValidationStart = () => {
    setIsValidating(true);
    setResults(null);
  };

  const relatedTools = [
    {
      title: 'JSON-LD Validator',
      description: 'Validate JSON-LD structured data format for Schema.org compliance',
      href: '/json-ld-validator',
      icon: '🔍',
      category: 'validator' as const
    },
    {
      title: 'Batch Schema Audit',
      description: 'Validate multiple URLs at once from sitemap or manual list. Export reports in PDF, Excel, or JSON.',
      href: '/audit',
      icon: '📊',
      category: 'tool' as const
    },
    {
      title: 'Article Schema Validator',
      description: 'Specialized validator for Article, NewsArticle, and BlogPosting schemas',
      href: '/validate/article',
      icon: '📄',
      category: 'validator' as const
    },
    {
      title: 'Product Schema Validator',
      description: 'Validate Product schemas with offers, pricing, and review ratings',
      href: '/validate/product',
      icon: '🛍️',
      category: 'validator' as const
    },
    {
      title: 'Organization Schema Validator',
      description: 'Verify company information for Knowledge Graph appearance',
      href: '/validate/organization',
      icon: '🏢',
      category: 'validator' as const
    }
  ];

  return (
    <main className="min-h-screen">
      <Script
        id="website-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema),
        }}
      />
      {/* Hero Section with Form Focus */}
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
            {/* Compact Header */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
                <span className="text-sm text-white/90">Free Schema Markup Validator Tool</span>
                <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-400 to-purple-400 text-xs font-semibold text-white">99% Accuracy</span>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Schema Markup Validator - JSON-LD & Schema.org
              </h1>
              <p className="text-base text-slate-300 max-w-2xl mx-auto">
                Free online schema markup validator for JSON-LD and Schema.org structured data. Validate schema markup for Google Rich Results compliance in seconds.
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
                <strong>Schema Validator</strong> checks your website's structured data (Schema.org markup) to ensure it meets Google's requirements for rich results. Simply enter your URL or paste your JSON-LD code, and get instant validation with actionable SEO recommendations. Perfect for content publishers, e-commerce sites, and SEO professionals.
              </p>
            </TLDR>
          )}

          {/* Loading State */}
          {isValidating && (
            <div className="bg-white rounded-2xl border border-gray-200 p-10">
              <div className="flex items-center justify-center space-x-3">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-800 border-t-transparent" />
                <p className="text-lg font-medium text-slate-700">Analyzing structured data...</p>
              </div>
            </div>
          )}

          {/* Results */}
          {results && !isValidating && (
            <ResultsDisplay results={results} />
          )}

          {/* Schema Type Validators */}
          {!results && !isValidating && (
            <>
              <div className="mt-20">
                <h2 className="text-3xl lg:text-4xl font-bold text-center mb-4 text-slate-900">
                  Validate by Schema Type
                </h2>
                <p className="text-center text-slate-600 mb-12 text-lg">
                  Choose a specific schema type for targeted validation and
                  best practices
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <SchemaTypeCard
                    title="Article Schema"
                    description="Validate articles, news, and blog posts for rich results"
                    href="/validate/article"
                    icon="📄"
                    color="blue"
                  />
                  <SchemaTypeCard
                    title="Product Schema"
                    description="Validate products, offers, and reviews for e-commerce"
                    href="/validate/product"
                    icon="🛍️"
                    color="green"
                  />
                  <SchemaTypeCard
                    title="Organization Schema"
                    description="Validate company info for Knowledge Graph"
                    href="/validate/organization"
                    icon="🏢"
                    color="purple"
                  />
                  <SchemaTypeCard
                    title="LocalBusiness Schema"
                    description="Validate local business data for Google Maps"
                    href="/validate/organization/local-business"
                    icon="🏪"
                    color="orange"
                  />
                  <SchemaTypeCard
                    title="Breadcrumb Schema"
                    description="Validate breadcrumb navigation for search results"
                    href="/validate/breadcrumb"
                    icon="🔗"
                    color="blue"
                  />
                  <SchemaTypeCard
                    title="NewsArticle Schema"
                    description="Validate news content for Google News eligibility"
                    href="/validate/article/news"
                    icon="📰"
                    color="green"
                  />
                </div>
              </div>

              {/* Features Section */}
              <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-10">
                <div className="text-center group">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    <span className="text-4xl">✓</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">
                    99%+ Accurate Schema Validation
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    Professional schema markup validator matching Google Rich Results Test accuracy for JSON-LD and Schema.org validation
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    <span className="text-4xl">⚡</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">Lightning Fast Schema Markup Validation</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Instant online schema validator with sub-second JSON-LD validation and real-time structured data error detection
                  </p>
                </div>

                <div className="text-center group">
                  <div className="w-20 h-20 bg-slate-100 rounded-2xl mx-auto mb-6 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-800">Schema.org SEO Guidance</h3>
                  <p className="text-slate-600 leading-relaxed">
                    Expert schema markup recommendations to improve Google Rich Results eligibility and structured data SEO
                  </p>
                </div>
              </div>

              {/* CTA Section */}
              <CTA
                title="Need to Validate Multiple Pages?"
                description="Use our Batch Schema Audit tool to validate up to 50 URLs at once. Perfect for comprehensive SEO audits."
                primaryButton={{ text: 'Start Batch Audit', href: '/audit' }}
                secondaryButton={{ text: 'Learn More', href: '/audit' }}
                variant="blue"
                className="mt-16"
              />

              {/* Related Tools */}
              <RelatedResources
                resources={relatedTools}
                title="Schema Validators by Type"
                columns={2}
                className="mt-16"
              />

              {/* FAQ Section */}
              <FAQSection
                faqs={homepageFAQs}
                title="Frequently Asked Questions"
                className="mt-16"
              />
            </>
          )}
        </div>
      </div>
    </main>
  );
}
