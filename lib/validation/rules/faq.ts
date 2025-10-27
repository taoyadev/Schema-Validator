/**
 * FAQPage Schema Validation Rules
 * https://schema.org/FAQPage
 * https://developers.google.com/search/docs/appearance/structured-data/faqpage
 */

import type { ValidationRule } from '../types';

export const faqPageRules: ValidationRule[] = [
  {
    property: '@context',
    required: true,
    type: 'string',
    seoImpact: 'high',
    errorMessage: '@context must be "https://schema.org"',
    fix: 'Set "@context": "https://schema.org"',
    documentation: 'https://schema.org/FAQPage',
  },
  {
    property: '@type',
    required: true,
    type: 'string',
    seoImpact: 'high',
    errorMessage: '@type must be "FAQPage"',
    fix: 'Set "@type": "FAQPage"',
    documentation: 'https://schema.org/FAQPage',
  },
  {
    property: 'mainEntity',
    required: true,
    type: 'array',
    seoImpact: 'high',
    errorMessage: 'mainEntity is required and must be an array of Question items',
    fix: 'Add "mainEntity": [{"@type": "Question", "name": "...", "acceptedAnswer": {...}}]',
    documentation: 'https://developers.google.com/search/docs/appearance/structured-data/faqpage',
  },
  {
    property: 'mainEntity[].@type',
    required: true,
    type: 'string',
    seoImpact: 'high',
    errorMessage: 'Each item in mainEntity must have @type "Question"',
    fix: 'Set "@type": "Question" for each question',
    documentation: 'https://schema.org/Question',
  },
  {
    property: 'mainEntity[].name',
    required: true,
    type: 'string',
    minLength: 10,
    seoImpact: 'high',
    errorMessage: 'Each question must have a name (the question text)',
    fix: 'Add "name": "Your question text here"',
    documentation: 'https://schema.org/Question',
  },
  {
    property: 'mainEntity[].acceptedAnswer',
    required: true,
    type: 'object',
    seoImpact: 'high',
    errorMessage: 'Each question must have an acceptedAnswer',
    fix: 'Add "acceptedAnswer": {"@type": "Answer", "text": "..."}',
    documentation: 'https://schema.org/Question',
  },
  {
    property: 'mainEntity[].acceptedAnswer.@type',
    required: true,
    type: 'string',
    seoImpact: 'high',
    errorMessage: 'acceptedAnswer must have @type "Answer"',
    fix: 'Set "@type": "Answer"',
    documentation: 'https://schema.org/Answer',
  },
  {
    property: 'mainEntity[].acceptedAnswer.text',
    required: true,
    type: 'string',
    minLength: 10,
    seoImpact: 'high',
    errorMessage: 'Each answer must have text content',
    fix: 'Add "text": "Your answer text here"',
    documentation: 'https://schema.org/Answer',
  },
];
