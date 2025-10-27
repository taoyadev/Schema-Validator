/**
 * Schema.org Template Library
 * Pre-configured templates for all supported schema types
 */

export interface SchemaTemplate {
  type: string;
  displayName: string;
  description: string;
  category: 'article' | 'product' | 'organization' | 'navigation' | 'other';
  fields: SchemaField[];
  baseSchema: Record<string, unknown>;
}

export interface SchemaField {
  name: string;
  label: string;
  type: 'text' | 'textarea' | 'url' | 'date' | 'number' | 'select' | 'image' | 'nested';
  required: boolean;
  placeholder?: string;
  helpText?: string;
  options?: string[];
  defaultValue?: unknown;
  nestedFields?: SchemaField[];
}

// Article Template
export const articleTemplate: SchemaTemplate = {
  type: 'Article',
  displayName: 'Article',
  description: 'General article content',
  category: 'article',
  baseSchema: {
    '@context': 'https://schema.org',
    '@type': 'Article',
  },
  fields: [
    {
      name: 'headline',
      label: 'Headline',
      type: 'text',
      required: true,
      placeholder: 'Article headline (10-110 characters)',
      helpText: 'The headline of the article. Keep between 10-110 characters for optimal display.',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      placeholder: 'Brief description of the article',
      helpText: 'A short description or summary of the article content.',
    },
    {
      name: 'image',
      label: 'Image URL',
      type: 'image',
      required: true,
      placeholder: 'https://example.com/image.jpg',
      helpText: 'Minimum 696x400px for Google Rich Results eligibility.',
    },
    {
      name: 'author',
      label: 'Author',
      type: 'nested',
      required: true,
      helpText: 'Information about the article author.',
      nestedFields: [
        {
          name: 'name',
          label: 'Author Name',
          type: 'text',
          required: true,
          placeholder: 'John Doe',
        },
        {
          name: 'url',
          label: 'Author URL',
          type: 'url',
          required: false,
          placeholder: 'https://example.com/author/john-doe',
        },
      ],
    },
    {
      name: 'publisher',
      label: 'Publisher',
      type: 'nested',
      required: true,
      helpText: 'The publisher of the article.',
      nestedFields: [
        {
          name: 'name',
          label: 'Publisher Name',
          type: 'text',
          required: true,
          placeholder: 'Example Publisher',
        },
        {
          name: 'logo',
          label: 'Logo URL',
          type: 'image',
          required: true,
          placeholder: 'https://example.com/logo.jpg',
          helpText: 'Publisher logo as ImageObject.',
        },
      ],
    },
    {
      name: 'datePublished',
      label: 'Date Published',
      type: 'date',
      required: true,
      helpText: 'ISO 8601 format (YYYY-MM-DD)',
    },
    {
      name: 'dateModified',
      label: 'Date Modified',
      type: 'date',
      required: false,
      helpText: 'When the article was last modified.',
    },
  ],
};

// NewsArticle Template
export const newsArticleTemplate: SchemaTemplate = {
  ...articleTemplate,
  type: 'NewsArticle',
  displayName: 'News Article',
  description: 'News article or press release',
  baseSchema: {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
  },
};

// BlogPosting Template
export const blogPostingTemplate: SchemaTemplate = {
  ...articleTemplate,
  type: 'BlogPosting',
  displayName: 'Blog Post',
  description: 'Blog post or blog article',
  baseSchema: {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
  },
};

