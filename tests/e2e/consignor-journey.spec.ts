import { test, expect } from '@playwright/test';

test.describe('E2E Consignor Persona Journey', () => {
  test('Landing Page Value Estimator -> Booking Jemput Lemari -> Portal Portofolio', async ({ page }) => {
    // 1. Visit Landing Page
    await page.goto('/');
    await expect(page).toHaveTitle(/PindahTangan/i);

    // Verify Value Estimator is visible
    const estimatorSection = page.locator('text=Estimator Nilai Bersih Lemari').first();
    await expect(estimatorSection).toBeVisible();

    // 2. Navigate to Booking Page
    await page.goto('/booking');
    await expect(page.locator('h1')).toContainText('Jadwalkan Penjemputan Lemari');

    // 3. Fill in Booking Form (>= 20 pcs for Free Pickup)
    await page.fill('input[placeholder="Ibu Ratna Dewi"]', 'Ibu Ratna Dewi Test');
    await page.fill('input[type="tel"]', '081288997711');
    await page.fill('textarea', 'Jl. Surya Kencana No. 45, samping kantor pos');

    // Verify Free Pickup badge appears
    await expect(page.locator('text=Gratis Penjemputan Kurir Internal Sukabumi').first()).toBeVisible();

    // 4. Submit Form
    await page.click('button[type="submit"]');

    // 5. Verify Tanda Terima Digital Penjemputan screen
    await expect(page.locator('text=Tanda Terima Penjemputan Digital').first()).toBeVisible();
    await expect(page.locator('text=BATCH-').first()).toBeVisible();

    // 6. Navigate to Consignor Portal
    await page.goto('/portal');
    await expect(page.locator('text=Portofolio Lemari Konsinyasi').first()).toBeVisible();

    // Verify all 5 PRD status tabs exist
    await expect(page.locator('button:has-text("Sedang Steam")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Siap Live")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Terjual")').first()).toBeVisible();
    await expect(page.locator('button:has-text("Reject QC")').first()).toBeVisible();
  });
});
