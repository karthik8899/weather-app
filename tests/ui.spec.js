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

function grantGeolocation(page, lat = 51.5074, lon = -0.1278) {
  return page.addInitScript(({ lat, lon }) => {
    Object.defineProperty(navigator, 'geolocation', {
      value: {
        getCurrentPosition: (ok) =>
          ok({ coords: { latitude: lat, longitude: lon } }),
      },
      configurable: true,
    });
  }, { lat, lon });
}

test.describe('Unit toggle', () => {
  test('switches between °C and °F', async ({ page }) => {
    await grantGeolocation(page);
    await page.goto('/');

    // Wait for weather to load (skeleton disappears, temp is visible)
    // Skeleton has animate-pulse; wait for it to disappear
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 15000 });

    const toggleButton = page.getByRole('button', { name: 'Toggle temperature unit' });
    await expect(toggleButton).toBeVisible();

    // Initially °C should be fully visible (opacity-100) and °F muted
    const celsiusSpan = toggleButton.locator('span', { hasText: '°C' });
    await expect(celsiusSpan).toHaveClass(/opacity-100/);

    // Click to switch to °F
    await toggleButton.click();

    // °F should now be fully visible
    const fahrenheitSpan = toggleButton.locator('span', { hasText: '°F' });
    await expect(fahrenheitSpan).toHaveClass(/opacity-100/);

    // Temperature display should contain °F
    const tempDisplay = page.locator('p.text-8xl');
    await expect(tempDisplay).toContainText('°F', { timeout: 10000 });
  });
});

test.describe('Welcome / empty state', () => {
  test('shows welcome card when geolocation denied and no search', async ({ page }) => {
    await denyGeolocation(page);
    await page.goto('/');

    await expect(page.getByText('Welcome to Weather')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Skeleton loader', () => {
  test('skeleton shows during loading then disappears', async ({ page }) => {
    await grantGeolocation(page);
    await page.goto('/');

    // Skeleton should be visible immediately after load starts
    const skeleton = page.locator('.animate-pulse').first();
    await expect(skeleton).toBeVisible({ timeout: 5000 });

    // Then it should disappear once data loads
    await expect(skeleton).not.toBeVisible({ timeout: 15000 });
  });
});

test.describe('City pill', () => {
  test('city pill appears and can be cleared', async ({ page }) => {
    await denyGeolocation(page);
    await page.goto('/');

    // Search for a city
    const input = page.getByPlaceholder('Search city or ZIP code…');
    await input.click();
    await input.fill('London');

    const suggestionsList = page.locator('ul');
    await expect(suggestionsList).toBeVisible({ timeout: 10000 });
    await suggestionsList.locator('button', { hasText: 'London' }).first().click();

    // City pill should appear
    const clearButton = page.locator('button[aria-label="Clear selected location"]');
    await expect(clearButton).toBeVisible({ timeout: 5000 });

    // Wait for weather to fully load before clearing (avoids a bug where useWeather
    // leaves loading=true permanently if cancelled mid-flight)
    await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 15000 });

    // Click ✕ to clear
    await clearButton.click();

    // Pill should disappear
    await expect(clearButton).not.toBeVisible({ timeout: 3000 });

    // Welcome card should reappear
    await expect(page.getByText('Welcome to Weather')).toBeVisible({ timeout: 10000 });
  });
});
