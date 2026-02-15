import { expect, Page, test } from '@playwright/test'

const NEXT_STARTER_STRING = 'To get started, edit the page.tsx file.'
const DASHBOARD_PLACEHOLDER = 'Temporary dashboard placeholder for the preview-auth rollout.'

async function continueInPreviewMode(page: Page) {
  await page.goto('/auth')

  const continueButton = page.getByRole('link', { name: /continue in preview mode/i })
  await expect(continueButton).toBeVisible()
  await continueButton.click()

  await expect(page).toHaveURL(/\/dashboard\?mode=preview$/)
  await expect(page.getByTestId('preview-mode-banner')).toContainText(/preview mode active/i)
}

test.describe('Homepage smoke tests', () => {
  test('homepage loads and foregrounds availability-first flow (not Next starter)', async ({ page }) => {
    await page.goto('/')

    await expect(page).toHaveTitle(/Playdate/i)
    await expect(page.locator('body')).not.toContainText(NEXT_STARTER_STRING)

    await expect(page.getByRole('heading', { name: /say .*we're available.*one tap/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /we're available/i })).toBeVisible()
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

    await continueInPreviewMode(page)

    await expect(page.getByRole('heading', { name: /playdate dashboard/i })).toBeVisible()
    await expect(page.locator('body')).not.toContainText(DASHBOARD_PLACEHOLDER)
    await expect(page.getByTestId('availability-first-card')).toBeVisible()
    await expect(page.getByTestId('broadcast-availability-button')).toBeVisible()
  })

  test('one-tap availability broadcast sends to connected families and enforces cooldown', async ({ page }) => {
    await continueInPreviewMode(page)

    page.once('dialog', (dialog) => dialog.accept())
    await page.getByTestId('broadcast-availability-button').click()

    await expect(page.getByTestId('availability-status-message')).toContainText(
      /broadcast sent to 6 connected families/i
    )
    await expect(page.getByTestId('availability-history')).toContainText(/sent to 6 connected families/i)

    const broadcastButton = page.getByTestId('broadcast-availability-button')
    await expect(broadcastButton).toBeDisabled()
    await expect(broadcastButton).toContainText(/available again in/i)
  })

  test('optional detail prompt enriches availability broadcast', async ({ page }) => {
    await continueInPreviewMode(page)

    await page.getByTestId('toggle-availability-details').click()
    await expect(page.getByTestId('availability-details-form')).toBeVisible()

    await page.getByLabel('Time window').fill('Today 4:00–6:00 PM')
    await page.getByLabel('Location hint').fill('Riverside playground')
    await page.getByLabel('Message').fill('Noah can bring bikes.')

    page.once('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: /send detailed availability/i }).click()

    await expect(page.getByTestId('availability-status-message')).toContainText(
      /broadcast sent to 6 connected families with details/i
    )
    await expect(page.getByTestId('availability-history')).toContainText(/window: today 4:00–6:00 pm/i)
    await expect(page.getByTestId('availability-history')).toContainText(/location: riverside playground/i)
    await expect(page.getByTestId('availability-history')).toContainText(/note: noah can bring bikes/i)
  })

  test('dashboard redirects to auth when preview session is missing', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/auth$/)
  })
})
