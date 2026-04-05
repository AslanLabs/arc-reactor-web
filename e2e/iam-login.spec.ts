import { test, expect } from '@playwright/test'

test.describe('IAM & Demo Login', () => {
  test.beforeEach(async ({ page }) => {
    // Clear auth state
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.goto('/')
    await expect(page.locator('.LoginPage-card')).toBeVisible()
  })

  test('1. Demo Login button logs in successfully', async ({ page }) => {
    test.setTimeout(30_000)

    // Demo Login button should be visible
    const demoBtn = page.locator('.LoginPage-demoBtn')
    await expect(demoBtn).toBeVisible()
    await expect(demoBtn).toContainText('Demo Login')

    // Click Demo Login
    await demoBtn.click()

    // Should navigate to chat page (LoginPage disappears)
    await expect(page.locator('.LoginPage-card')).not.toBeVisible({ timeout: 10_000 })

    // Chat area should be visible
    await expect(page.locator('.ChatArea')).toBeVisible({ timeout: 5_000 })
  })

  test('2. IAM Login button is visible and requires credentials', async ({ page }) => {
    test.setTimeout(15_000)

    // IAM Login button should be visible
    const iamBtn = page.locator('.LoginPage-iamBtn')
    await expect(iamBtn).toBeVisible()
    await expect(iamBtn).toContainText('IAM Login')

    // Should be disabled without credentials
    await expect(iamBtn).toBeDisabled()

    // Fill email and password
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')

    // Should be enabled now
    await expect(iamBtn).toBeEnabled()
  })

  test('3. IAM Login performs token exchange', async ({ page }) => {
    test.setTimeout(30_000)

    // Register a fresh IAM account
    const email = `e2e-${Date.now()}@test.io`
    const password = 'E2eTest1234!'

    const registerRes = await page.request.post('/iam-api/auth/register', {
      data: { email, password, name: 'E2E Test' },
    })
    expect(registerRes.ok()).toBeTruthy()

    // Fill credentials and click IAM Login
    await page.fill('input[type="email"]', email)
    await page.fill('input[type="password"]', password)

    const iamBtn = page.locator('.LoginPage-iamBtn')
    await iamBtn.click()

    // Should navigate to chat page
    await expect(page.locator('.LoginPage-card')).not.toBeVisible({ timeout: 10_000 })
    await expect(page.locator('.ChatArea')).toBeVisible({ timeout: 5_000 })

    // Verify token exists in localStorage
    const token = await page.evaluate(() => localStorage.getItem('arc-reactor-auth-token'))
    expect(token).toBeTruthy()
    expect(token!.startsWith('eyJ')).toBeTruthy()
  })
})
