/**
 * Organization Schema Validation Rules
 * Based on Schema.org Organization and Google Knowledge Graph
 */

import { ValidationRule } from '../types';

export const organizationRules: ValidationRule[] = [
  {
    property: 'name',
    required: true,
    type: 'string',
    minLength: 2,
    maxLength: 100,
    seoImpact: 'high',
    errorMessage: 'Organization name is required',
    fix: 'Add "name": "Organization Name"',
    documentation: 'https://schema.org/name',
  },
  {
    property: 'url',
    required: true,
    type: 'string',
    seoImpact: 'high',
    errorMessage: 'Organization URL is required',
    fix: 'Add "url": "https://example.com"',
    documentation: 'https://schema.org/url',
  },
  {
    property: 'logo',
    required: false,
    type: ['string', 'ImageObject'],
    googleRequirement: {
      minWidth: 112,
      minHeight: 112,
    },
    seoImpact: 'high',
    errorMessage:
      'Highly recommended: Include organization logo (min 112x112px) for Google Knowledge Graph',
    fix: 'Add "logo": "https://example.com/logo.png" or "logo": {"@type": "ImageObject", "url": "https://example.com/logo.png"}',
    documentation:
      'https://developers.google.com/search/docs/appearance/structured-data/logo',
  },
  {
    property: 'description',
    required: false,
    type: 'string',
    minLength: 50,
    maxLength: 250,
    seoImpact: 'medium',
    errorMessage:
      'Recommended: Include organization description (50-250 characters)',
    fix: 'Add "description": "Brief description of the organization"',
    documentation: 'https://schema.org/description',
  },
  {
    property: 'sameAs',
    required: false,
    type: 'array',
    seoImpact: 'medium',
    errorMessage:
      'Recommended: Include social media profiles for entity verification',
    fix: 'Add "sameAs": ["https://facebook.com/page", "https://twitter.com/handle", "https://linkedin.com/company/name"]',
    documentation: 'https://schema.org/sameAs',
  },
  {
    property: 'contactPoint',
    required: false,
    type: ['ContactPoint', 'array'],
    nestedRequired: ['telephone', 'contactType'],
    seoImpact: 'low',
    errorMessage: 'Recommended: Include contact information',
    fix: 'Add "contactPoint": {"@type": "ContactPoint", "telephone": "+1-555-1234", "contactType": "customer service"}',
    documentation: 'https://schema.org/contactPoint',
  },
  {
    property: 'address',
    required: false,
    type: 'PostalAddress',
    nestedRequired: ['streetAddress', 'addressLocality', 'addressRegion', 'postalCode'],
    seoImpact: 'low',
    errorMessage: 'Recommended: Include physical address for local businesses',
    fix: 'Add "address": {"@type": "PostalAddress", "streetAddress": "123 Main St", "addressLocality": "City", "addressRegion": "State", "postalCode": "12345", "addressCountry": "US"}',
    documentation: 'https://schema.org/address',
  },
];

/**
 * LocalBusiness extends Organization with additional requirements
 */
export const localBusinessRules: ValidationRule[] = [
  ...organizationRules,
  {
    property: 'address',
    required: true,
    type: 'PostalAddress',
    nestedRequired: ['streetAddress', 'addressLocality', 'postalCode'],
    seoImpact: 'high',
    errorMessage: 'LocalBusiness requires a physical address',
    fix: 'Add "address": {"@type": "PostalAddress", "streetAddress": "123 Main St", "addressLocality": "City", "postalCode": "12345"}',
    documentation:
      'https://developers.google.com/search/docs/appearance/structured-data/local-business',
  },
  {
    property: 'telephone',
    required: false,
    type: 'string',
    seoImpact: 'high',
    errorMessage: 'Highly recommended: Include phone number for local business',
    fix: 'Add "telephone": "+1-555-1234"',
    documentation: 'https://schema.org/telephone',
  },
  {
    property: 'geo',
    required: false,
    type: 'GeoCoordinates',
    nestedRequired: ['latitude', 'longitude'],
    seoImpact: 'medium',
    errorMessage: 'Recommended: Include geographic coordinates for map display',
    fix: 'Add "geo": {"@type": "GeoCoordinates", "latitude": "40.7128", "longitude": "-74.0060"}',
    documentation: 'https://schema.org/geo',
  },
  {
    property: 'openingHoursSpecification',
    required: false,
    type: ['OpeningHoursSpecification', 'array'],
    seoImpact: 'medium',
    errorMessage: 'Recommended: Include opening hours for better local search',
    fix: 'Add "openingHoursSpecification": [{"@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday", "Tuesday"], "opens": "09:00", "closes": "17:00"}]',
    documentation: 'https://schema.org/openingHoursSpecification',
  },
];
