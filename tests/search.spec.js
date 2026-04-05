import { test, expect } from '@playwright/test';

function denyGeolocation(page) {
  return page.addInitScript(() => {
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: (_, err) => err({ code: 1, message: 'denied' }),
      },
      configurable: true,
    });
  });
}

test.describe('City search', () => {
  test('shows autocomplete suggestions when typing a city name', async ({ page }) => {
    await denyGeolocation(page);
    await page.goto('/');

    const input = page.getByPlaceholder('Search city or ZIP code…');
    await input.click();
    await input.fill('London');

    // Wait for the suggestions dropdown (ul)
    const suggestionsList = page.locator('ul');
    await expect(suggestionsList).toBeVisible({ timeout: 10000 });

    // Expect at least one suggestion containing 'London'
    const londonSuggestion = suggestionsList.locator('button', { hasText: 'London' }).first();
    await expect(londonSuggestion).toBeVisible({ timeout: 10000 });

    // Click first suggestion
    await londonSuggestion.click();

    // City pill should appear below search bar
    const clearButton = page.locator('button[aria-label="Clear selected location"]');
    await expect(clearButton).toBeVisible({ timeout: 5000 });
    // The pill div (parent of clear button) should contain the city name
    await expect(clearButton.locator('..')).toContainText('London', { timeout: 5000 });

    // Input should be cleared
    await expect(input).toHaveValue('');
  });
});

test.describe('ZIP code search', () => {
  test('accepts valid US ZIP and shows suggestion', async ({ page }) => {
    await denyGeolocation(page);
    await page.goto('/');

    const input = page.getByPlaceholder('Search city or ZIP code…');
    await input.click();
    await input.fill('10001');

    // Wait for suggestion dropdown
    const suggestionsList = page.locator('ul');
    await expect(suggestionsList).toBeVisible({ timeout: 10000 });

    // A suggestion should appear (New York area)
    const firstSuggestion = suggestionsList.locator('button').first();
    await expect(firstSuggestion).toBeVisible({ timeout: 10000 });

    // Click it, expect city pill to appear
    await firstSuggestion.click();
    const cityPill = page.locator('button[aria-label="Clear selected location"]');
    await expect(cityPill).toBeVisible({ timeout: 5000 });
  });

  test('shows error for invalid ZIP', async ({ page }) => {
    await denyGeolocation(page);
    await page.goto('/');

    const input = page.getByPlaceholder('Search city or ZIP code…');
    await input.click();
    await input.fill('99999');

    // Wait for debounce + API call to fail — error message should appear below input
    const errorText = page.locator('p.text-red-300');
    await expect(errorText).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Recent searches', () => {
  test('recent searches appear after a selection', async ({ page }) => {
    await denyGeolocation(page);
    await page.goto('/');

    // First, do a city search and select a result
    const input = page.getByPlaceholder('Search city or ZIP code…');
    await input.click();
    await input.fill('London');

    const suggestionsList = page.locator('ul');
    await expect(suggestionsList).toBeVisible({ timeout: 10000 });
    await suggestionsList.locator('button', { hasText: 'London' }).first().click();

    // Wait for city pill to confirm selection
    await expect(page.locator('button[aria-label="Clear selected location"]')).toBeVisible({ timeout: 5000 });

    // Now click the (now empty) search input
    await input.click();

    // Recent searches dropdown should appear
    const recentSection = page.getByText('Recent Searches');
    await expect(recentSection).toBeVisible({ timeout: 5000 });
  });
});
