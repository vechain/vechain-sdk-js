import { test, expect } from '@playwright/test';

test('Transfer logs example', async ({ page, baseURL }) => {
    await page.goto(baseURL || 'http://localhost:5173');

    const logsLink = page.getByTestId('transfers-link');

    // Expect link to be visible
    await expect(logsLink).toBeVisible();

    // Click on link
    await logsLink.click();

    // Enter details to get transfer logs
    const addressInput = page.getByTestId('address');
    const fromBlockInput = page.getByTestId('fromblock');
    const toBlockInput = page.getByTestId('toblock');
    await addressInput.clear();
    await addressInput.fill('0xc3bE339D3D20abc1B731B320959A96A08D479583');
    await fromBlockInput.clear();
    await fromBlockInput.fill('1');
    await toBlockInput.clear();
    await toBlockInput.fill('19251959');

    // expect logs table to be populated
    const tableRows = page.locator('css=[data-testid="logs-table"] tr');
    await expect(tableRows).toHaveCount(8);  // 8 rows in the table, this is a retryable assertion

});