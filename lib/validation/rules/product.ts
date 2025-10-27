/**
 * Product Schema Validation Rules
 * Based on Schema.org Product and Google Rich Results requirements
 */

import { ValidationRule } from '../types';

export const productRules: ValidationRule[] = [
  {
    property: 'name',
    required: true,
    type: 'string',
    minLength: 3,
    maxLength: 150,
    seoImpact: 'high',
    errorMessage:
      'Product name is required and should be concise (3-150 characters)',
    fix: 'Add "name": "Product Name"',
    documentation:
      'https://developers.google.com/search/docs/appearance/structured-data/product',
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
      'Product must have at least one image with minimum dimensions of 696x400px',
    fix: 'Add "image": ["https://example.com/product-image.jpg"]',
    documentation:
      'https://developers.google.com/search/docs/appearance/structured-data/product#image',
  },
  {
    property: 'offers',
    required: true,
    type: ['Offer', 'AggregateOffer', 'array'],
    nestedRequired: ['price', 'priceCurrency'],
    seoImpact: 'high',
    errorMessage:
      'Product requires offers information with price and currency',
    fix: 'Add "offers": {"@type": "Offer", "price": "29.99", "priceCurrency": "USD", "availability": "https://schema.org/InStock"}',
    documentation:
      'https://developers.google.com/search/docs/appearance/structured-data/product#offers',
  },
  {
    property: 'description',
    required: false,
    type: 'string',
    minLength: 50,
    maxLength: 500,
    seoImpact: 'medium',
    errorMessage:
      'Recommended: Include a detailed product description (50-500 characters)',
    fix: 'Add "description": "Detailed product description here"',
    documentation: 'https://schema.org/description',
  },
  {
    property: 'brand',
    required: false,
    type: ['Brand', 'Organization'],
    nestedRequired: ['name'],
    seoImpact: 'medium',
    errorMessage: 'Recommended: Include brand information',
    fix: 'Add "brand": {"@type": "Brand", "name": "Brand Name"}',
    documentation: 'https://schema.org/brand',
  },
  {
    property: 'aggregateRating',
    required: false,
    type: 'AggregateRating',
    nestedRequired: ['ratingValue', 'reviewCount'],
    seoImpact: 'high',
    errorMessage:
      'Highly recommended: Include aggregate rating for star display in search results',
    fix: 'Add "aggregateRating": {"@type": "AggregateRating", "ratingValue": "4.5", "reviewCount": "125"}',
    documentation:
      'https://developers.google.com/search/docs/appearance/structured-data/product#aggregaterating',
  },
  {
    property: 'review',
    required: false,
    type: ['Review', 'array'],
    nestedRequired: ['author', 'reviewRating'],
    seoImpact: 'medium',
    errorMessage: 'Recommended: Include customer reviews',
    fix: 'Add "review": [{"@type": "Review", "author": {"@type": "Person", "name": "Reviewer Name"}, "reviewRating": {"@type": "Rating", "ratingValue": "5"}}]',
    documentation:
      'https://developers.google.com/search/docs/appearance/structured-data/product#review',
  },
  {
    property: 'sku',
    required: false,
    type: 'string',
    seoImpact: 'low',
    errorMessage: 'Recommended: Include SKU for product identification',
    fix: 'Add "sku": "SKU-12345"',
    documentation: 'https://schema.org/sku',
  },
  {
    property: 'gtin',
    required: false,
    type: 'string',
    seoImpact: 'low',
    errorMessage:
      'Recommended: Include GTIN (UPC, EAN, ISBN) for product identification',
    fix: 'Add "gtin": "1234567890123" or "gtin13", "gtin12", "gtin8", "isbn"',
    documentation: 'https://schema.org/gtin',
  },
];

/**
 * AggregateRating validation (nested in Product)
 */
export const aggregateRatingRules: ValidationRule[] = [
  {
    property: 'ratingValue',
    required: true,
    type: 'number',
    seoImpact: 'high',
    errorMessage: 'AggregateRating requires a ratingValue (e.g., 4.5)',
    fix: 'Add "ratingValue": "4.5"',
    documentation: 'https://schema.org/ratingValue',
  },
  {
    property: 'reviewCount',
    required: true,
    type: 'number',
    seoImpact: 'high',
    errorMessage:
      'AggregateRating requires reviewCount (number of reviews)',
    fix: 'Add "reviewCount": "125"',
    documentation: 'https://schema.org/reviewCount',
  },
  {
    property: 'bestRating',
    required: false,
    type: 'number',
    seoImpact: 'low',
    errorMessage:
      'Recommended: Specify the best possible rating (default is 5)',
    fix: 'Add "bestRating": "5"',
    documentation: 'https://schema.org/bestRating',
  },
  {
    property: 'worstRating',
    required: false,
    type: 'number',
    seoImpact: 'low',
    errorMessage:
      'Recommended: Specify the worst possible rating (default is 1)',
    fix: 'Add "worstRating": "1"',
    documentation: 'https://schema.org/worstRating',
  },
];

/**
 * Offer validation (nested in Product)
 */
export const offerRules: ValidationRule[] = [
  {
    property: 'price',
    required: true,
    type: ['string', 'number'],
    seoImpact: 'high',
    errorMessage: 'Offer requires a price',
    fix: 'Add "price": "29.99"',
    documentation: 'https://schema.org/price',
  },
  {
    property: 'priceCurrency',
    required: true,
    type: 'string',
    pattern: /^[A-Z]{3}$/,
    seoImpact: 'high',
    errorMessage: 'Offer requires priceCurrency in ISO 4217 format (e.g., USD)',
    fix: 'Add "priceCurrency": "USD"',
    documentation: 'https://schema.org/priceCurrency',
  },
  {
    property: 'availability',
    required: false,
    type: 'string',
    enum: [
      'https://schema.org/InStock',
      'https://schema.org/OutOfStock',
      'https://schema.org/PreOrder',
      'https://schema.org/BackOrder',
      'https://schema.org/Discontinued',
      'https://schema.org/LimitedAvailability',
      'https://schema.org/OnlineOnly',
      'https://schema.org/SoldOut',
    ],
    seoImpact: 'medium',
    errorMessage: 'Recommended: Specify product availability status',
    fix: 'Add "availability": "https://schema.org/InStock"',
    documentation: 'https://schema.org/availability',
  },
  {
    property: 'url',
    required: false,
    type: 'string',
    seoImpact: 'low',
    errorMessage: 'Recommended: Include the URL where the product can be purchased',
    fix: 'Add "url": "https://example.com/product-page"',
    documentation: 'https://schema.org/url',
  },
];
