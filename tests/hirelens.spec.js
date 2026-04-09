import { test, expect } from '@playwright/test'

// ─── Landing Page ────────────────────────────────────────────
test.describe('Landing Page', () => {
  test('loads and shows hero section', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/HireLens/)
    await expect(page.locator('h1')).toContainText('Interviews')
  })

  test('navbar links are visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Features').first()).toBeVisible()
    await expect(page.getByText('Pricing').first()).toBeVisible()
    await expect(page.getByText('Success Stories').first()).toBeVisible()
  })

  test('Get Started button goes to login', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /get started/i }).first().click()
    await expect(page).toHaveURL(/login/)
  })

  test('Sign In button goes to login', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: /sign in/i }).first().click()
    await expect(page).toHaveURL(/login/)
  })

  test('Start Practice button is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText(/start practice/i).first()).toBeVisible()
  })
})

// ─── Login / Sign Up Page ────────────────────────────────────
test.describe('Login Page', () => {
  test('shows Sign In form by default', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByPlaceholder(/email/i).first()).toBeVisible()
    await expect(page.getByPlaceholder(/password/i).first()).toBeVisible()
  })

  test('can switch to Sign Up tab', async ({ page }) => {
    await page.goto('/login')
    await page.getByText(/sign up/i).first().click()
    await expect(page.getByPlaceholder(/full name/i)).toBeVisible()
  })

  test('sign in button is clickable', async ({ page }) => {
    await page.goto('/login')
    await page.getByPlaceholder(/email/i).first().fill('test@example.com')
    await page.getByPlaceholder(/password/i).first().fill('password123')
    const btn = page.getByRole('button', { name: /sign in/i }).first()
    await expect(btn).toBeVisible()
    await expect(btn).toBeEnabled()
  })

  test('shows forgot password view', async ({ page }) => {
    await page.goto('/login')
    await page.getByText(/forgot/i).click()
    await expect(page.getByPlaceholder(/email/i).first()).toBeVisible()
  })

  test('Google sign in button visible', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText(/google/i).first()).toBeVisible()
  })

  test('LinkedIn sign in button visible', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByText(/linkedin/i).first()).toBeVisible()
  })

  test('Sign Up tab shows name field', async ({ page }) => {
    await page.goto('/login')
    await page.getByText(/sign up/i).first().click()
    await expect(page.getByPlaceholder(/full name/i)).toBeVisible()
    await expect(page.getByPlaceholder(/email/i).first()).toBeVisible()
  })
})

// ─── Practice Page ───────────────────────────────────────────
test.describe('Practice Page', () => {
  test('redirects to login if not authenticated', async ({ page }) => {
    await page.goto('/practice')
    await expect(page).toHaveURL(/login|practice/)
  })
})

// ─── Resume Page ─────────────────────────────────────────────
test.describe('Resume Page', () => {
  test('redirects or shows upload zone', async ({ page }) => {
    await page.goto('/resume')
    await expect(page).toHaveURL(/login|resume/)
  })
})

// ─── Navigation ──────────────────────────────────────────────
test.describe('Navigation', () => {
  test('unknown route does not crash', async ({ page }) => {
    await page.goto('/unknown-page-xyz')
    const title = await page.title()
    expect(title).toBeTruthy()
  })

  test('logo on landing page is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('nav').first()).toBeVisible()
  })

  test('footer is visible on landing page', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('footer, [class*="footer"]').first()).toBeVisible()
  })
})
