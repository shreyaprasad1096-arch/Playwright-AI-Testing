import { expect, test } from '@playwright/test';

const defaultBaseUrl = 'https://valentinos-magic-beans.click';
const productName = 'Brazilian Santos';
const productPrice = '$22.99';
const shippingPrice = '$5.99';
const totalPrice = '$28.98';

const baseUrl =  process.env.BASE_URL ?? defaultBaseUrl;

test.describe('Valentino\'s Magic Beans checkout', () => {
  test('guest user can add a Brazilian coffee to the cart and place a valid order', async ({ page }) => {
    await page.goto(`${baseUrl}/products`);

    await expect(page.getByRole('heading', { name: 'Our Coffee Collection' })).toBeVisible();
    await expect(page.getByRole('heading', { name: productName })).toBeVisible();

    await page.getByRole('button', { name: 'Add to Cart' }).first().click();
    await expect(page.getByRole('status').filter({ hasText: 'Added to Cart' }).first()).toBeVisible();

    await page.locator('a[href="/cart"]').click();
    await expect(page.getByRole('heading', { name: 'Your Cart' })).toBeVisible();
    await expect(page.getByRole('heading', { name: productName })).toBeVisible();

    const summary = page.locator('div').filter({ has: page.getByRole('heading', { name: 'Order Summary' }) }).first();
    await expect(summary).toContainText(productName);
    await expect(summary).toContainText(productPrice);
    await expect(summary).toContainText(shippingPrice);
    await expect(summary).toContainText(totalPrice);

    await page.locator('a[href="/checkout"]').click();
    await expect(page).toHaveURL(/\/checkout$/);

    await page.getByLabel('First Name').fill('Guest');
    await page.getByLabel('Last Name').fill('User');
    await page.getByLabel('Email').fill('guest@example.com');
    await page.getByLabel('Address').fill('123 Coffee Street');
    await page.getByLabel('City').fill('Sao Paulo');
    await page.getByLabel('ZIP Code').fill('01000');
    await page.getByLabel('Country').fill('Brazil');
    await page.getByLabel('Name on Card').fill('Guest User');
    await page.getByLabel('Card Number').fill('4824 6424 1424 2479');
    await page.getByLabel('Expiry (MM/YY)').fill('12/35');
    await page.getByLabel('CVC').fill('123');

    await page.getByRole('button', { name: 'Place Order' }).click();

    await expect(page).toHaveURL(/\/order-confirmation/);
    await expect(page.getByText('Thank you for your purchase. Your order has been placed successfully.')).toBeVisible();
    await expect(page.getByText('Your Order ID is:')).toBeVisible();
    const orderId = await page.locator('text=Your Order ID is:').locator('..').locator('p').nth(1).textContent();
    const orderEmail = await page.getByText('A confirmation email will be sent to').textContent();

    expect(orderId).toBeTruthy();
    expect(orderEmail).toContain('guest@example.com');

    const statusLink = page.getByRole('link', { name: 'Track Your Order' });
    await expect(statusLink).toBeVisible();
    await statusLink.click();
    await expect(page.getByRole('heading', { name: /contact/i })).toBeVisible();
  });
});
