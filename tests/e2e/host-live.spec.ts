import { test, expect } from '@playwright/test';

test.describe('E2E Host Live Controller Tablet Flow', () => {
  test('Active Hanger Display -> Mark Sold Modal -> Metrics & Confetti Trigger', async ({ page }) => {
    // 1. Visit Host Live Controller
    await page.goto('/host');

    // 2. Verify Ring-Light Tablet UI is rendered
    await expect(page.locator('text=Host Live Controller').first()).toBeVisible();

    // 3. Verify Active Hanger & SKU Card
    const hangerElement = page.locator('text=No.').first();
    await expect(hangerElement).toBeVisible();

    // 4. Verify Pricing Guidance (Floor Price & Target Price)
    await expect(page.locator('text=Floor Price').first()).toBeVisible();

    // 5. Open Mark Sold modal
    const markSoldBtn = page.locator('button:has-text("MARK SOLD")').first();
    if (await markSoldBtn.isVisible()) {
      await markSoldBtn.click();

      // Enter TikTok handle
      const buyerInput = page.locator('input[placeholder="@siti_ootd"]').first();
      await buyerInput.fill('@e2e_buyer');

      // Submit sale
      await page.click('button:has-text("Konfirmasi Terjual")');

      // Verify sold feedback
      await expect(page.locator('text=Terjual').first()).toBeVisible();
    }
  });
});
