import { test, expect } from '@playwright/test';

test.describe('E2E Admin Backoffice Journey', () => {
  test('Friday Payout Engine -> Orders Fulfillment -> Unit Economics', async ({ page }) => {
    // 1. Visit Admin Backoffice
    await page.goto('/admin');

    // 2. Verify Backoffice Navigation & Title
    await expect(page.locator('text=Admin Backoffice').first()).toBeVisible();

    // 3. Verify Friday Payout Engine section
    const payoutHeading = page.locator('text=Friday Payout Batch Engine').first();
    await expect(payoutHeading).toBeVisible();

    // 4. Verify Payout Execution Button & Export CSV options
    await expect(page.locator('text=BCA').first()).toBeVisible();
    await expect(page.locator('text=Mandiri').first()).toBeVisible();

    // 5. Navigate to Orders & Fulfillment
    await page.goto('/admin/orders');
    await expect(page.locator('text=Manajemen Pesanan').first()).toBeVisible();

    // 6. Navigate to Simulator Unit Economics
    await page.goto('/admin/economics');
    await expect(page.locator('text=Simulator Unit Economics').first()).toBeVisible();
  });
});
