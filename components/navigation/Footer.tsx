import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-slate-800 mt-24 bg-slate-900">
      <div className="container mx-auto px-6 lg:px-8 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
            <div>
              <h4 className="font-bold text-white mb-5">Schema Types</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/validate/article"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Article Schema
                  </Link>
                </li>
                <li>
                  <Link
                    href="/validate/product"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Product Schema
                  </Link>
                </li>
                <li>
                  <Link
                    href="/validate/organization"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Organization Schema
                  </Link>
                </li>
                <li>
                  <Link
                    href="/validate/breadcrumb"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Breadcrumb Schema
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-5">Tools</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/audit"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Batch Schema Audit
                  </Link>
                </li>
                <li>
                  <Link href="/" className="text-slate-400 hover:text-white transition-colors">
                    Schema Validator
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-5">Resources</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <a
                    href="https://schema.org"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Schema.org
                  </a>
                </li>
                <li>
                  <a
                    href="https://developers.google.com/search/docs/appearance/structured-data"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    Google Rich Results
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-5">Company</h4>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <p className="text-slate-400 leading-relaxed">
                    Professional Schema.org validation tool for SEO professionals
                  </p>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-10 text-center">
            <p className="text-sm text-slate-500">
              Built with Next.js 14, TypeScript, and Tailwind CSS. Free forever.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
