import AxeBuilder from '@axe-core/playwright'
import { test, expect } from '@playwright/test';
const url = process.env.PLAYWRIGHT_SERVER_HOST || 'http://127.0.0.1:8081'

test('The main heading on the page is <Start building with Contentful, no credit card required.> and is an h1 element', async ({ page }) => {
  await page.goto(url);

  const heading = await page.waitForSelector('h1')

  expect((await heading.textContent())?.trim(), 'Check that the only H1 on the page is the title that says "Start building with Contentful, no credit card required."').toMatch('Start building with Contentful, no credit card required.')
})

test('Clicking the login link opens a new tab to the contentful login page', async ({ page }) => {
  await page.goto(url);

  const openedInNewTabPromise = page.waitForEvent('popup')

  await page.getByText('Login').click()

  const openedInNewTab = await openedInNewTabPromise

  await openedInNewTab.waitForLoadState()

  expect(await openedInNewTab.title(), 'Check that clicking the Login link takes us to the Contentful Login page').toEqual('Log in - Contentful')
})

test('Clicking the Signup with Github redirects the user to the server github login', async ({ page }) => {
  await page.goto(url);

  await page.getByRole('link', { name: /Signup with Github/i }).click()

  await page.waitForURL(function (url) {
    if (url.origin === 'https://contentful-customers-api.up.railway.app') {
      return true
    }

    return false
  })
})

test('Clicking the Signup with Google redirects the user to the server google login', async ({ page }) => {
  await page.goto(url);

  await page.getByRole('link', { name: /Signup with Google/i }).click()

  await page.waitForURL(function (url) {
    if (url.origin === 'https://contentful-customers-api.up.railway.app') {
      return true
    }

    return false
  })
})

test('Check the form has a Full name field', async ({ page }) => {
  await page.goto(url);

  await expect(page.getByLabel('Full name'), 'Checking to find an input with the label of "Full name"').toBeVisible()
})

test('Check the form has a Company field', async ({ page }) => {
  await page.goto(url);

  await expect(page.getByLabel('Company'), 'Checking to find an input with the label of "Company"').toBeVisible()
})

test('Check the form has an Email field', async ({ page }) => {
  await page.goto(url);

  await expect(page.getByLabel('Email'), 'Checking to find an input with the label of "Email"').toBeVisible()
})

test('Check the form has a Job Title field', async ({ page }) => {
  await page.goto(url);

  await expect(page.getByLabel('Job Title'), 'Checking to find a select with the label of "Job Title"').toBeVisible()
})

test('Check the form has a Job Function field', async ({ page }) => {
  await page.goto(url);

  await expect(page.getByLabel('Job Function'), 'Checking to find a select with the label of "Job Function"').toBeVisible()
})

test('Check the form has a Password field', async ({ page }) => {
  await page.goto(url);

  await expect(page.getByLabel('Password'), 'Checking to find an input with the label of "Password"').toBeVisible()
})

test('Check the form can be filled correctly by customers and submitted successfully', async ({ page }) => {
  await page.goto(url);

  await page.getByLabel('Full name').fill('Skillyard Checker')
  await page.getByLabel('Company').fill('Skillyard Inc')

  await page.getByLabel('Email').fill('checker@skillyard.io')
  await page.getByLabel('Job Title').selectOption('Director')
  await page.getByLabel('Job Function').selectOption('HR')

  await page.getByLabel('Password').fill('xL3*&1223')

  await page.getByText('Sign up').click()

  await page.waitForURL(function (url) {
    if (url.origin === 'https://contentful-customers-api.up.railway.app') {
      return true
    }

    return false
  })
})

test('Should pass all automated accessibility checks', async ({page}) => {
  await page.goto(url);

  const accessibilityScanResults = await new AxeBuilder({ page }).disableRules('color-contrast').analyze()

  expect(accessibilityScanResults.violations).toEqual([])
})
