/**
 * Core Validation Engine
 * Validates Schema.org structured data against multiple rule layers
 */

import {
  ParsedSchema,
  ValidationResult,
  ValidationError,
  ValidationWarning,
  ValidationPass,
  ValidationRule,
} from './types';
import { getRulesForSchemaType, isSchemaTypeSupported } from './rules';

export class ValidationEngine {
  async validate(schemas: ParsedSchema[]): Promise<ValidationResult[]> {
    const results: ValidationResult[] = [];

    for (const schema of schemas) {
      const result = await this.validateSchema(schema);
      results.push(result);
    }

    return results;
  }

  private async validateSchema(schema: ParsedSchema): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];
    const passed: ValidationPass[] = [];

    // Layer 1: Syntax Validation
    const syntaxErrors = this.validateSyntax(schema);
    errors.push(...syntaxErrors);

    // Layer 2: Schema.org Validation
    if (syntaxErrors.length === 0) {
      const schemaErrors = this.validateSchemaOrg(schema);
      errors.push(...schemaErrors);
    }

    // Layer 3: Google Rich Results Validation
    const googleErrors = this.validateGoogleRequirements(schema);
    errors.push(...googleErrors);

    // Layer 4: SEO Enhancement Recommendations
    const recommendations = this.generateRecommendations(schema);
    warnings.push(...recommendations);

    // Generate passed checks
    const passedChecks = this.generatePassedChecks(schema, errors, warnings);
    passed.push(...passedChecks);

    // Calculate scores
    const completeness = this.calculateCompleteness(schema);
    const seoScore = this.calculateSeoScore(schema, errors, warnings);
    const richResultsEligible = this.isRichResultsEligible(schema, errors);

    return {
      schema,
      errors,
      warnings,
      passed,
      completeness,
      richResultsEligible,
      seoScore,
    };
  }

  private validateSyntax(schema: ParsedSchema): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check @context
    if (!schema.context || !schema.context.includes('schema.org')) {
      errors.push({
        severity: 'error',
        property: '@context',
        message:
          '@context must be present and point to Schema.org (https://schema.org)',
        fix: 'Add "@context": "https://schema.org"',
        seoImpact: 'high',
        documentation: 'https://schema.org/docs/jsonldcontext.html',
      });
    }

    // Check @type
    if (!schema.type) {
      errors.push({
        severity: 'error',
        property: '@type',
        message: '@type property is required to identify the schema type',
        fix: 'Add "@type": "Article" (or appropriate schema type)',
        seoImpact: 'high',
        documentation: 'https://schema.org/',
      });
    }

    // Check if schema type is supported
    if (schema.type && !isSchemaTypeSupported(schema.type)) {
      errors.push({
        severity: 'warning',
        property: '@type',
        message: `Schema type "${schema.type}" is not yet supported by this validator`,
        fix: `Supported types: Article, Product, Organization, LocalBusiness, BreadcrumbList`,
        seoImpact: 'medium',
        documentation: 'https://schema.org/',
      });
    }

    return errors;
  }

  private validateSchemaOrg(schema: ParsedSchema): ValidationError[] {
    const errors: ValidationError[] = [];
    const rules = getRulesForSchemaType(schema.type);

    if (rules.length === 0) {
      // Schema type not supported yet
      return errors;
    }

    for (const rule of rules) {
      const propertyValue = schema.properties[rule.property];
      const propertyExists = rule.property in schema.properties;

      // Check required properties
      if (rule.required && !propertyExists) {
        errors.push({
          severity: 'error',
          property: rule.property,
          message: rule.errorMessage,
          fix: rule.fix,
          seoImpact: rule.seoImpact,
          documentation: rule.documentation || 'https://schema.org/',
        });
        continue;
      }

      // Skip validation if property doesn't exist and is not required
      if (!propertyExists) continue;

      // Type validation
      if (rule.type) {
        const typeErrors = this.validateType(
          propertyValue,
          rule.type,
          rule.property,
          rule
        );
        errors.push(...typeErrors);
      }

      // Format validation
      if (rule.format && typeof propertyValue === 'string') {
        const formatErrors = this.validateFormat(
          propertyValue,
          rule.format,
          rule.property,
          rule
        );
        errors.push(...formatErrors);
      }

      // Pattern validation
      if (rule.pattern && typeof propertyValue === 'string') {
        if (!rule.pattern.test(propertyValue)) {
          errors.push({
            severity: 'error',
            property: rule.property,
            message: `${rule.property} does not match expected pattern: ${rule.errorMessage}`,
            fix: rule.fix,
            seoImpact: rule.seoImpact,
            documentation: rule.documentation || 'https://schema.org/',
          });
        }
      }

      // Length validation
      if (typeof propertyValue === 'string') {
        if (rule.minLength && propertyValue.length < rule.minLength) {
          errors.push({
            severity: 'warning',
            property: rule.property,
            message: `${rule.property} should be at least ${rule.minLength} characters (current: ${propertyValue.length})`,
            fix: `Expand ${rule.property} to meet minimum length`,
            seoImpact: rule.seoImpact,
            documentation: rule.documentation || 'https://schema.org/',
          });
        }

        if (rule.maxLength && propertyValue.length > rule.maxLength) {
          errors.push({
            severity: 'warning',
            property: rule.property,
            message: `${rule.property} should be at most ${rule.maxLength} characters (current: ${propertyValue.length})`,
            fix: `Shorten ${rule.property} to meet maximum length`,
            seoImpact: rule.seoImpact,
            documentation: rule.documentation || 'https://schema.org/',
          });
        }
      }

      // Enum validation
      if (rule.enum && !rule.enum.includes(propertyValue)) {
        errors.push({
          severity: 'error',
          property: rule.property,
          message: `${rule.property} has invalid value. ${rule.errorMessage}`,
          fix: rule.fix,
          seoImpact: rule.seoImpact,
          documentation: rule.documentation || 'https://schema.org/',
        });
      }

      // Nested property validation
      if (rule.nestedRequired && typeof propertyValue === 'object') {
        const nestedErrors = this.validateNestedProperties(
          propertyValue,
          rule.nestedRequired,
          rule.property,
          rule
        );
        errors.push(...nestedErrors);
      }
    }

    return errors;
  }

  private validateType(
    value: unknown,
    expectedType: string | string[],
    propertyName: string,
    rule: ValidationRule
  ): ValidationError[] {
    const errors: ValidationError[] = [];
    const types = Array.isArray(expectedType) ? expectedType : [expectedType];

    const actualType = this.getSchemaType(value);
    const isValidType = types.some((type) => {
      if (type.toLowerCase() === 'string') return typeof value === 'string';
      if (type.toLowerCase() === 'number') return typeof value === 'number';
      if (type.toLowerCase() === 'boolean') return typeof value === 'boolean';
      if (type.toLowerCase() === 'array') return Array.isArray(value);
      // Schema.org type (e.g., ImageObject, Person)
      return actualType === type || this.isCompatibleType(actualType, type);
    });

    if (!isValidType) {
      errors.push({
        severity: 'error',
        property: propertyName,
        message: `${propertyName} has invalid type. Expected: ${types.join(' | ')}, Got: ${actualType}`,
        fix: rule.fix,
        seoImpact: rule.seoImpact,
        documentation: rule.documentation || 'https://schema.org/',
      });
    }

    return errors;
  }

  private getSchemaType(value: unknown): string {
    if (typeof value === 'string') return 'string';
    if (typeof value === 'number') return 'number';
    if (typeof value === 'boolean') return 'boolean';
    if (Array.isArray(value)) return 'array';
    if (typeof value === 'object' && value !== null) {
      const obj = value as Record<string, unknown>;
      return obj['@type'] ? String(obj['@type']) : 'object';
    }
    return 'unknown';
  }

  private isCompatibleType(actualType: string, expectedType: string): boolean {
    // Type compatibility mapping (e.g., BlogPosting is compatible with Article)
    const typeHierarchy: Record<string, string[]> = {
      Article: ['NewsArticle', 'BlogPosting', 'TechArticle'],
      Organization: ['LocalBusiness', 'Corporation', 'NGO'],
      Place: ['LocalBusiness', 'Restaurant', 'Store'],
    };

    return typeHierarchy[expectedType]?.includes(actualType) || false;
  }

  private validateFormat(
    value: string,
    format: string,
    propertyName: string,
    rule: ValidationRule
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (format === 'ISO8601') {
      const iso8601Regex =
        /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?(Z|[+-]\d{2}:\d{2})?)?$/;
      if (!iso8601Regex.test(value)) {
        errors.push({
          severity: 'error',
          property: propertyName,
          message: `${propertyName} must be in ISO 8601 date/time format`,
          fix: rule.fix,
          seoImpact: rule.seoImpact,
          documentation: rule.documentation || 'https://schema.org/',
        });
      }
    }

    return errors;
  }

  private validateNestedProperties(
    obj: unknown,
    requiredProperties: string[],
    parentProperty: string,
    rule: ValidationRule
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (typeof obj !== 'object' || obj === null) {
      return errors;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const nestedErrors = this.validateNestedProperties(
          item,
          requiredProperties,
          `${parentProperty}[${index}]`,
          rule
        );
        errors.push(...nestedErrors);
      });
      return errors;
    }

    const objRecord = obj as Record<string, unknown>;

    for (const nestedProp of requiredProperties) {
      if (!(nestedProp in objRecord)) {
        errors.push({
          severity: 'error',
          property: `${parentProperty}.${nestedProp}`,
          message: `${parentProperty} requires nested property: ${nestedProp}`,
          fix: `Add "${nestedProp}" inside ${parentProperty}`,
          seoImpact: rule.seoImpact,
          documentation: rule.documentation || 'https://schema.org/',
        });
      }
    }

    return errors;
  }

  private validateGoogleRequirements(schema: ParsedSchema): ValidationError[] {
    const errors: ValidationError[] = [];
    const rules = getRulesForSchemaType(schema.type);

    for (const rule of rules) {
      if (!rule.googleRequirement) continue;

      const propertyValue = schema.properties[rule.property];
      if (!propertyValue) continue;

      // Validate image dimensions
      if (rule.googleRequirement.minWidth || rule.googleRequirement.minHeight) {
        const imageErrors = this.validateImageRequirements(
          propertyValue,
          rule
        );
        errors.push(...imageErrors);
      }
    }

    return errors;
  }

  private validateImageRequirements(
    value: unknown,
    rule: ValidationRule
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    // Handle array of images
    if (Array.isArray(value)) {
      value.forEach((img, index) => {
        const imgErrors = this.validateSingleImage(img, rule, index);
        errors.push(...imgErrors);
      });
      return errors;
    }

    // Single image
    const imgErrors = this.validateSingleImage(value, rule);
    errors.push(...imgErrors);

    return errors;
  }

  private validateSingleImage(
    image: unknown,
    rule: ValidationRule,
    index?: number
  ): ValidationError[] {
    const errors: ValidationError[] = [];
    const propertyName = index !== undefined ? `${rule.property}[${index}]` : rule.property;

    // If it's an ImageObject, check width/height
    if (typeof image === 'object' && image !== null) {
      const imgObj = image as Record<string, unknown>;

      if (imgObj['@type'] === 'ImageObject') {
        const width = Number(imgObj.width);
        const height = Number(imgObj.height);

        if (rule.googleRequirement?.minWidth && width < rule.googleRequirement.minWidth) {
          errors.push({
            severity: 'warning',
            property: propertyName,
            message: `Image width (${width}px) is below Google's recommended minimum of ${rule.googleRequirement.minWidth}px`,
            fix: `Use an image with width ≥ ${rule.googleRequirement.minWidth}px`,
            seoImpact: 'high',
            documentation: rule.documentation || 'https://developers.google.com/search/docs/appearance/structured-data',
          });
        }

        if (rule.googleRequirement?.minHeight && height < rule.googleRequirement.minHeight) {
          errors.push({
            severity: 'warning',
            property: propertyName,
            message: `Image height (${height}px) is below Google's recommended minimum of ${rule.googleRequirement.minHeight}px`,
            fix: `Use an image with height ≥ ${rule.googleRequirement.minHeight}px`,
            seoImpact: 'high',
            documentation: rule.documentation || 'https://developers.google.com/search/docs/appearance/structured-data',
          });
        }
      }
    }

    return errors;
  }

  private generateRecommendations(schema: ParsedSchema): ValidationWarning[] {
    const warnings: ValidationWarning[] = [];
    const rules = getRulesForSchemaType(schema.type);

    // Find optional but recommended properties
    const recommendedRules = rules.filter(
      (r) => !r.required && r.seoImpact !== 'low'
    );

    for (const rule of recommendedRules) {
      if (!(rule.property in schema.properties)) {
        warnings.push({
          severity: 'warning',
          property: rule.property,
          message: rule.errorMessage,
          fix: rule.fix,
          seoImpact: rule.seoImpact,
          documentation: rule.documentation || 'https://schema.org/',
        });
      }
    }

    return warnings;
  }

  private generatePassedChecks(
    schema: ParsedSchema,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): ValidationPass[] {
    const passed: ValidationPass[] = [];
    const rules = getRulesForSchemaType(schema.type);
    const errorProperties = new Set(errors.map((e) => e.property.split('.')[0]));
    const warningProperties = new Set(warnings.map((w) => w.property.split('.')[0]));

    for (const rule of rules) {
      if (
        rule.property in schema.properties &&
        !errorProperties.has(rule.property) &&
        !warningProperties.has(rule.property)
      ) {
        passed.push({
          property: rule.property,
          message: `${rule.property} is valid`,
        });
      }
    }

    // Always pass if @context and @type are valid
    if (!errorProperties.has('@context')) {
      passed.push({
        property: '@context',
        message: '@context is valid',
      });
    }

    if (!errorProperties.has('@type')) {
      passed.push({
        property: '@type',
        message: `@type "${schema.type}" is recognized`,
      });
    }

    return passed;
  }

  private calculateCompleteness(schema: ParsedSchema): number {
    const rules = getRulesForSchemaType(schema.type);
    if (rules.length === 0) return 0;

    const totalProperties = rules.length;
    const presentProperties = rules.filter((r) => r.property in schema.properties).length;

    return Math.round((presentProperties / totalProperties) * 100);
  }

  private calculateSeoScore(
    schema: ParsedSchema,
    errors: ValidationError[],
    warnings: ValidationWarning[]
  ): number {
    let score = 100;

    // Deduct points for errors
    errors.forEach((error) => {
      if (error.seoImpact === 'high') score -= 20;
      else if (error.seoImpact === 'medium') score -= 10;
      else score -= 5;
    });

    // Deduct points for warnings
    warnings.forEach((warning) => {
      if (warning.seoImpact === 'high') score -= 10;
      else if (warning.seoImpact === 'medium') score -= 5;
      else score -= 2;
    });

    return Math.max(0, Math.min(100, score));
  }

  private isRichResultsEligible(
    schema: ParsedSchema,
    errors: ValidationError[]
  ): boolean {
    // Check if there are any high-impact errors
    const hasHighImpactErrors = errors.some((e) => e.seoImpact === 'high');

    // Schema types eligible for rich results
    const richResultsTypes = [
      'Article',
      'NewsArticle',
      'BlogPosting',
      'Product',
      'Recipe',
      'Event',
      'FAQ',
      'HowTo',
    ];

    const isEligibleType = richResultsTypes.includes(schema.type);

    return isEligibleType && !hasHighImpactErrors;
  }
}

/**
 * Helper function for common use cases
 */
export async function validateSchemas(
  schemas: ParsedSchema[]
): Promise<ValidationResult[]> {
  const engine = new ValidationEngine();
  return engine.validate(schemas);
}
