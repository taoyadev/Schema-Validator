/**
 * Schema examples for documentation and testing
 */

export interface SchemaExample {
  type: string;
  title: string;
  description: string;
  code: string;
  valid: boolean;
}

/**
 * Article schema examples
 */
export const articleExamples: SchemaExample[] = [
  {
    type: 'Article',
    title: 'Valid Article Schema',
    description: 'Complete article with all required properties for Google Rich Results',
    valid: true,
    code: `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Complete Guide to Schema.org Article Markup",
  "image": [
    "https://example.com/article-image-1200x675.jpg"
  ],
  "datePublished": "2025-01-15T08:00:00+00:00",
  "dateModified": "2025-01-20T10:30:00+00:00",
  "author": {
    "@type": "Person",
    "name": "Jane Smith",
    "url": "https://example.com/author/jane-smith"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Example Publishing",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "description": "Learn how to properly implement Article schema for better SEO and rich results in Google Search."
}`,
  },
  {
    type: 'Article',
    title: 'Invalid Article - Missing Image',
    description: 'Article missing required image property',
    valid: false,
    code: `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Without Image",
  "datePublished": "2025-01-15T08:00:00+00:00",
  "author": {
    "@type": "Person",
    "name": "John Doe"
  }
}`,
  },
];

/**
 * NewsArticle schema examples
 */
export const newsArticleExamples: SchemaExample[] = [
  {
    type: 'NewsArticle',
    title: 'Valid NewsArticle Schema',
    description: 'NewsArticle with required properties for Google News',
    valid: true,
    code: `{
  "@context": "https://schema.org",
  "@type": "NewsArticle",
  "headline": "Breaking: Major Technology Announcement",
  "image": "https://example.com/news-image-1200x675.jpg",
  "datePublished": "2025-01-26T14:30:00+00:00",
  "dateModified": "2025-01-26T15:00:00+00:00",
  "author": {
    "@type": "Person",
    "name": "Reporter Name"
  },
  "publisher": {
    "@type": "Organization",
    "name": "News Organization",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  }
}`,
  },
];

/**
 * Product schema examples
 */
export const productExamples: SchemaExample[] = [
  {
    type: 'Product',
    title: 'Valid Product Schema with Reviews',
    description: 'Complete product schema with offers and aggregate rating',
    valid: true,
    code: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Premium Wireless Headphones",
  "image": [
    "https://example.com/product-main.jpg",
    "https://example.com/product-side.jpg"
  ],
  "description": "High-quality wireless headphones with noise cancellation",
  "brand": {
    "@type": "Brand",
    "name": "AudioTech"
  },
  "offers": {
    "@type": "Offer",
    "url": "https://example.com/products/headphones",
    "priceCurrency": "USD",
    "price": "299.99",
    "priceValidUntil": "2025-12-31",
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": "Example Store"
    }
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "127"
  }
}`,
  },
  {
    type: 'Product',
    title: 'Invalid Product - Missing Offer',
    description: 'Product without required offer information',
    valid: false,
    code: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Wireless Headphones",
  "description": "Great headphones"
}`,
  },
];

/**
 * Organization schema examples
 */
export const organizationExamples: SchemaExample[] = [
  {
    type: 'Organization',
    title: 'Valid Organization Schema',
    description: 'Complete organization with contact and social profiles',
    valid: true,
    code: `{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Example Corporation",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+1-555-123-4567",
    "contactType": "Customer Service"
  },
  "sameAs": [
    "https://www.facebook.com/example",
    "https://twitter.com/example",
    "https://www.linkedin.com/company/example"
  ]
}`,
  },
];

/**
 * LocalBusiness schema examples
 */
export const localBusinessExamples: SchemaExample[] = [
  {
    type: 'LocalBusiness',
    title: 'Valid LocalBusiness Schema',
    description: 'Complete local business with address, hours, and reviews',
    valid: true,
    code: `{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Downtown Coffee Shop",
  "image": "https://example.com/coffee-shop.jpg",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "123 Main Street",
    "addressLocality": "San Francisco",
    "addressRegion": "CA",
    "postalCode": "94102",
    "addressCountry": "US"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": "37.7749",
    "longitude": "-122.4194"
  },
  "telephone": "+1-555-987-6543",
  "openingHours": "Mo-Fr 07:00-19:00, Sa-Su 08:00-20:00",
  "priceRange": "$$",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.7",
    "reviewCount": "89"
  }
}`,
  },
];

/**
 * BreadcrumbList schema examples
 */
export const breadcrumbExamples: SchemaExample[] = [
  {
    type: 'BreadcrumbList',
    title: 'Valid BreadcrumbList Schema',
    description: 'Properly structured breadcrumb navigation',
    valid: true,
    code: `{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://example.com"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Products",
      "item": "https://example.com/products"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Electronics",
      "item": "https://example.com/products/electronics"
    }
  ]
}`,
  },
];

/**
 * JSON-LD format examples
 */
export const jsonldExamples: SchemaExample[] = [
  {
    type: 'JSON-LD',
    title: 'Valid JSON-LD Syntax',
    description: 'Properly formatted JSON-LD with @context and @type',
    valid: true,
    code: `{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Understanding JSON-LD Format",
  "description": "A comprehensive guide to JSON-LD structured data",
  "image": "https://example.com/image.jpg",
  "datePublished": "2025-01-27T10:00:00+00:00",
  "author": {
    "@type": "Person",
    "name": "Sarah Johnson"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Tech Publisher",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  }
}`,
  },
  {
    type: 'JSON-LD',
    title: 'Multiple Schema Types',
    description: 'Example showing multiple JSON-LD blocks for one page',
    valid: true,
    code: `<!-- Article Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title"
}
</script>

<!-- Organization Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://example.com"
}
</script>

<!-- BreadcrumbList Schema -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [{
    "@type": "ListItem",
    "position": 1,
    "name": "Home",
    "item": "https://example.com"
  }]
}
</script>`,
  },
  {
    type: 'JSON-LD',
    title: 'Invalid JSON-LD - Missing @context',
    description: 'Common error: missing required @context property',
    valid: false,
    code: `{
  "@type": "Article",
  "headline": "Missing Context",
  "description": "This JSON-LD is missing the required @context"
}`,
  },
  {
    type: 'JSON-LD',
    title: 'Invalid JSON-LD - Syntax Error',
    description: 'JSON syntax error: missing comma between properties',
    valid: false,
    code: `{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name"
  "description": "Missing comma above"
}`,
  },
];

/**
 * Get examples for a specific schema type
 */
export function getSchemaExamples(schemaType: string): SchemaExample[] {
  const type = schemaType.toLowerCase();

  const exampleMap: Record<string, SchemaExample[]> = {
    article: articleExamples,
    newsarticle: newsArticleExamples,
    blogposting: articleExamples, // BlogPosting similar to Article
    product: productExamples,
    organization: organizationExamples,
    localbusiness: localBusinessExamples,
    breadcrumb: breadcrumbExamples,
    breadcrumblist: breadcrumbExamples,
    jsonld: jsonldExamples,
    'json-ld': jsonldExamples,
  };

  return exampleMap[type] || [];
}

/**
 * Get all schema types with examples
 */
export function getAllSchemaTypes() {
  return [
    { key: 'article', label: 'Article' },
    { key: 'newsarticle', label: 'NewsArticle' },
    { key: 'blogposting', label: 'BlogPosting' },
    { key: 'product', label: 'Product' },
    { key: 'organization', label: 'Organization' },
    { key: 'localbusiness', label: 'LocalBusiness' },
    { key: 'breadcrumb', label: 'BreadcrumbList' },
  ];
}
