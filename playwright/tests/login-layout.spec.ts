import { expect, test } from '@playwright/test';

test.describe('storefront login layout', () => {
  test('login keeps the live Clockwork split layout', async ({ page }) => {
    await page.goto('/login');

    await expect(page.locator('.login-header')).toHaveCount(1);
    await expect(page.locator('.login-left-surface')).toHaveCount(1);
    await expect(page.locator('.login-benefits li')).toHaveCount(4);
    await expect(page.locator('.login-card')).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'Log In' })).toBeVisible();

    await page.screenshot({
      path: 'playwright-artifacts/login-layout.png',
      fullPage: true
    });
  });
});