// Product Template
export const productTemplate: SchemaTemplate = {
  type: 'Product',
  displayName: 'Product',
  description: 'Product with offers and reviews',
  category: 'product',
  baseSchema: {
    '@context': 'https://schema.org',
    '@type': 'Product',
  },
  fields: [
    {
      name: 'name',
      label: 'Product Name',
      type: 'text',
      required: true,
      placeholder: 'Product Name',
      helpText: 'The name of the product.',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      placeholder: 'Product description',
      helpText: 'A description of the product.',
    },
    {
      name: 'image',
      label: 'Product Image URL',
      type: 'image',
      required: true,
      placeholder: 'https://example.com/product.jpg',
      helpText: 'High-quality product image.',
    },
    {
      name: 'brand',
      label: 'Brand Name',
      type: 'text',
      required: false,
      placeholder: 'Brand Name',
    },
    {
      name: 'sku',
      label: 'SKU',
      type: 'text',
      required: false,
      placeholder: 'Product SKU',
      helpText: 'Stock Keeping Unit identifier.',
    },
    {
      name: 'offers',
      label: 'Offer',
      type: 'nested',
      required: true,
      helpText: 'Pricing and availability information.',
      nestedFields: [
        {
          name: 'price',
          label: 'Price',
          type: 'number',
          required: true,
          placeholder: '29.99',
        },
        {
          name: 'priceCurrency',
          label: 'Currency',
          type: 'text',
          required: true,
          placeholder: 'USD',
          defaultValue: 'USD',
        },
        {
          name: 'availability',
          label: 'Availability',
          type: 'select',
          required: true,
          options: [
            'https://schema.org/InStock',
            'https://schema.org/OutOfStock',
            'https://schema.org/PreOrder',
            'https://schema.org/Discontinued',
          ],
          defaultValue: 'https://schema.org/InStock',
        },
        {
          name: 'url',
          label: 'Offer URL',
          type: 'url',
          required: false,
          placeholder: 'https://example.com/product/buy',
        },
      ],
    },
    {
      name: 'aggregateRating',
      label: 'Aggregate Rating',
      type: 'nested',
      required: false,
      helpText: 'Average rating from multiple reviews.',
      nestedFields: [
        {
          name: 'ratingValue',
          label: 'Rating Value',
          type: 'number',
          required: true,
          placeholder: '4.5',
          helpText: 'Rating value (typically 1-5).',
        },
        {
          name: 'reviewCount',
          label: 'Review Count',
          type: 'number',
          required: true,
          placeholder: '100',
          helpText: 'Total number of reviews.',
        },
      ],
    },
  ],
};

// Organization Template
export const organizationTemplate: SchemaTemplate = {
  type: 'Organization',
  displayName: 'Organization',
  description: 'Organization or company',
  category: 'organization',
  baseSchema: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
  },
  fields: [
    {
      name: 'name',
      label: 'Organization Name',
      type: 'text',
      required: true,
      placeholder: 'Company Name',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: false,
      placeholder: 'Organization description',
    },
    {
      name: 'url',
      label: 'Website URL',
      type: 'url',
      required: true,
      placeholder: 'https://example.com',
    },
    {
      name: 'logo',
      label: 'Logo URL',
      type: 'image',
      required: true,
      placeholder: 'https://example.com/logo.png',
    },
    {
      name: 'telephone',
      label: 'Phone Number',
      type: 'text',
      required: false,
      placeholder: '+1-555-555-5555',
    },
    {
      name: 'address',
      label: 'Address',
      type: 'nested',
      required: false,
      nestedFields: [
        {
          name: 'streetAddress',
          label: 'Street Address',
          type: 'text',
          required: false,
          placeholder: '123 Main St',
        },
        {
          name: 'addressLocality',
          label: 'City',
          type: 'text',
          required: false,
          placeholder: 'New York',
        },
        {
          name: 'addressRegion',
          label: 'State/Region',
          type: 'text',
          required: false,
          placeholder: 'NY',
        },
        {
          name: 'postalCode',
          label: 'Postal Code',
          type: 'text',
          required: false,
          placeholder: '10001',
        },
        {
          name: 'addressCountry',
          label: 'Country',
          type: 'text',
          required: false,
          placeholder: 'US',
        },
      ],
    },
  ],
};

// LocalBusiness Template
export const localBusinessTemplate: SchemaTemplate = {
  ...organizationTemplate,
  type: 'LocalBusiness',
  displayName: 'Local Business',
  description: 'Local business with physical location',
  category: 'organization',
  baseSchema: {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
  },
};

// BreadcrumbList Template
export const breadcrumbListTemplate: SchemaTemplate = {
  type: 'BreadcrumbList',
  displayName: 'Breadcrumb List',
  description: 'Navigation breadcrumb trail',
  category: 'navigation',
  baseSchema: {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
  },
  fields: [
    {
      name: 'itemListElement',
      label: 'Breadcrumb Items',
      type: 'nested',
      required: true,
      helpText: 'List of breadcrumb items in order.',
      nestedFields: [
        {
          name: 'name',
          label: 'Item Name',
          type: 'text',
          required: true,
          placeholder: 'Home',
        },
        {
          name: 'item',
          label: 'Item URL',
          type: 'url',
          required: true,
          placeholder: 'https://example.com',
        },
      ],
    },
  ],
};

// FAQPage Template
export const faqPageTemplate: SchemaTemplate = {
  type: 'FAQPage',
  displayName: 'FAQ Page',
  description: 'Frequently Asked Questions page',
  category: 'other',
  baseSchema: {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
  },
  fields: [
    {
      name: 'mainEntity',
      label: 'FAQ Questions',
      type: 'nested',
      required: true,
      helpText: 'List of questions and answers.',
      nestedFields: [
        {
          name: 'name',
          label: 'Question',
          type: 'text',
          required: true,
          placeholder: 'What is Schema.org?',
        },
        {
          name: 'acceptedAnswer',
          label: 'Answer',
          type: 'textarea',
          required: true,
          placeholder: 'Schema.org is...',
        },
      ],
    },
  ],
};

