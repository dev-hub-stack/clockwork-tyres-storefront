import { expect, test } from '@playwright/test';

test.describe('Clockwork Tyres storefront smoke', () => {
  test('counter routes require business login', async ({ page }) => {
    await page.goto('/catalog');

    await expect(page).toHaveURL(/\/login/, { timeout: 15000 });
    await expect(page.locator('[data-testid="login-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="login-form"]')).toHaveAttribute(
      'data-interactive',
      'true',
      { timeout: 15000 }
    );
  });

  test('retailer can place an order through the counter flow', async ({ page }) => {
    await page.goto('/login');
    await expect(page.locator('[data-testid="login-form"]')).toHaveAttribute(
      'data-interactive',
      'true',
      { timeout: 15000 }
    );

    await page.locator('#email').fill('sheikhahmad91@gmail.com');
    await page.locator('#password').fill('password');
    await page.locator('[data-testid="login-submit"]').click();

    await expect(page).toHaveURL(/\/catalog/, { timeout: 15000 });
    await expect(page.locator('[data-testid="catalog-page"]')).toHaveAttribute(
      'data-interactive',
      'true',
      { timeout: 15000 }
    );
    await expect(page.locator('[data-testid="catalog-row"]').first()).toBeVisible();

    await page.locator('[data-testid="catalog-add-to-cart"]').first().click();
    await page.locator('[data-testid="header-cart-link"]').click();
    await expect(page).toHaveURL(/\/cart/, { timeout: 15000 });

    await expect(page.locator('[data-testid="cart-table"]')).toBeVisible();
    await page.locator('[data-testid="proceed-to-checkout"]').click();

    await expect(page).toHaveURL(/\/cart\/checkout/, { timeout: 15000 });
    await expect(page.locator('[data-testid="checkout-form"]')).toBeVisible();
    await expect(page.locator('[data-testid="confirm-order"]')).toBeEnabled({ timeout: 15000 });

    const createOrderResponse = page.waitForResponse(
      (response) =>
        response.url().includes('/api/storefront/orders') &&
        response.request().method() === 'POST'
    );

    await page.locator('[data-testid="confirm-order"]').click();

    const response = await createOrderResponse;
    expect(response.ok()).toBeTruthy();
    const payload = await response.json();
    const orderNumber = payload?.data?.order?.orderNumber as string | undefined;

    expect(orderNumber).toBeTruthy();

    await expect(page).toHaveURL(/\/account\/orders/, { timeout: 15000 });
    const ordersTable = page.locator('[data-testid="orders-table"]');
    await expect(ordersTable).toBeVisible();

    const createdOrderRow = ordersTable.locator('tbody tr').filter({
      hasText: orderNumber ?? ''
    });

    await expect(createdOrderRow).toHaveCount(1);
    await expect(createdOrderRow).toContainText(/pending/i);
  });
});
