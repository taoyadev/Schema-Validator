/**
 * Schema Generator
 * Converts form data into valid JSON-LD schemas
 */

import type { SchemaTemplate, SchemaField } from './templates';

export type FormData = Record<string, unknown>;

/**
 * Generate a complete JSON-LD schema from form data
 */
export function generateSchema(template: SchemaTemplate, formData: FormData): Record<string, unknown> {
  const schema = { ...template.baseSchema };

  // Process each field from the template
  template.fields.forEach((field) => {
    const value = processField(field, formData[field.name]);
    if (value !== undefined && value !== null && value !== '') {
      schema[field.name] = value;
    }
  });

  return schema;
}

/**
 * Process a single field value based on its type
 */
function processField(field: SchemaField, value: unknown): unknown {
  if (value === undefined || value === null || value === '') {
    return field.required ? field.defaultValue : undefined;
  }

  switch (field.type) {
    case 'text':
    case 'url':
      return String(value).trim();

    case 'textarea':
      // Check if this is a multi-line field like ingredients/instructions
      if (field.name === 'recipeIngredient') {
        return String(value)
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
      }
      return String(value).trim();

    case 'number':
      return typeof value === 'number' ? value : parseFloat(String(value));

    case 'date':
      // Ensure ISO 8601 format
      if (value instanceof Date) {
        return value.toISOString();
      }
      return String(value);

    case 'select':
      return String(value);

    case 'image':
      // Can return either string URL or ImageObject
      const imageUrl = String(value).trim();
      if (!imageUrl) return undefined;

      // For certain schema types, wrap in ImageObject
      if (field.name === 'logo' || (field.name === 'image' && field.helpText?.includes('ImageObject'))) {
        return {
          '@type': 'ImageObject',
          url: imageUrl,
        };
      }
      return imageUrl;

    case 'nested':
      return processNestedField(field, value);

    default:
      return value;
  }
}

/**
 * Process nested object or array fields
 */
function processNestedField(field: SchemaField, value: unknown): unknown {
  if (!value) return undefined;

  // Handle special nested types
  if (field.name === 'author' || field.name === 'publisher') {
    return processPersonOrganization(value as FormData);
  }

  if (field.name === 'offers' || field.name === 'offer') {
    return processOffer(value as FormData);
  }

  if (field.name === 'aggregateRating') {
    return processAggregateRating(value as FormData);
  }

  if (field.name === 'address') {
    return processAddress(value as FormData);
  }

  if (field.name === 'location') {
    return processLocation(value as FormData);
  }

  if (field.name === 'jobLocation') {
    return processJobLocation(value as FormData);
  }

  if (field.name === 'hiringOrganization') {
    return processHiringOrganization(value);
  }

  if (field.name === 'itemListElement') {
    return processBreadcrumbList(value as FormData[]);
  }

  if (field.name === 'mainEntity') {
    return processFAQList(value as FormData[]);
  }

  if (field.name === 'step') {
    return processHowToSteps(value as FormData[]);
  }

  // Generic nested object
  if (Array.isArray(value)) {
    return value.map((item) => processGenericNested(field, item as FormData));
  }

  return processGenericNested(field, value as FormData);
}

/**
 * Process Person or Organization (for author/publisher)
 */
function processPersonOrganization(data: FormData): Record<string, unknown> {
  const result: Record<string, unknown> = {
    '@type': data.name && !data.logo ? 'Person' : 'Organization',
  };

  if (data.name) result.name = String(data.name);
  if (data.url) result.url = String(data.url);

  if (data.logo) {
    result.logo = {
      '@type': 'ImageObject',
      url: String(data.logo),
    };
  }

  return result;
}

/**
 * Process Offer
 */
function processOffer(data: FormData): Record<string, unknown> {
  const offer: Record<string, unknown> = {
    '@type': 'Offer',
  };

  if (data.price !== undefined) offer.price = String(data.price);
  if (data.priceCurrency) offer.priceCurrency = String(data.priceCurrency);
  if (data.availability) offer.availability = String(data.availability);
  if (data.url) offer.url = String(data.url);

  return offer;
}

/**
 * Process AggregateRating
 */
function processAggregateRating(data: FormData): Record<string, unknown> | undefined {
  if (!data.ratingValue && !data.reviewCount) return undefined;

  const rating: Record<string, unknown> = {
    '@type': 'AggregateRating',
  };

  if (data.ratingValue !== undefined) {
    rating.ratingValue = typeof data.ratingValue === 'number'
      ? data.ratingValue
      : parseFloat(String(data.ratingValue));
  }
  if (data.reviewCount !== undefined) {
    rating.reviewCount = typeof data.reviewCount === 'number'
      ? data.reviewCount
      : parseInt(String(data.reviewCount), 10);
  }

  return rating;
}

/**
 * Process PostalAddress
 */
