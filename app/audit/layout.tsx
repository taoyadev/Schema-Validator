import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Batch Schema Audit | Validate Multiple URLs at Once',
  description:
    'Batch validate structured data across multiple pages. Import from sitemap or CSV, validate hundreds of URLs, and export detailed reports in PDF, Excel, or JSON format.',
  keywords:
    'batch schema validator, bulk validation, sitemap audit, multiple url validator, schema audit tool, csv validation, bulk schema check',
  openGraph: {
    title: 'Batch Schema Audit | Validate Multiple URLs at Once',
    description:
      'Batch validate structured data across multiple pages. Import from sitemap or CSV and export detailed reports.',
    type: 'website',
    url: '/audit',
  },
  alternates: {
    canonical: '/audit',
  },
};

export default function AuditLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
