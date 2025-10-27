import { test, expect } from '@playwright/test';

test.describe('Schema Validation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display homepage with validation form', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/Schema.*Validator/i);

    // Check main heading
    const heading = page.getByRole('heading', { level: 1 });
    await expect(heading).toBeVisible();

    // Check tabs are present
    await expect(page.getByRole('tab', { name: /url/i })).toBeVisible();
    await expect(page.getByRole('tab', { name: /json-ld/i })).toBeVisible();
  });

  test('should validate valid JSON-LD successfully', async ({ page }) => {
    // Switch to JSON-LD tab
    await page.getByRole('tab', { name: /json-ld/i }).click();

    // Enter valid JSON-LD
    const validJsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Test Article with Proper Schema',
      image: 'https://example.com/image.jpg',
      datePublished: '2025-10-26T10:00:00Z',
      author: {
        '@type': 'Person',
        name: 'John Doe',
      },
    }, null, 2);

    const textarea = page.getByRole('textbox', { name: /json-ld/i });
    await textarea.fill(validJsonLd);

    // Click validate button
    await page.getByRole('button', { name: /validate/i }).click();

    // Wait for results
    await expect(page.getByText(/validation results/i)).toBeVisible({ timeout: 10000 });

    // Should show success indicators
    await expect(page.getByText(/overall score/i)).toBeVisible();
    await expect(page.getByText(/article/i)).toBeVisible();
  });

  test('should show errors for invalid JSON-LD', async ({ page }) => {
    // Switch to JSON-LD tab
    await page.getByRole('tab', { name: /json-ld/i }).click();

    // Enter invalid JSON-LD (missing required properties)
    const invalidJsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: 'Incomplete Article',
      // Missing: image, datePublished, author
    }, null, 2);

    const textarea = page.getByRole('textbox', { name: /json-ld/i });
    await textarea.fill(invalidJsonLd);

    // Click validate button
    await page.getByRole('button', { name: /validate/i }).click();

    // Wait for results
    await expect(page.getByText(/validation results/i)).toBeVisible({ timeout: 10000 });

    // Should show errors
    await expect(page.getByText(/error/i)).toBeVisible();
    await expect(page.getByText(/image.*required/i)).toBeVisible();
  });

  test('should handle malformed JSON gracefully', async ({ page }) => {
    // Switch to JSON-LD tab
    await page.getByRole('tab', { name: /json-ld/i }).click();

    // Enter malformed JSON
    const textarea = page.getByRole('textbox', { name: /json-ld/i });
    await textarea.fill('{ invalid json }');

    // Click validate button
    await page.getByRole('button', { name: /validate/i }).click();

    // Should show error message
    await expect(page.getByText(/failed to parse/i)).toBeVisible({ timeout: 10000 });
  });

  test('should disable validate button when input is empty', async ({ page }) => {
    const validateButton = page.getByRole('button', { name: /validate/i });
    await expect(validateButton).toBeDisabled();

    // Switch to JSON-LD tab and add content
    await page.getByRole('tab', { name: /json-ld/i }).click();
    const textarea = page.getByRole('textbox', { name: /json-ld/i });
    await textarea.fill('{"@context": "https://schema.org"}');

    // Button should be enabled
    await expect(validateButton).toBeEnabled();
  });

  test('should work on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Check elements are visible
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('tab', { name: /url/i })).toBeVisible();

    // Should be able to interact
    await page.getByRole('tab', { name: /json-ld/i }).click();
    const textarea = page.getByRole('textbox', { name: /json-ld/i });
    await expect(textarea).toBeVisible();
  });
});

test.describe('API Validation', () => {
  test('should validate via API endpoint', async ({ request }) => {
    const response = await request.post('/api/validate', {
      data: {
        source: 'json-ld',
        input: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: 'API Test Article',
          image: 'https://example.com/image.jpg',
          datePublished: '2025-10-26T10:00:00Z',
          author: {
            '@type': 'Person',
            name: 'Test Author',
          },
        }),
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();

    expect(data.success).toBe(true);
    expect(data.overallScore).toBeGreaterThan(0);
    expect(data.schemas).toHaveLength(1);
    expect(data.schemas[0].schema.type).toBe('Article');
  });

  test('should return 400 for invalid request', async ({ request }) => {
    const response = await request.post('/api/validate', {
      data: {
        source: 'invalid-source',
        input: 'test',
      },
    });

    expect(response.status()).toBe(400);
    const data = await response.json();
    expect(data.success).toBe(false);
    expect(data.error).toBeDefined();
  });

  test('should enforce rate limiting', async ({ request }) => {
    // Make 11 rapid requests (limit is 10 per minute)
    const requests = Array.from({ length: 11 }, () =>
      request.post('/api/validate', {
        data: {
          source: 'json-ld',
          input: '{"@context": "https://schema.org", "@type": "Article"}',
        },
      })
    );

    const responses = await Promise.all(requests);
    const statusCodes = responses.map(r => r.status());

    // At least one should be rate limited (429)
    expect(statusCodes.some(code => code === 429)).toBeTruthy();
  });
});