// HowTo Template
export const howToTemplate: SchemaTemplate = {
  type: 'HowTo',
  displayName: 'How-To',
  description: 'Step-by-step instructions',
  category: 'other',
  baseSchema: {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
  },
  fields: [
    {
      name: 'name',
      label: 'How-To Title',
      type: 'text',
      required: true,
      placeholder: 'How to bake a cake',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      placeholder: 'Brief overview of the instructions',
    },
    {
      name: 'image',
      label: 'Image URL',
      type: 'image',
      required: false,
      placeholder: 'https://example.com/image.jpg',
    },
    {
      name: 'totalTime',
      label: 'Total Time',
      type: 'text',
      required: false,
      placeholder: 'PT1H30M',
      helpText: 'ISO 8601 duration format (e.g., PT1H30M = 1 hour 30 minutes)',
    },
    {
      name: 'step',
      label: 'Steps',
      type: 'nested',
      required: true,
      helpText: 'List of steps in order.',
      nestedFields: [
        {
          name: 'name',
          label: 'Step Name',
          type: 'text',
          required: true,
          placeholder: 'Step 1: Preheat oven',
        },
        {
          name: 'text',
          label: 'Step Instructions',
          type: 'textarea',
          required: true,
          placeholder: 'Detailed instructions for this step',
        },
        {
          name: 'url',
          label: 'Step URL',
          type: 'url',
          required: false,
          placeholder: 'https://example.com/step-1',
        },
      ],
    },
  ],
};

// Recipe Template
export const recipeTemplate: SchemaTemplate = {
  type: 'Recipe',
  displayName: 'Recipe',
  description: 'Cooking recipe with ingredients and instructions',
  category: 'other',
  baseSchema: {
    '@context': 'https://schema.org',
    '@type': 'Recipe',
  },
  fields: [
    {
      name: 'name',
      label: 'Recipe Name',
      type: 'text',
      required: true,
      placeholder: 'Chocolate Chip Cookies',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      placeholder: 'Delicious homemade chocolate chip cookies',
    },
    {
      name: 'image',
      label: 'Image URL',
      type: 'image',
      required: true,
      placeholder: 'https://example.com/cookies.jpg',
    },
    {
      name: 'author',
      label: 'Author Name',
      type: 'text',
      required: true,
      placeholder: 'Chef John',
    },
    {
      name: 'prepTime',
      label: 'Prep Time',
      type: 'text',
      required: false,
      placeholder: 'PT15M',
      helpText: 'ISO 8601 duration (e.g., PT15M = 15 minutes)',
    },
    {
      name: 'cookTime',
      label: 'Cook Time',
      type: 'text',
      required: false,
      placeholder: 'PT30M',
      helpText: 'ISO 8601 duration (e.g., PT30M = 30 minutes)',
    },
    {
      name: 'recipeYield',
      label: 'Yield',
      type: 'text',
      required: false,
      placeholder: '24 cookies',
    },
    {
      name: 'recipeIngredient',
      label: 'Ingredients',
      type: 'textarea',
      required: true,
      placeholder: '2 cups flour\n1 cup sugar\n...',
      helpText: 'One ingredient per line',
    },
    {
      name: 'recipeInstructions',
      label: 'Instructions',
      type: 'textarea',
      required: true,
      placeholder: 'Step-by-step cooking instructions',
    },
  ],
};

// Event Template
export const eventTemplate: SchemaTemplate = {
  type: 'Event',
  displayName: 'Event',
  description: 'Event or happening',
  category: 'other',
  baseSchema: {
    '@context': 'https://schema.org',
    '@type': 'Event',
  },
  fields: [
    {
      name: 'name',
      label: 'Event Name',
      type: 'text',
      required: true,
      placeholder: 'Tech Conference 2024',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      placeholder: 'Event description',
    },
    {
      name: 'startDate',
      label: 'Start Date',
      type: 'date',
      required: true,
      helpText: 'ISO 8601 format',
    },
    {
      name: 'endDate',
      label: 'End Date',
      type: 'date',
      required: false,
      helpText: 'ISO 8601 format',
    },
    {
      name: 'location',
      label: 'Location',
      type: 'nested',
      required: true,
      nestedFields: [
        {
          name: 'name',
          label: 'Venue Name',
          type: 'text',
          required: true,
          placeholder: 'Convention Center',
        },
        {
          name: 'address',
          label: 'Address',
          type: 'text',
          required: true,
          placeholder: '123 Main St, City, State',
        },
      ],
    },
    {
      name: 'organizer',
      label: 'Organizer Name',
      type: 'text',
      required: false,
      placeholder: 'Event Organizer Inc.',
    },
  ],
};

