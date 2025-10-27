'use client';

/**
 * FAQ Section Component with Schema.org FAQPage markup
 * Displays frequently asked questions with proper structured data
 */

export interface FAQ {
  question: string;
  answer: string;
  helpful?: number;
  dateCreated?: string;
}

interface FAQSectionProps {
  faqs: FAQ[];
  title?: string;
  className?: string;
}

export function FAQSection({ faqs, title = 'Frequently Asked Questions', className = '' }: FAQSectionProps) {
  // Generate FAQ Schema markup
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
        ...(faq.dateCreated && { dateCreated: faq.dateCreated }),
        ...(faq.helpful && { upvoteCount: faq.helpful })
      }
    }))
  };

  return (
    <div className={`bg-white rounded-lg shadow-lg p-8 ${className}`}>
      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <h2 className="text-2xl font-semibold mb-6">{title}</h2>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details key={index} className="border rounded-lg p-4 group">
            <summary className="font-semibold cursor-pointer flex items-center justify-between">
              <span className="text-gray-900 pr-4">{faq.question}</span>
              <span className="text-gray-400 transition-transform group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div
              className="mt-4 text-gray-700 leading-relaxed prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: faq.answer }}
            />
          </details>
        ))}
      </div>

      {/* Schema.org indicator */}
      <div className="mt-6 pt-4 border-t">
        <p className="text-xs text-gray-500 flex items-center gap-2">
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          This FAQ section includes structured data for enhanced search results
        </p>
      </div>
    </div>
  );
}

/**
 * Compact TLDR component for quick answers
 */
interface TLDRProps {
  children: React.ReactNode;
  className?: string;
}

export function TLDR({ children, className = '' }: TLDRProps) {
  return (
    <div className={`bg-slate-50 border-l-4 border-slate-800 rounded-r-2xl p-8 ${className}`}>
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <svg className="w-6 h-6 text-slate-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-slate-900 mb-3">Quick Answer</h3>
          <div className="text-slate-700 leading-relaxed prose prose-sm max-w-none">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Key Takeaways component
 */
interface KeyTakeawaysProps {
  points: string[];
  className?: string;
}

export function KeyTakeaways({ points, className = '' }: KeyTakeawaysProps) {
  return (
    <div className={`bg-green-50 border-l-4 border-green-600 rounded-r-lg p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
        </svg>
        Key Takeaways
      </h3>
      <ul className="space-y-2">
        {points.map((point, index) => (
          <li key={index} className="flex items-start gap-2 text-green-900">
            <span className="text-green-600 font-bold mt-0.5">✓</span>
            <span className="flex-1">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Last Updated timestamp component
 */
interface LastUpdatedProps {
  date: string;
  className?: string;
}

export function LastUpdated({ date, className = '' }: LastUpdatedProps) {
  return (
    <div className={`text-sm text-gray-500 flex items-center gap-2 ${className}`}>
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span>Last updated: {date}</span>
    </div>
  );
}
