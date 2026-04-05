import { test, expect } from '@playwright/test';

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

async function waitForWeatherLoad(page) {
  // Wait for skeleton to disappear, meaning data has loaded
  await expect(page.locator('.animate-pulse').first()).not.toBeVisible({ timeout: 15000 });
}

test.describe('Current weather display', () => {
  test('shows sunrise and sunset in stat grid', async ({ page }) => {
    await grantGeolocation(page);
    await page.goto('/');
    await waitForWeatherLoad(page);

    // Sunrise card
    const sunriseCard = page.locator('p', { hasText: '🌅' });
    await expect(sunriseCard).toBeVisible({ timeout: 10000 });

    // Sunset card
    const sunsetCard = page.locator('p', { hasText: '🌇' });
    await expect(sunsetCard).toBeVisible({ timeout: 10000 });
  });

  test('shows wind direction bearing in wind stat', async ({ page }) => {
    await grantGeolocation(page);
    await page.goto('/');
    await waitForWeatherLoad(page);

    // Wind stat card value contains bearing: N, NE, E, SE, S, SW, W, or NW
    const windCard = page.locator('div').filter({ hasText: /^💨/ }).filter({ has: page.locator('p', { hasText: 'Wind' }) });
    const windValue = windCard.locator('p.text-sm.font-semibold');
    await expect(windValue).toBeVisible({ timeout: 10000 });
    await expect(windValue).toHaveText(/\b(N|NE|E|SE|S|SW|W|NW)\b/);
  });
});

test.describe('Hourly forecast', () => {
  test('shows feels like below each hourly temp', async ({ page }) => {
    await grantGeolocation(page);
    await page.goto('/');
    await waitForWeatherLoad(page);

    // Each hourly slot should contain "Feels"
    // "Feels" paragraphs are rendered inside each hourly slot card
    const feelsLike = page.locator('p', { hasText: /^Feels/ });
    await expect(feelsLike.first()).toBeVisible({ timeout: 10000 });

    // Should have at least 1 (up to 8) hourly slots with "Feels" text
    const count = await feelsLike.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });
});

test.describe('AQI card', () => {
  test('AQI card renders with quality label', async ({ page }) => {
    await grantGeolocation(page);
    await page.goto('/');
    await waitForWeatherLoad(page);

    // AQI card is shown only when the air_pollution API call succeeds.
    // It uses Promise.allSettled so failures are silent — skip gracefully if absent.
    const aqiHeading = page.locator('h2', { hasText: 'Air Quality' });
    const isVisible = await aqiHeading.isVisible().catch(() => false);
    if (!isVisible) {
      // AQI API may be rate-limited or unavailable in this environment
      test.skip(true, 'AQI card not rendered — air_pollution API may be rate-limited or unavailable');
      return;
    }

    await expect(aqiHeading).toBeVisible({ timeout: 20000 });

    // One of the AQI labels should be visible
    const aqiLabel = page.locator('span', { hasText: /^(Good|Fair|Moderate|Poor|Very Poor)$/ });
    await expect(aqiLabel).toBeVisible({ timeout: 10000 });
  });
});
