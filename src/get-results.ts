import { BrowserWrapper } from "./browser-wrapper";
import { Page } from "puppeteer";

export const DOWNLOAD_BUTTON_SELECTOR = '#menu > li > a';

export const DOWNLOAD_BUTTON_XPATH = '/html/body/div[2]/div/div/div/fieldset/div[3]/ul/li/a';

export const ENTRADA_REGEXP = /Entrada=(\w+)&/;

export const DOWNLOAD_BUTTON_TITLE = 'Descargar Trámite';

export type ResultData = {
	entrada: string,
	docUrl: string
};

export async function getResults(browser: BrowserWrapper): Promise<ResultData> {
	
	const page: Page = await browser.getPage();
	
	await page.screenshot({path: 'before-send-final-result.png'});
	
	await page.waitForXPath(DOWNLOAD_BUTTON_XPATH);
	
	const pageUrl = page.url();
	const regExpRes = pageUrl.match(ENTRADA_REGEXP);
	let entrada: string|null = null;
	if (regExpRes) {
		entrada = regExpRes[1];
	}
	
	const docUrl = await page.evaluate((selector, buttonText) => {
		const elements = document.querySelectorAll(selector);
		let button;
		elements.forEach((el) => {
			if (el.text === buttonText) {
				button = el;
			}
		});
		return button ? button.href : '';
	}, DOWNLOAD_BUTTON_SELECTOR, DOWNLOAD_BUTTON_TITLE);
	
	return {
		entrada: entrada,
		docUrl: docUrl
	};
}