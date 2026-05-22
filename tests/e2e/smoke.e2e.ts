import { expect, test } from '@playwright/test'

test.describe('Home page', () => {
  test('loads with 200 and shows hero', async ({ page }) => {
    const response = await page.goto('/')
    expect(response?.status()).toBe(200)

    await expect(page).toHaveTitle(/Adam Fuhriman/)
    await expect(page.getByRole('heading', { name: 'Adam Fuhriman', level: 1 })).toBeVisible()
  })

  test('renders all five new Skills tags', async ({ page }) => {
    await page.goto('/')

    const skillsSection = page.locator('section#skills')
    await skillsSection.scrollIntoViewIfNeeded()

    for (const tag of ['Azure', 'Istio', 'Terramate', 'Azure DevOps', 'OpenTelemetry']) {
      await expect(skillsSection.getByText(tag, { exact: true }).first()).toBeVisible()
    }
  })

  test('navbar anchor links scroll to and activate sections', async ({ page }) => {
    await page.goto('/')

    const sections = ['about', 'philosophy', 'skills', 'experience', 'contact']

    for (const id of sections) {
      // Scope to the desktop nav `<div class="inner">` — the mobile panel
      // (#mobile-nav-panel) duplicates every link in the DOM at all viewports.
      const link = page.locator(`nav > div:not(#mobile-nav-panel) a[href="#${id}"]`)
      await link.click()
      await expect(page).toHaveURL(new RegExp(`#${id}$`))

      const section = page.locator(`section#${id}`)
      await expect(section).toBeInViewport()

      // Active state is signalled via a CSS-module hashed class containing "active".
      await expect(link).toHaveClass(/active/, { timeout: 5000 })
    }
  })
})

test.describe('How I Built This page', () => {
  test('loads with 200 and shows heading', async ({ page }) => {
    const response = await page.goto('/how-its-built')
    expect(response?.status()).toBe(200)

    await expect(page.getByRole('heading', { name: 'How I Built This', level: 1 })).toBeVisible()
  })
})
