import { test, expect } from '@playwright/test';

test.describe('E2E Studio Operator OS Journey', () => {
  test('Intake Reception -> QC 3-Station -> Steaming & Hangtag Label', async ({ page }) => {
    // 1. Visit Studio Hub
    await page.goto('/studio');

    // Verify Studio Hub Header
    await expect(page.locator('text=Studio Sukabumi Hub').first()).toBeVisible();

    // Verify Intake & QC Station Modules are present
    const qcStation = page.locator('text=Stasiun QC 3-Titik & Cuci Uap').first();
    await expect(qcStation).toBeVisible();

    // Verify Tier category badges
    await expect(page.locator('text=Tier A').first()).toBeVisible();
    await expect(page.locator('text=Tier B').first()).toBeVisible();
    await expect(page.locator('text=Tier C').first()).toBeVisible();

    // Verify Hangtag Label Preview
    await expect(page.locator('text=Label Gantungan Display').first()).toBeVisible();
  });
});