function processAddress(data: FormData): Record<string, unknown> | undefined {
  const hasAnyField = data.streetAddress || data.addressLocality || data.addressRegion || data.postalCode || data.addressCountry;
  if (!hasAnyField) return undefined;

  const address: Record<string, unknown> = {
    '@type': 'PostalAddress',
  };

  if (data.streetAddress) address.streetAddress = String(data.streetAddress);
  if (data.addressLocality) address.addressLocality = String(data.addressLocality);
  if (data.addressRegion) address.addressRegion = String(data.addressRegion);
  if (data.postalCode) address.postalCode = String(data.postalCode);
  if (data.addressCountry) address.addressCountry = String(data.addressCountry);

  return address;
}

/**
 * Process Event Location
 */
function processLocation(data: FormData): Record<string, unknown> {
  const location: Record<string, unknown> = {
    '@type': 'Place',
  };

  if (data.name) location.name = String(data.name);
  if (data.address) {
    if (typeof data.address === 'object') {
      location.address = processAddress(data.address as FormData);
    } else {
      location.address = String(data.address);
    }
  }

  return location;
}

/**
 * Process Job Location
 */
function processJobLocation(data: FormData): Record<string, unknown> {
  return {
    '@type': 'Place',
    address: processAddress(data) || {},
  };
}

/**
 * Process Hiring Organization
 */
function processHiringOrganization(value: unknown): Record<string, unknown> {
  if (typeof value === 'string') {
    return {
      '@type': 'Organization',
      name: value,
    };
  }
  return processPersonOrganization(value as FormData);
}

/**
 * Process BreadcrumbList items
 */
function processBreadcrumbList(items: FormData[]): Array<Record<string, unknown>> {
  return items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: String(item.name || ''),
    item: String(item.item || ''),
  }));
}

/**
 * Process FAQ mainEntity
 */
function processFAQList(items: FormData[]): Array<Record<string, unknown>> {
  return items.map((item) => ({
    '@type': 'Question',
    name: String(item.name || ''),
    acceptedAnswer: {
      '@type': 'Answer',
      text: String(item.acceptedAnswer || ''),
    },
  }));
}

/**
 * Process HowTo steps
 */
function processHowToSteps(items: FormData[]): Array<Record<string, unknown>> {
  return items.map((item) => {
    const step: Record<string, unknown> = {
      '@type': 'HowToStep',
      name: String(item.name || ''),
      text: String(item.text || ''),
    };

    if (item.url) step.url = String(item.url);
    if (item.image) step.image = String(item.image);

    return step;
  });
}

/**
 * Process generic nested objects
 */
function processGenericNested(field: SchemaField, data: FormData): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  if (field.nestedFields) {
    field.nestedFields.forEach((nestedField) => {
      const value = processField(nestedField, data[nestedField.name]);
      if (value !== undefined && value !== null && value !== '') {
        result[nestedField.name] = value;
      }
    });
  }

  return result;
}

/**
 * Generate pretty-printed JSON-LD string
 */
export function generateJsonLd(template: SchemaTemplate, formData: FormData): string {
  const schema = generateSchema(template, formData);
  return JSON.stringify(schema, null, 2);
}

/**
 * Generate HTML script tag with JSON-LD
 */
export function generateScriptTag(template: SchemaTemplate, formData: FormData): string {
  const jsonLd = generateJsonLd(template, formData);
  return `<script type="application/ld+json">\n${jsonLd}\n</script>`;
}

/**
 * Validate form data against template requirements
 */
export function validateFormData(template: SchemaTemplate, formData: FormData): {
  valid: boolean;
  errors: Array<{ field: string; message: string }>;
} {
  const errors: Array<{ field: string; message: string }> = [];

  template.fields.forEach((field) => {
    if (field.required) {
      const value = formData[field.name];
      if (value === undefined || value === null || value === '') {
        errors.push({
          field: field.name,
          message: `${field.label} is required`,
        });
      }

      // Validate nested required fields
      if (field.type === 'nested' && field.nestedFields) {
        field.nestedFields.forEach((nestedField) => {
          if (nestedField.required && value) {
            const nestedValue = (value as FormData)[nestedField.name];
            if (nestedValue === undefined || nestedValue === null || nestedValue === '') {
              errors.push({
                field: `${field.name}.${nestedField.name}`,
                message: `${field.label} - ${nestedField.label} is required`,
              });
            }
          }
        });
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Get default form data for a template
 */
export function getDefaultFormData(template: SchemaTemplate): FormData {
  const formData: FormData = {};

  template.fields.forEach((field) => {
    if (field.defaultValue !== undefined) {
      formData[field.name] = field.defaultValue;
    } else if (field.type === 'nested' && field.nestedFields) {
      const nestedData: FormData = {};
      field.nestedFields.forEach((nestedField) => {
        if (nestedField.defaultValue !== undefined) {
          nestedData[nestedField.name] = nestedField.defaultValue;
        }
      });
      if (Object.keys(nestedData).length > 0) {
        formData[field.name] = nestedData;
      }
    }
  });

  return formData;
}
