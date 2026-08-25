import { test, expect } from '@playwright/test';

test.describe('E-commerce storefront', () => {
  test('loads the product catalog', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/shop|store|catalog/i);
    await expect(page.getByRole('main')).toBeVisible();
  });
});
