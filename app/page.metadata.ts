import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Schema Validator - Free Structured Data Testing Tool | 99% Accuracy',
  description:
    'Validate Schema.org structured data with 99%+ accuracy vs Google Rich Results Test. Free validator for Article, Product, Organization, and more. Get instant SEO recommendations.',
  keywords: [
    'schema validator',
    'structured data validator',
    'schema.org validator',
    'JSON-LD validator',
    'rich results test',
    'schema markup validator',
    'SEO schema validator',
    'free schema validator',
    'article schema validator',
    'product schema validator'
  ].join(', '),

  authors: [{ name: 'Schema Validator Team', url: 'https://schema-validator.com' }],

  creator: 'Schema Validator',
  publisher: 'Schema Validator',

  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://schema-validator.com',
    siteName: 'Schema Validator',
    title: 'Schema Validator - Free Structured Data Testing Tool',
    description:
      'Validate your Schema.org structured data with 99%+ accuracy. Free online tool for Article, Product, Organization, and all major schema types. Instant validation and SEO recommendations.',
    images: [
      {
        url: 'https://schema-validator.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Schema Validator - Structured Data Testing Tool'
      }
    ]
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Schema Validator - Free Structured Data Testing Tool',
    description:
      'Validate Schema.org structured data with 99%+ accuracy. Free tool for Article, Product, Organization schemas. Get instant SEO recommendations.',
    images: ['https://schema-validator.com/og-image.png'],
    creator: '@schemavalidator'
  },

  alternates: {
    canonical: 'https://schema-validator.com'
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },

  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code'
  },

  category: 'Technology',

  other: {
    'revisit-after': '7 days'
  }
};
