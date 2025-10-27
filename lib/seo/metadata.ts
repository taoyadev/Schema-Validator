import { Metadata } from 'next';

/**
 * Schema type metadata configuration
 */
export interface SchemaTypeMetadata {
  title: string;
  description: string;
  keywords: string[];
  heading: string;
  subheading: string;
  canonical: string;
}

/**
 * Metadata for each schema type
 */
export const schemaTypeMetadata: Record<string, SchemaTypeMetadata> = {
  article: {
    title: 'Article Schema Markup Validator | JSON-LD Article Validator',
    description:
      'Free Article schema markup validator for JSON-LD and Schema.org. Validate Article, NewsArticle, and BlogPosting schema markup for Google Rich Results compliance with instant feedback.',
    keywords: [
      'article schema markup validator',
      'article schema validator',
      'article json-ld validator',
      'schema.org article validator',
      'news article schema',
      'blog posting schema',
      'article json-ld',
      'google rich results article',
      'schema markup validator article',
    ],
    heading: 'Article Schema Markup Validator',
    subheading:
      'Validate Article, NewsArticle, and BlogPosting schema markup (JSON-LD) for Google Rich Results compliance',
    canonical: '/validate/article',
  },
  newsarticle: {
    title: 'NewsArticle Schema Validator | News Structured Data Validation',
    description:
      'Validate NewsArticle schema for Google News and Top Stories rich results. Ensure your news content meets all required properties and SEO best practices.',
    keywords: [
      'newsarticle schema',
      'news schema validator',
      'google news structured data',
      'top stories rich results',
      'news json-ld',
    ],
    heading: 'NewsArticle Schema Validator',
    subheading:
      'Validate NewsArticle structured data for Google News and Top Stories eligibility',
    canonical: '/validate/article/news',
  },
  blogposting: {
    title: 'BlogPosting Schema Validator | Blog Structured Data Validation',
    description:
      'Free BlogPosting schema validator for blog content. Verify your blog posts have proper structured data for enhanced search results and better SEO.',
    keywords: [
      'blogposting schema',
      'blog schema validator',
      'blog structured data',
      'blog json-ld',
      'blog seo schema',
    ],
    heading: 'BlogPosting Schema Validator',
    subheading:
      'Validate BlogPosting structured data for enhanced blog search results',
    canonical: '/validate/article/blog',
  },
  product: {
    title: 'Product Schema Markup Validator | JSON-LD Product Validator Tool',
    description:
      'Free Product schema markup validator for JSON-LD and Schema.org. Validate Product schema markup for Google Shopping and rich results. Check reviews, offers, pricing, and availability with our online validator tool.',
    keywords: [
      'product schema markup validator',
      'product schema validator',
      'product json-ld validator',
      'schema.org product validator',
      'product structured data',
      'product rich snippets',
      'google shopping schema',
      'ecommerce schema validator',
      'product json-ld',
      'schema markup validator product',
    ],
    heading: 'Product Schema Markup Validator',
    subheading:
      'Validate Product schema markup (JSON-LD) for Google Shopping and rich snippets',
    canonical: '/validate/product',
  },
  offer: {
    title: 'Offer Schema Validator | Validate Product Offers',
    description:
      'Validate Offer schema for e-commerce products. Ensure pricing, availability, and merchant information meets Google requirements for product rich results.',
    keywords: [
      'offer schema',
      'price schema validator',
      'product offer validation',
      'ecommerce pricing schema',
    ],
    heading: 'Offer Schema Validator',
    subheading: 'Validate Offer structured data for product pricing and availability',
    canonical: '/validate/product/offer',
  },
  aggregaterating: {
    title: 'AggregateRating Schema Validator | Review Stars Validation',
    description:
      'Validate AggregateRating schema for review stars in search results. Ensure your product reviews and ratings display properly in Google rich snippets.',
    keywords: [
      'aggregaterating schema',
      'review schema validator',
      'star rating schema',
      'product review validation',
      'rating snippet',
    ],
    heading: 'AggregateRating Schema Validator',
    subheading: 'Validate review ratings for star display in search results',
    canonical: '/validate/product/reviews',
  },
  organization: {
    title: 'Organization Schema Markup Validator | JSON-LD Organization Validator',
    description:
      'Free Organization schema markup validator for JSON-LD and Schema.org. Validate Organization schema markup for Google Knowledge Graph. Verify company name, logo, social profiles, and contact details with our online validator.',
    keywords: [
      'organization schema markup validator',
      'organization schema validator',
      'organization json-ld validator',
      'schema.org organization validator',
      'company schema',
      'business structured data',
      'knowledge graph schema',
      'organization json-ld',
      'schema markup validator organization',
    ],
    heading: 'Organization Schema Markup Validator',
    subheading:
      'Validate Organization schema markup (JSON-LD) for Knowledge Graph and business listings',
    canonical: '/validate/organization',
  },
  localbusiness: {
    title: 'LocalBusiness Schema Validator | Local SEO Schema Validation',
    description:
      'Validate LocalBusiness schema for local search and Google Maps. Verify hours, location, contact info, and reviews for better local SEO.',
    keywords: [
      'localbusiness schema',
      'local seo schema',
      'google maps schema',
      'local business validation',
      'nap schema',
    ],
    heading: 'LocalBusiness Schema Validator',
    subheading:
      'Validate LocalBusiness structured data for Google Maps and local search',
    canonical: '/validate/organization/local-business',
  },
  breadcrumb: {
    title: 'BreadcrumbList Schema Markup Validator | JSON-LD Breadcrumb Validator',
    description:
      'Free BreadcrumbList schema markup validator for JSON-LD and Schema.org. Validate breadcrumb schema markup for Google search results. Ensure proper site hierarchy display in search snippets.',
    keywords: [
      'breadcrumb schema markup validator',
      'breadcrumblist schema validator',
      'breadcrumb json-ld validator',
      'schema.org breadcrumb validator',
      'breadcrumb structured data',
      'site navigation schema',
      'schema markup validator breadcrumb',
    ],
    heading: 'BreadcrumbList Schema Markup Validator',
    subheading:
      'Validate BreadcrumbList schema markup (JSON-LD) for search results',
    canonical: '/validate/breadcrumb',
  },
  jsonld: {
    title: 'JSON-LD Validator - Schema.org Structured Data Validation Tool',
    description:
      'Free JSON-LD schema validator for Schema.org structured data. Validate JSON-LD markup for Google Rich Results compliance. Online JSON-LD validator tool with instant feedback for SEO professionals.',
    keywords: [
      'json ld schema validator',
      'json-ld validator',
      'json ld validator tool',
      'schema.org json-ld validator',
      'json ld structured data',
      'json-ld markup validator',
      'validate json-ld',
      'json-ld format validator',
      'schema markup json-ld',
    ],
    heading: 'JSON-LD Schema Validator',
    subheading:
      'Validate JSON-LD structured data for Schema.org and Google Rich Results',
    canonical: '/json-ld-validator',
  },
};

/**
 * Generate Next.js metadata for a schema type page
 */
export function generateSchemaTypeMetadata(schemaType: string): Metadata {
  const metadata = schemaTypeMetadata[schemaType.toLowerCase()];

  if (!metadata) {
    return {
      title: 'Schema Validator',
      description: 'Validate your structured data',
    };
  }

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords.join(', '),
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      type: 'website',
      url: metadata.canonical,
      images: [
        {
          url: `/images/og/${schemaType.toLowerCase()}-og.png`,
          width: 1200,
          height: 630,
          alt: `${metadata.heading} - Schema Validator`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: [`/images/og/${schemaType.toLowerCase()}-og.png`],
    },
    alternates: {
      canonical: metadata.canonical,
    },
  };
}

/**
 * Get schema type display information
 */
export function getSchemaTypeInfo(schemaType: string) {
  const metadata = schemaTypeMetadata[schemaType.toLowerCase()];
  return metadata || null;
}
