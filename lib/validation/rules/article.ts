/**
 * Article Schema Validation Rules
 * Based on Schema.org Article and Google Rich Results requirements
 */

import { ValidationRule } from '../types';

export const articleRules: ValidationRule[] = [
  {
    property: 'headline',
    required: true,
    type: 'string',
    minLength: 10,
    maxLength: 110,
    seoImpact: 'high',
    errorMessage:
      'Article headline is required and should be between 10-110 characters for optimal display in search results',
    fix: 'Add "headline": "Your Article Title Here (10-110 characters)"',
    documentation:
      'https://developers.google.com/search/docs/appearance/structured-data/article',
  },
  {
    property: 'image',
    required: true,
    type: ['string', 'ImageObject', 'array'],
    googleRequirement: {
      minWidth: 696,
      minHeight: 400,
    },
    seoImpact: 'high',
    errorMessage:
      'Article must have at least one image with minimum dimensions of 696x400px for Google Rich Results',
    fix: 'Add "image": ["https://example.com/image.jpg"] or "image": {"@type": "ImageObject", "url": "https://example.com/image.jpg", "width": 1200, "height": 800}',
    documentation:
      'https://developers.google.com/search/docs/appearance/structured-data/article#image',
  },
  {
    property: 'datePublished',
    required: true,
    type: 'string',
    format: 'ISO8601',
    pattern:
      /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/,
    seoImpact: 'high',
    errorMessage:
      'Article requires a publication date in ISO 8601 format for Google Rich Results eligibility',
    fix: 'Add "datePublished": "2025-10-26T10:00:00Z" (use ISO 8601 format)',
    documentation:
      'https://developers.google.com/search/docs/appearance/structured-data/article#date',
  },
  {
    property: 'author',
    required: true,
    type: ['Person', 'Organization'],
    nestedRequired: ['name'],
    seoImpact: 'high',
    errorMessage:
      'Article must have an author (Person or Organization) with a name property',
    fix: 'Add "author": {"@type": "Person", "name": "Author Name"} or "author": [{"@type": "Person", "name": "Author Name"}]',
    documentation:
      'https://developers.google.com/search/docs/appearance/structured-data/article#author',
  },
  {
    property: 'dateModified',
    required: false,
    type: 'string',
    format: 'ISO8601',
    pattern:
      /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/,
    seoImpact: 'medium',
    errorMessage:
      'Recommended: Include dateModified to indicate when the article was last updated',
    fix: 'Add "dateModified": "2025-10-26T10:00:00Z" (use ISO 8601 format)',
    documentation:
      'https://developers.google.com/search/docs/appearance/structured-data/article#date',
  },
  {
    property: 'publisher',
    required: false,
    type: 'Organization',
    nestedRequired: ['name', 'logo'],
    seoImpact: 'medium',
    errorMessage:
      'Recommended: Include publisher information (Organization with name and logo) for better trust signals',
    fix: 'Add "publisher": {"@type": "Organization", "name": "Publisher Name", "logo": {"@type": "ImageObject", "url": "https://example.com/logo.png"}}',
    documentation:
      'https://developers.google.com/search/docs/appearance/structured-data/article#publisher',
  },
  {
    property: 'description',
    required: false,
    type: 'string',
    minLength: 50,
    maxLength: 160,
    seoImpact: 'medium',
    errorMessage:
      'Recommended: Include a description (50-160 characters) for better search result display',
    fix: 'Add "description": "Brief summary of the article content (50-160 characters)"',
    documentation: 'https://schema.org/description',
  },
  {
    property: 'mainEntityOfPage',
    required: false,
    type: ['string', 'WebPage'],
    seoImpact: 'low',
    errorMessage:
      'Recommended: Specify the canonical URL of the article page',
    fix: 'Add "mainEntityOfPage": "https://example.com/article" or "mainEntityOfPage": {"@type": "WebPage", "@id": "https://example.com/article"}',
    documentation: 'https://schema.org/mainEntityOfPage',
  },
];

/**
 * NewsArticle and BlogPosting inherit from Article
 * Additional specific rules for these subtypes
 */
export const newsArticleRules: ValidationRule[] = [
  ...articleRules,
  {
    property: 'articleSection',
    required: false,
    type: ['string', 'array'],
    seoImpact: 'low',
    errorMessage:
      'Recommended for NewsArticle: Include article section/category',
    fix: 'Add "articleSection": "Technology" or "articleSection": ["Technology", "Innovation"]',
    documentation: 'https://schema.org/articleSection',
  },
];

export const blogPostingRules: ValidationRule[] = [
  ...articleRules,
  {
    property: 'wordCount',
    required: false,
    type: 'number',
    seoImpact: 'low',
    errorMessage: 'Recommended for BlogPosting: Include word count',
    fix: 'Add "wordCount": 1500',
    documentation: 'https://schema.org/wordCount',
  },
];
