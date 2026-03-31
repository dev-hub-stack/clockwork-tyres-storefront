import { expect, test } from '@playwright/test';

test.describe('storefront header layout', () => {
  test('home uses the landing header only', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('.landingheader')).toHaveCount(1);
    await expect(page.locator('.desktop-navbar')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Retailer Login' }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Search by Vehicle' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Search by Size' })).toBeVisible();
  });

  test('catalog uses the storefront header only', async ({ page }) => {
    await page.goto('/catalog');

    await expect(page.locator('.desktop-navbar')).toHaveCount(1);
    await expect(page.locator('.landingheader')).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'Products' })).toBeVisible();
  });
});
