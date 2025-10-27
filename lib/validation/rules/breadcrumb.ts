/**
 * BreadcrumbList Schema Validation Rules
 * Based on Schema.org BreadcrumbList and Google Rich Results
 */

import { ValidationRule } from '../types';

export const breadcrumbListRules: ValidationRule[] = [
  {
    property: 'itemListElement',
    required: true,
    type: 'array',
    seoImpact: 'high',
    errorMessage:
      'BreadcrumbList requires itemListElement array with at least 2 items',
    fix: 'Add "itemListElement": [{"@type": "ListItem", "position": 1, "name": "Home", "item": "https://example.com"}, {"@type": "ListItem", "position": 2, "name": "Category", "item": "https://example.com/category"}]',
    documentation:
      'https://developers.google.com/search/docs/appearance/structured-data/breadcrumb',
  },
];

/**
 * ListItem validation (for breadcrumb items)
 */
export const breadcrumbItemRules: ValidationRule[] = [
  {
    property: 'position',
    required: true,
    type: 'number',
    seoImpact: 'high',
    errorMessage:
      'Each breadcrumb ListItem requires a position (starting from 1)',
    fix: 'Add "position": 1 (increment for each item)',
    documentation: 'https://schema.org/position',
  },
  {
    property: 'name',
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 100,
    seoImpact: 'high',
    errorMessage: 'Each breadcrumb ListItem requires a name (display text)',
    fix: 'Add "name": "Page Name"',
    documentation: 'https://schema.org/name',
  },
  {
    property: 'item',
    required: false, // Last item can omit this
    type: 'string',
    seoImpact: 'medium',
    errorMessage:
      'Recommended: Include item URL for all breadcrumb items except the last',
    fix: 'Add "item": "https://example.com/page"',
    documentation: 'https://schema.org/item',
  },
];
