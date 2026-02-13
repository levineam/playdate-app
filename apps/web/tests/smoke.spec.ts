import { test, expect } from '@playwright/test';

test.describe('Homepage smoke tests', () => {
  test('homepage loads successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check that the page loads without errors
    await expect(page).toHaveTitle(/Next\.js/);
    
    // Check that main content is visible
    await expect(page.locator('h1')).toContainText('To get started, edit the page.tsx file');
    
    // Check that the Next.js logo is present
    await expect(page.locator('img[alt="Next.js logo"]')).toBeVisible();
    
    // Check that deploy button is present and clickable
    await expect(page.locator('a', { hasText: 'Deploy Now' })).toBeVisible();
  });

  test('navigation and links work', async ({ page }) => {
    await page.goto('/');
    
    // Check that external links are properly formed
    const deployButton = page.locator('a', { hasText: 'Deploy Now' });
    await expect(deployButton).toHaveAttribute('href', /vercel.com/);
    await expect(deployButton).toHaveAttribute('target', '_blank');
    
    const docsButton = page.locator('a', { hasText: 'Documentation' });
    await expect(docsButton).toHaveAttribute('href', /nextjs.org/);
    await expect(docsButton).toHaveAttribute('target', '_blank');
  });
});