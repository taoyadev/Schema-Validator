/**
 * Live Validation with Debouncing
 * Validates JSON-LD as user types with optimized debouncing
 */

import type { ValidationResponse } from './types';

type ValidationCallback = (result: ValidationResponse | null, error: string | null) => void;

let debounceTimer: NodeJS.Timeout | null = null;
let abortController: AbortController | null = null;

/**
 * Validate JSON-LD with debouncing
 * @param jsonLd - JSON-LD string to validate
 * @param callback - Callback function to receive results
 * @param debounceMs - Debounce delay in milliseconds (default: 500ms)
 */
export function validateLive(
  jsonLd: string,
  callback: ValidationCallback,
  debounceMs: number = 500
): void {
  // Clear previous timer
  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  // Abort previous request
  if (abortController) {
    abortController.abort();
  }

  // Quick validation checks
  if (!jsonLd.trim()) {
    callback(null, null);
    return;
  }

  // Check if valid JSON
  try {
    JSON.parse(jsonLd);
  } catch (_e) {
    callback(null, 'Invalid JSON syntax');
    return;
  }

  // Debounce the API call
  debounceTimer = setTimeout(async () => {
    abortController = new AbortController();

    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          source: 'json-ld',
          input: JSON.parse(jsonLd),
        }),
        signal: abortController.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: 'Unknown error',
        }));
        callback(null, errorData.error || `HTTP ${response.status}`);
        return;
      }

      const data: ValidationResponse = await response.json();
      callback(data, null);
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }

      callback(
        null,
        err instanceof Error ? err.message : 'Failed to validate schema'
      );
    }
  }, debounceMs);
}

/**
 * Cancel any pending validation
 */
export function cancelValidation(): void {
  if (debounceTimer) {
    clearTimeout(debounceTimer);
    debounceTimer = null;
  }

  if (abortController) {
    abortController.abort();
    abortController = null;
  }
}

/**
 * Validate JSON syntax only (no API call)
 */
export function validateJsonSyntax(jsonLd: string): {
  valid: boolean;
  error: string | null;
  parsedData: unknown | null;
} {
  if (!jsonLd.trim()) {
    return { valid: true, error: null, parsedData: null };
  }

  try {
    const parsedData = JSON.parse(jsonLd);
    return { valid: true, error: null, parsedData };
  } catch (_e) {
    const error = _e instanceof Error ? _e.message : 'Invalid JSON';
    return { valid: false, error, parsedData: null };
  }
}

/**
 * Check if JSON-LD has required fields
 */
export function hasRequiredFields(jsonLd: string): {
  hasContext: boolean;
  hasType: boolean;
  error: string | null;
} {
  const syntaxCheck = validateJsonSyntax(jsonLd);

  if (!syntaxCheck.valid || !syntaxCheck.parsedData) {
    return {
      hasContext: false,
      hasType: false,
      error: syntaxCheck.error,
    };
  }

  const data = syntaxCheck.parsedData as Record<string, unknown>;

  return {
    hasContext: '@context' in data,
    hasType: '@type' in data,
    error: null,
  };
}

/**
 * Get validation errors from JSON-LD structure
 */
export function getQuickValidationErrors(jsonLd: string): string[] {
  const errors: string[] = [];

  const syntaxCheck = validateJsonSyntax(jsonLd);
  if (!syntaxCheck.valid) {
    errors.push(syntaxCheck.error || 'Invalid JSON');
    return errors;
  }

  if (!syntaxCheck.parsedData) {
    return errors;
  }

  const data = syntaxCheck.parsedData as Record<string, unknown>;

  if (!('@context' in data)) {
    errors.push('Missing @context property');
  } else if (data['@context'] !== 'https://schema.org') {
    errors.push('@context should be "https://schema.org"');
  }

  if (!('@type' in data)) {
    errors.push('Missing @type property');
  }

  return errors;
}
