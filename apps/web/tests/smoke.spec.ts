import { test, expect } from '@playwright/test';

const NEXT_STARTER_STRING = 'To get started, edit the page.tsx file.';

test.describe('Homepage smoke tests', () => {
  test('homepage loads and shows Playdate branding (not Next starter)', async ({ page }) => {
    await page.goto('/');

    // Title should be app-specific
    await expect(page).toHaveTitle(/Playdate/i);

    // Explicitly fail if the default Next.js starter content is present
    await expect(page.locator('body')).not.toContainText(NEXT_STARTER_STRING);

    // App-specific assertions
    await expect(page.locator('h1')).toContainText(/Playdate/i);
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible();
  });

  test('sign-in link routes to /auth', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('body')).not.toContainText(NEXT_STARTER_STRING);

    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/auth$/);
    await expect(page.locator('body')).toContainText(/Welcome to Playdate/i);
  });

  test('auth page always shows the magic-link send action', async ({ page }) => {
    await page.goto('/auth');

    const magicLinkButton = page.getByRole('button', { name: /send magic link/i });
    await expect(magicLinkButton).toBeVisible();

    // In preview/test environments without Supabase env vars we keep the action visible
    // and show a clear status message explaining why sending is unavailable.
    await expect(page.getByText(/temporarily unavailable in this preview environment/i)).toBeVisible();
  });
});
