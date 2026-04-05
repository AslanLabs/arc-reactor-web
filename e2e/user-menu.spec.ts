import { test, expect } from '@playwright/test'

test.describe('User Menu', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.goto('/')
    await expect(page.locator('.LoginPage-card')).toBeVisible()

    // Login with demo account
    await page.locator('.LoginPage-demoBtn').click()
    await expect(page.locator('.ChatArea')).toBeVisible({ timeout: 10_000 })
  })

  test('1. User avatar is visible in header after login', async ({ page }) => {
    const avatar = page.locator('.UserMenu-avatar')
    await expect(avatar).toBeVisible()
  })

  test('2. Clicking avatar opens dropdown with profile info', async ({ page }) => {
    await page.locator('.UserMenu-trigger').click()
    const dropdown = page.locator('.UserMenu-dropdown')
    await expect(dropdown).toBeVisible()

    // Profile info should be displayed
    await expect(page.locator('.UserMenu-name')).toBeVisible()
    await expect(page.locator('.UserMenu-email')).toBeVisible()
    await expect(page.locator('.UserMenu-role')).toBeVisible()
  })

  test('3. Clicking outside closes dropdown', async ({ page }) => {
    await page.locator('.UserMenu-trigger').click()
    await expect(page.locator('.UserMenu-dropdown')).toBeVisible()

    // Click outside
    await page.locator('.Header-title').click()
    await expect(page.locator('.UserMenu-dropdown')).not.toBeVisible()
  })

  test('4. Logout returns to login page', async ({ page }) => {
    await page.locator('.UserMenu-trigger').click()
    await page.locator('.UserMenu-item--danger').click()

    // Should be back on login page
    await expect(page.locator('.LoginPage-card')).toBeVisible({ timeout: 5_000 })

    // Token should be cleared
    const token = await page.evaluate(() => localStorage.getItem('arc-reactor-auth-token'))
    expect(token).toBeFalsy()
  })
})
