import { expect, test } from '@playwright/test';

test.describe('Clockwork Tyres pricing and registration plans', () => {
  test('home pricing reflects George plan structures for retailers and wholesalers', async ({ page }) => {
    await page.goto('/');

    const retailerStarterCard = page.locator('[data-testid="pricing-card-retailer-starter"]');
    const retailerPlusCard = page.locator('[data-testid="pricing-card-retailer-plus"]');
    const retailerEnterpriseCard = page.locator('[data-testid="pricing-card-retailer-enterprise"]');

    await expect(retailerStarterCard).toContainText('Starter');
    await expect(retailerStarterCard).toContainText('Access to 3 suppliers');
    await expect(retailerStarterCard).toContainText('24/7 Live inventory and ordering');
    await expect(retailerStarterCard).toContainText('FREE');

    await expect(retailerPlusCard).toContainText('Plus');
    await expect(retailerPlusCard).toContainText('Add Unlimited Suppliers');
    await expect(retailerPlusCard).toContainText('Manage and showcase on hand inventory');
    await expect(retailerPlusCard).toContainText('199 AED/Month');

    await expect(retailerEnterpriseCard).toContainText('Enterprise');
    await expect(retailerEnterpriseCard).toContainText('Customer Analytics');
    await expect(retailerEnterpriseCard).toContainText('Custom pricing');

    await page.locator('[data-testid="pricing-audience-supplier"]').click();

    const supplierStarterCard = page.locator('[data-testid="pricing-card-supplier-starter"]');
    const supplierPremiumCard = page.locator('[data-testid="pricing-card-supplier-premium"]');
    const supplierEnterpriseCard = page.locator('[data-testid="pricing-card-supplier-enterprise"]');

    await expect(supplierStarterCard).toContainText('Starter');
    await expect(supplierStarterCard).toContainText('24/7 Live inventory and order portal');
    await expect(supplierStarterCard).toContainText('Inventory and product management admin');

    await expect(supplierPremiumCard).toContainText('Premium');
    await expect(supplierPremiumCard).toContainText('Retail sales portal');
    await expect(supplierPremiumCard).toContainText('Procurement module');
    await expect(supplierPremiumCard).toContainText('199 AED/Month');

    await expect(supplierEnterpriseCard).toContainText('Enterprise');
    await expect(supplierEnterpriseCard).toContainText('Customer Analytics');
    await expect(supplierEnterpriseCard).toContainText('Custom pricing');
  });

  test('register page reflects selected plan audience and enterprise guidance', async ({ page }) => {
    await page.goto('/register?mode=supplier&plan=premium');

    await expect(page.locator('[data-testid="register-account-mode-supplier"]')).toBeChecked();
    await expect(page.locator('[data-testid="register-plan-select"]')).toHaveValue('premium');
    await expect(page.locator('[data-testid="register-plan-note"]')).toContainText(/retail sales portal/i);

    await page.goto('/register?mode=both&plan=premium&enterprise=1');

    await expect(page.locator('[data-testid="register-account-mode-both"]')).toBeChecked();
    await expect(page.locator('[data-testid="register-plan-select"]')).toHaveValue('premium');
    await expect(page.locator('[data-testid="enterprise-guidance"]')).toContainText('configured manually');
  });
});
