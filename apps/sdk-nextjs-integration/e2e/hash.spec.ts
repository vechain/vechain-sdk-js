import { test, expect } from '@playwright/test';
import {
  Blake2b256,
  Keccak256,
  Sha256,
  Txt
} from '@vechain/sdk-core/dist/index.mjs';

test('Hash example', async ({ page }) => {
  await page.goto("/");

  const hashLink = page.getByTestId('hash-link');

  // Expect link to be visible
  await expect(hashLink).toBeVisible();

  // Click on link
  await hashLink.click();

  // Enter content to hash
  const content = "SDK is awesome! :)";
  const hashInput = page.getByTestId('contentToHash');
  await hashInput.clear();
  await hashInput.fill(content);

  // Expect hash component to be visible with expected text
  const blake2bHash = page.getByTestId('blake2b256HashLabel');
  const keccak256Hash = page.getByTestId('keccak256HashLabel');
  const sha256Hash = page.getByTestId('sha256HashLabel');
  await expect(blake2bHash).toBeVisible();
  await expect(keccak256Hash).toBeVisible();
  await expect(sha256Hash).toBeVisible();

  // Assert hash value for blake2b256
  const expectedBlake2b256Hash = Blake2b256.of(Txt.of(content).bytes)
  await expect(blake2bHash).toContainText('Blake2b256');
  await expect(blake2bHash).toContainText(expectedBlake2b256Hash.toString());

  // Assert hash value for keccak256
  const expectedKeccak256Hash = Keccak256.of(Txt.of(content).bytes)
  await expect(keccak256Hash).toContainText('Keccak256');
  await expect(keccak256Hash).toContainText(expectedKeccak256Hash.toString());

  // Assert hash value for sha256
  const expectedSha256Hash = Sha256.of(Txt.of(content).bytes)
  await expect(sha256Hash).toContainText('Sha256');
  await expect(sha256Hash).toContainText(expectedSha256Hash.toString());
});