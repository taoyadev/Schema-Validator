/**
 * Central export for all validation rules
 */

import { articleRules, newsArticleRules, blogPostingRules } from './article';
import { productRules, aggregateRatingRules, offerRules } from './product';
import { organizationRules, localBusinessRules } from './organization';
import { breadcrumbListRules, breadcrumbItemRules } from './breadcrumb';
import { ValidationRule } from '../types';

/**
 * Map of schema types to their validation rules
 */
export const schemaRulesMap: Record<string, ValidationRule[]> = {
  // Article types
  Article: articleRules,
  NewsArticle: newsArticleRules,
  BlogPosting: blogPostingRules,

  // Product types
  Product: productRules,
  AggregateRating: aggregateRatingRules,
  Offer: offerRules,

  // Organization types
  Organization: organizationRules,
  LocalBusiness: localBusinessRules,

  // Navigation
  BreadcrumbList: breadcrumbListRules,
  ListItem: breadcrumbItemRules,
};

/**
 * Get validation rules for a specific schema type
 */
export function getRulesForSchemaType(schemaType: string): ValidationRule[] {
  return schemaRulesMap[schemaType] || [];
}

/**
 * Check if a schema type is supported
 */
export function isSchemaTypeSupported(schemaType: string): boolean {
  return schemaType in schemaRulesMap;
}

/**
 * Get all supported schema types
 */
export function getSupportedSchemaTypes(): string[] {
  return Object.keys(schemaRulesMap);
}

/**
 * Export all rule sets for direct import
 */
export {
  articleRules,
  newsArticleRules,
  blogPostingRules,
  productRules,
  aggregateRatingRules,
  offerRules,
  organizationRules,
  localBusinessRules,
  breadcrumbListRules,
  breadcrumbItemRules,
};
