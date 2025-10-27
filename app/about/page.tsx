import { ContentMetadata } from '@/components/seo/LastUpdated';
import { CTA } from '@/components/seo/RelatedResources';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              About Schema Validator
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed">
              Professional-grade structured data validation for SEO experts, developers, and content creators
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto space-y-12">

          {/* Mission Statement */}
          <section className="bg-white rounded-2xl p-10 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
            <p className="text-lg text-slate-700 leading-relaxed mb-4">
              Schema Validator was created to help website owners, SEO professionals, and developers ensure their structured data is correctly implemented and optimized for search engines.
            </p>
            <p className="text-lg text-slate-700 leading-relaxed">
              We believe that proper structured data implementation is crucial for modern SEO, and our tool makes it easy to validate, debug, and optimize Schema.org markup for Google Rich Results.
            </p>
          </section>

          {/* Why Trust Us */}
          <section className="bg-white rounded-2xl p-10 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Why Trust Our Validator?</h2>

            <div className="space-y-6">
              <div className="border-l-4 border-blue-600 pl-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">99%+ Accuracy</h3>
                <p className="text-slate-700">
                  Our validation engine matches Google Rich Results Test accuracy, implementing the official Schema.org specifications and Google's guidelines.
                </p>
              </div>

              <div className="border-l-4 border-green-600 pl-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Regular Updates</h3>
                <p className="text-slate-700">
                  We continuously update our validators to reflect the latest Schema.org specifications and Google Rich Results requirements.
                </p>
              </div>

              <div className="border-l-4 border-purple-600 pl-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Privacy-First</h3>
                <p className="text-slate-700">
                  Your URLs and schema data are processed in real-time and never stored on our servers. We respect your privacy and don't track validation requests.
                </p>
              </div>

              <div className="border-l-4 border-orange-600 pl-6">
                <h3 className="text-xl font-semibold text-slate-900 mb-2">Open & Transparent</h3>
                <p className="text-slate-700">
                  Our validation rules are based on publicly available Schema.org and Google documentation. We provide clear explanations for every error and warning.
                </p>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="bg-white rounded-2xl p-10 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">How It Works</h2>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-xl">1</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Extract Schema Data</h3>
                  <p className="text-slate-700">
                    Our parser extracts JSON-LD structured data from your URL or validates your direct schema markup input.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xl">2</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">4-Layer Validation</h3>
                  <p className="text-slate-700">
                    We validate syntax, Schema.org compliance, Google Rich Results requirements, and provide SEO recommendations.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-xl">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Actionable Feedback</h3>
                  <p className="text-slate-700">
                    Get detailed reports with specific fixes for errors, warnings about potential issues, and suggestions for optimization.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Supported Schema Types */}
          <section className="bg-white rounded-2xl p-10 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Supported Schema Types</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/validate/article" className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all">
                <h3 className="font-semibold text-slate-900 mb-1">📄 Article Schema</h3>
                <p className="text-sm text-slate-600">Article, NewsArticle, BlogPosting</p>
              </Link>

              <Link href="/validate/product" className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all">
                <h3 className="font-semibold text-slate-900 mb-1">🛍️ Product Schema</h3>
                <p className="text-sm text-slate-600">Product, Offer, AggregateRating</p>
              </Link>

              <Link href="/validate/organization" className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all">
                <h3 className="font-semibold text-slate-900 mb-1">🏢 Organization Schema</h3>
                <p className="text-sm text-slate-600">Organization, LocalBusiness</p>
              </Link>

              <Link href="/validate/breadcrumb" className="p-4 border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all">
                <h3 className="font-semibold text-slate-900 mb-1">🔗 Breadcrumb Schema</h3>
                <p className="text-sm text-slate-600">BreadcrumbList navigation</p>
              </Link>
            </div>
          </section>

          {/* Privacy & Data Handling */}
          <section className="bg-white rounded-2xl p-10 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Privacy & Data Handling</h2>

            <div className="space-y-4 text-slate-700">
              <p>
                <strong className="text-slate-900">No Data Storage:</strong> We don't store your URLs, schema markup, or validation results. All processing happens in real-time during your session.
              </p>

              <p>
                <strong className="text-slate-900">No Tracking:</strong> We don't use analytics cookies or track individual validation requests beyond basic rate limiting for service stability.
              </p>

              <p>
                <strong className="text-slate-900">Secure Processing:</strong> All validation requests are processed over HTTPS to ensure your data remains secure in transit.
              </p>

              <p>
                <strong className="text-slate-900">Rate Limiting:</strong> We implement basic IP-based rate limiting (10 requests per minute) to ensure fair usage and service availability for all users.
              </p>
            </div>
          </section>

          {/* Contact & Resources */}
          <section className="bg-white rounded-2xl p-10 shadow-sm">
            <h2 className="text-3xl font-bold text-slate-900 mb-6">Resources & Documentation</h2>

            <div className="space-y-3">
              <p className="text-slate-700">
                For detailed information about structured data and Schema.org:
              </p>

              <ul className="space-y-2">
                <li>
                  <a
                    href="https://schema.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Schema.org Official Documentation →
                  </a>
                </li>
                <li>
                  <a
                    href="https://developers.google.com/search/docs/appearance/structured-data"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Google Search Central - Structured Data →
                  </a>
                </li>
                <li>
                  <a
                    href="https://search.google.com/test/rich-results"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Google Rich Results Test →
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* Content Metadata */}
          <div className="bg-slate-100 rounded-xl p-6">
            <ContentMetadata
              author={{
                name: 'Schema Validator Team',
                role: 'SEO & Structured Data Experts',
              }}
              lastUpdated="2024-01-15"
              layout="vertical"
            />
          </div>

          {/* CTA */}
          <CTA
            title="Start Validating Your Schema"
            description="Try our professional schema validator and ensure your structured data is optimized for Google Rich Results."
            primaryButton={{ text: 'Validate Schema', href: '/' }}
            secondaryButton={{ text: 'Batch Audit Tool', href: '/audit' }}
            variant="slate"
          />
        </div>
      </div>
    </main>
  );
}
