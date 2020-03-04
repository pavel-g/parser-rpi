import { BrowserWrapper } from "./browser-wrapper";

export const AUTH_URL = 'https://informes.dnrpi.jus.gob.ar/sipel/Account/Login';
export const AUTH_LOGIN = '7445gvalmadre17863199';
export const AUTH_PASSWORD = 'Lucia235?';
export const LOGIN_SELECTOR = '#username';
export const PASSWORD_SELECTOR = '#password';
export const LOGIN_BUTTON_SELECTOR = '#iniciarSesion';

export async function auth(browser: BrowserWrapper): Promise<void> {
	const page = await browser.getPage();
	await page.goto(AUTH_URL);
	await page.waitForSelector(LOGIN_SELECTOR);
	await page.focus(LOGIN_SELECTOR);
	await page.keyboard.type(AUTH_LOGIN);
	await page.focus(PASSWORD_SELECTOR);
	await page.keyboard.type(AUTH_PASSWORD);
	await page.click(LOGIN_BUTTON_SELECTOR);
}