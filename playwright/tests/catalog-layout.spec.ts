import { expect, test } from '@playwright/test';

test.describe('storefront catalogue layout', () => {
  test('catalog keeps dense legacy-style listing rows', async ({ page }) => {
    await page.goto('/catalog');

    await expect(page.locator('.catalog-filters')).toHaveCount(1);
    await expect(page.locator('.catalog-row')).toHaveCount(4);
    await expect(page.locator('.catalog-row-side')).toHaveCount(4);
    await expect(page.getByRole('button', { name: 'ADD TO CART' }).first()).toBeVisible();

    await page.screenshot({
      path: 'playwright-artifacts/catalog-layout.png',
      fullPage: true
    });
  });
});
