import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Schema Validator | Professional Structured Data Validation',
  description:
    'Learn about Schema Validator - a professional-grade tool for validating Schema.org structured data and ensuring Google Rich Results compliance. Free, accurate, and privacy-focused.',
  keywords:
    'about schema validator, structured data validation, schema.org validator, google rich results, seo tools, schema markup validator',
  openGraph: {
    title: 'About Schema Validator | Professional Structured Data Validation',
    description:
      'Learn about our professional-grade structured data validation tool. Free, accurate, and privacy-focused Schema.org validator.',
    type: 'website',
    url: '/about',
  },
  alternates: {
    canonical: '/about',
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
