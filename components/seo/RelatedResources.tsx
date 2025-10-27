import Link from 'next/link';

/**
 * Related Resources Component
 * Displays internal links to related validation tools and pages
 */

export interface RelatedLink {
  title: string;
  description: string;
  href: string;
  icon?: string;
  category?: 'validator' | 'guide' | 'tool';
}

interface RelatedResourcesProps {
  resources: RelatedLink[];
  title?: string;
  columns?: 1 | 2 | 3;
  className?: string;
}

export function RelatedResources({
  resources,
  title = 'Related Resources',
  columns = 2,
  className = ''
}: RelatedResourcesProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-200 p-8 lg:p-10 ${className}`}>
      <h2 className="text-2xl font-bold text-slate-800 mb-8">{title}</h2>

      <div className={`grid ${gridCols[columns]} gap-5`}>
        {resources.map((resource, index) => (
          <Link
            key={index}
            href={resource.href}
            className="group border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-gray-300 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-start gap-4">
              {resource.icon && (
                <span className="text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  {resource.icon}
                </span>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-slate-800 group-hover:text-slate-900 transition-colors mb-2">
                  {resource.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed line-clamp-2">
                  {resource.description}
                </p>
                {resource.category && (
                  <span className="inline-block mt-3 text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                    {resource.category.charAt(0).toUpperCase() + resource.category.slice(1)}
                  </span>
                )}
              </div>
              <svg
                className="w-5 h-5 text-slate-400 group-hover:text-slate-600 group-hover:translate-x-1 transition-all flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

/**
 * CTA (Call to Action) component
 */
interface CTAProps {
  title: string;
  description: string;
  primaryButton: {
    text: string;
    href: string;
  };
  secondaryButton?: {
    text: string;
    href: string;
  };
  variant?: 'slate' | 'blue' | 'green' | 'purple' | 'indigo';
  className?: string;
}

export function CTA({
  title,
  description,
  primaryButton,
  secondaryButton,
  variant = 'blue',
  className = ''
}: CTAProps) {
  const variants = {
    slate: {
      bg: 'bg-slate-900',
      button: 'bg-white text-slate-900 hover:bg-slate-50 shadow-lg hover:shadow-xl',
      secondaryButton: 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700'
    },
    blue: {
      bg: 'bg-slate-900',
      button: 'bg-white text-slate-900 hover:bg-slate-50 shadow-lg hover:shadow-xl',
      secondaryButton: 'border-slate-700 bg-slate-800 text-white hover:bg-slate-700'
    },
    green: {
      bg: 'bg-emerald-900',
      button: 'bg-white text-emerald-900 hover:bg-slate-50 shadow-lg hover:shadow-xl',
      secondaryButton: 'border-emerald-700 bg-emerald-800 text-white hover:bg-emerald-700'
    },
    purple: {
      bg: 'bg-purple-900',
      button: 'bg-white text-purple-900 hover:bg-slate-50 shadow-lg hover:shadow-xl',
      secondaryButton: 'border-purple-700 bg-purple-800 text-white hover:bg-purple-700'
    },
    indigo: {
      bg: 'bg-indigo-900',
      button: 'bg-white text-indigo-900 hover:bg-slate-50 shadow-lg hover:shadow-xl',
      secondaryButton: 'border-indigo-700 bg-indigo-800 text-white hover:bg-indigo-700'
    }
  };

  const colors = variants[variant];

  return (
    <div className={`${colors.bg} rounded-2xl p-10 lg:p-12 text-center ${className}`}>
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-5">
        {title}
      </h2>
      <p className="text-lg text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Link
          href={primaryButton.href}
          className={`px-8 py-4 rounded-xl font-semibold transition-all duration-300 ${colors.button}`}
        >
          {primaryButton.text}
        </Link>

        {secondaryButton && (
          <Link
            href={secondaryButton.href}
            className={`px-8 py-4 rounded-xl font-semibold border-2 transition-all duration-300 ${colors.secondaryButton}`}
          >
            {secondaryButton.text}
          </Link>
        )}
      </div>
    </div>
  );
}

/**
 * Breadcrumb navigation component for internal linking
 */
export interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbNavProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function BreadcrumbNav({ items, className = '' }: BreadcrumbNavProps) {
  // Generate BreadcrumbList JSON-LD schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://schema-validator.com/',
      },
      ...items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 2,
        name: item.label,
        item: `https://schema-validator.com${item.href}`,
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />
      <nav className={`flex items-center gap-2 text-sm ${className}`} aria-label="Breadcrumb">
        <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
          Home
        </Link>

        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="text-gray-400">›</span>
            {index === items.length - 1 ? (
              <span className="text-gray-900 font-medium">{item.label}</span>
            ) : (
              <Link
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
