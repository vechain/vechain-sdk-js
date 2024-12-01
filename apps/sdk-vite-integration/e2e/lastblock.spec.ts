import { test, expect } from '@playwright/test';

test('Latest block example', async ({ page }) => {
    await page.goto("/");

    const latestBlockLink = page.getByTestId('latest-block-link');

    // Expect link to be visible
    await expect(latestBlockLink).toBeVisible();

    // Click on link
    await latestBlockLink.click();

    // Click get last block button
    const getLastBlockButton = page.getByTestId('getlastblock');
    await expect(getLastBlockButton).toBeVisible();
    await getLastBlockButton.click();

    // Assert last block details
    const lastBlockDetails = page.getByTestId('last-block-details');
    await expect(lastBlockDetails).toBeVisible();
    await expect(lastBlockDetails).toContainText('number');
    await expect(lastBlockDetails).toContainText('id');
});