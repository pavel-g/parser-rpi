import { BrowserWrapper } from "./browser-wrapper";
import { Page } from "puppeteer";

export const BUTTON_SELECTOR = '#IngresoMinutaElectronica';

export async function gotoIngresoMinutaElectronica(browser: BrowserWrapper): Promise<void> {
	const page: Page = await browser.getPage();
	await page.waitForSelector(BUTTON_SELECTOR);
	await page.click(BUTTON_SELECTOR);
}
