import { expect, test } from '@playwright/test';

test.describe('storefront register layout', () => {
  test('register keeps the live Clockwork auth shell', async ({ page }) => {
    await page.goto('/register');

    await expect(page.locator('.register-header')).toHaveCount(1);
    await expect(page.locator('.register-left')).toHaveCount(1);
    await expect(page.locator('.register-benefits li')).toHaveCount(4);
    await expect(page.locator('.register-card')).toHaveCount(1);
    await expect(page.getByRole('button', { name: 'Register Business' })).toBeVisible();

    await page.screenshot({
      path: 'playwright-artifacts/register-layout.png',
      fullPage: true
    });
  });
});
