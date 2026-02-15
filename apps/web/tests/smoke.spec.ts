import { test, expect } from '@playwright/test'

const NEXT_STARTER_STRING = 'To get started, edit the page.tsx file.'

test.describe('Homepage smoke tests', () => {
  test('homepage loads and shows Playdate branding (not Next starter)', async ({ page }) => {
    await page.goto('/')

    // Title should be app-specific
    await expect(page).toHaveTitle(/Playdate/i)

    // Explicitly fail if the default Next.js starter content is present
    await expect(page.locator('body')).not.toContainText(NEXT_STARTER_STRING)

    // App-specific assertions
    await expect(page.locator('h1')).toContainText(/Playdate/i)
    await expect(page.getByRole('link', { name: 'Sign in' })).toBeVisible()
  })

  test('sign-in link routes to /auth', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).not.toContainText(NEXT_STARTER_STRING)

    await page.getByRole('link', { name: 'Sign in' }).click()
    await expect(page).toHaveURL(/\/auth$/)
    await expect(page.locator('body')).toContainText(/Welcome to Playdate/i)
  })

  test('auth page exposes preview continue path when magic-link auth is unavailable', async ({ page }) => {
    await page.goto('/auth')

    const magicLinkButton = page.getByRole('button', { name: /send magic link/i })
    await expect(magicLinkButton).toBeVisible()
    await expect(page.getByText(/temporarily unavailable in this preview environment/i)).toBeVisible()

    const continueButton = page.getByRole('link', { name: /continue in preview mode/i })
    await expect(continueButton).toBeVisible()
    await continueButton.click()

    await expect(page).toHaveURL(/\/dashboard\?mode=preview$/)
    await expect(page.getByTestId('preview-mode-banner')).toContainText(/preview mode active/i)
  })

  test('dashboard redirects to auth when preview session is missing', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/auth$/)
  })
})