// JobPosting Template
export const jobPostingTemplate: SchemaTemplate = {
  type: 'JobPosting',
  displayName: 'Job Posting',
  description: 'Job listing or employment opportunity',
  category: 'other',
  baseSchema: {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
  },
  fields: [
    {
      name: 'title',
      label: 'Job Title',
      type: 'text',
      required: true,
      placeholder: 'Senior Software Engineer',
    },
    {
      name: 'description',
      label: 'Job Description',
      type: 'textarea',
      required: true,
      placeholder: 'Detailed job description...',
    },
    {
      name: 'hiringOrganization',
      label: 'Company Name',
      type: 'text',
      required: true,
      placeholder: 'Acme Corp',
    },
    {
      name: 'datePosted',
      label: 'Date Posted',
      type: 'date',
      required: true,
      helpText: 'ISO 8601 format',
    },
    {
      name: 'validThrough',
      label: 'Valid Through',
      type: 'date',
      required: false,
      helpText: 'When the job posting expires',
    },
    {
      name: 'employmentType',
      label: 'Employment Type',
      type: 'select',
      required: true,
      options: ['FULL_TIME', 'PART_TIME', 'CONTRACTOR', 'TEMPORARY', 'INTERN', 'VOLUNTEER', 'PER_DIEM', 'OTHER'],
      defaultValue: 'FULL_TIME',
    },
    {
      name: 'jobLocation',
      label: 'Job Location',
      type: 'nested',
      required: true,
      nestedFields: [
        {
          name: 'addressLocality',
          label: 'City',
          type: 'text',
          required: true,
          placeholder: 'San Francisco',
        },
        {
          name: 'addressRegion',
          label: 'State/Region',
          type: 'text',
          required: true,
          placeholder: 'CA',
        },
        {
          name: 'addressCountry',
          label: 'Country',
          type: 'text',
          required: true,
          placeholder: 'US',
        },
      ],
    },
  ],
};

// VideoObject Template
export const videoObjectTemplate: SchemaTemplate = {
  type: 'VideoObject',
  displayName: 'Video',
  description: 'Video content',
  category: 'other',
  baseSchema: {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
  },
  fields: [
    {
      name: 'name',
      label: 'Video Title',
      type: 'text',
      required: true,
      placeholder: 'How to Build a Website',
    },
    {
      name: 'description',
      label: 'Description',
      type: 'textarea',
      required: true,
      placeholder: 'Video description',
    },
    {
      name: 'thumbnailUrl',
      label: 'Thumbnail URL',
      type: 'image',
      required: true,
      placeholder: 'https://example.com/thumbnail.jpg',
      helpText: 'Video thumbnail image',
    },
    {
      name: 'uploadDate',
      label: 'Upload Date',
      type: 'date',
      required: true,
      helpText: 'ISO 8601 format',
    },
    {
      name: 'duration',
      label: 'Duration',
      type: 'text',
      required: false,
      placeholder: 'PT10M30S',
      helpText: 'ISO 8601 duration (e.g., PT10M30S = 10 minutes 30 seconds)',
    },
    {
      name: 'contentUrl',
      label: 'Content URL',
      type: 'url',
      required: true,
      placeholder: 'https://example.com/video.mp4',
      helpText: 'Direct link to video file',
    },
  ],
};

// Template Registry
export const schemaTemplates: Record<string, SchemaTemplate> = {
  Article: articleTemplate,
  NewsArticle: newsArticleTemplate,
  BlogPosting: blogPostingTemplate,
  Product: productTemplate,
  Organization: organizationTemplate,
  LocalBusiness: localBusinessTemplate,
  BreadcrumbList: breadcrumbListTemplate,
  FAQPage: faqPageTemplate,
  HowTo: howToTemplate,
  Recipe: recipeTemplate,
  Event: eventTemplate,
  JobPosting: jobPostingTemplate,
  VideoObject: videoObjectTemplate,
};

// Get template by type
export function getTemplate(type: string): SchemaTemplate | undefined {
  return schemaTemplates[type];
}

// Get all templates by category
export function getTemplatesByCategory(category: SchemaTemplate['category']): SchemaTemplate[] {
  return Object.values(schemaTemplates).filter((template) => template.category === category);
}

// Get all template types
export function getAllTemplateTypes(): string[] {
  return Object.keys(schemaTemplates);
}
