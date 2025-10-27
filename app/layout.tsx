import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/navigation/Header';
import { Footer } from '@/components/navigation/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  metadataBase: new URL('https://www.schemavalidator.com'),
  title: {
    default: 'Schema Markup Validator - Free JSON-LD & Schema.org Validator Tool',
    template: '%s | Schema Validator',
  },
  description:
    'Free schema markup validator for JSON-LD and Schema.org structured data. Validate schema markup for Google Rich Results compliance. Online schema validator tool for SEO professionals.',
  keywords:
    'schema markup validator, schema validator, json ld schema validator, schema org validator, google schema validator, schema validator tool, structured data, JSON-LD, schema.org validator, online json schema validator, schema markup validator tool',
  authors: [{ name: 'Schema Validator Team' }],
  creator: 'Schema Validator',
  publisher: 'Schema Validator',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicons/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  alternates: {
    canonical: 'https://www.schemavalidator.com',
  },
  openGraph: {
    title: 'Schema Markup Validator - Free JSON-LD & Schema.org Validator Tool',
    description:
      'Free schema markup validator for JSON-LD and Schema.org structured data. Validate schema markup for Google Rich Results compliance. Online schema validator tool.',
    url: 'https://www.schemavalidator.com',
    siteName: 'Schema Validator',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/images/og/schema-validator-og.png',
        width: 1200,
        height: 630,
        alt: 'Schema Markup Validator - JSON-LD & Schema.org Validation Tool',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Schema Markup Validator - Free JSON-LD Validator Tool',
    description:
      'Free schema markup validator for JSON-LD and Schema.org. Validate schema markup for Google Rich Results compliance.',
    creator: '@schemavalidator',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Schema Validator',
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0f172a' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Schema Validator',
    alternateName: ['Schema Markup Validator', 'Schema.org Validator', 'JSON-LD Validator'],
    url: 'https://www.schemavalidator.com',
    description:
      'Free online schema markup validator for JSON-LD and Schema.org structured data. Validate schema markup for Google Rich Results compliance. Helping SEO professionals optimize their websites with accurate structured data validation.',
    foundingDate: '2024',
    knowsAbout: [
      'Schema Markup Validation',
      'Structured Data',
      'Schema.org',
      'JSON-LD',
      'SEO',
      'Rich Snippets',
      'Google Rich Results',
      'Schema Markup',
    ],
    areaServed: 'Worldwide',
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
}
