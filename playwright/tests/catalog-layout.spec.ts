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

  test('vehicle search modal stays close to Clockwork interaction pattern', async ({ page }) => {
    await page.goto('/catalog');

    await page.getByRole('button', { name: /Search Tyres by Vehicle/i }).click();

    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Search by Vehicle' })).toBeVisible();
    await expect(
      page.getByText(
        'Please Note: Search by vehicle results are being optimized. Always verify offsets and brake clearance. For staggered fitments use the search by size function.'
      )
    ).toBeVisible();

    await page.screenshot({
      path: 'playwright-artifacts/catalog-vehicle-modal.png',
      fullPage: true
    });
  });
});
