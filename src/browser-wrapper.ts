import puppeteer, { Browser, Page } from 'puppeteer-core';
import { Config } from './config';

export class BrowserWrapper {
	
	protected browser: Browser;
	
	protected page: Page;
	
	public async getBrowser(): Promise<Browser> {
		if (!this.browser) {
			this.browser = await puppeteer.launch({
				executablePath: Config.browser,
				defaultViewport: Config.defaultViewport
			});
		}
		return this.browser;
	}
	
	public async getPage(): Promise<Page> {
		if (!this.page) {
			const browser = await this.getBrowser();
			this.page = await browser.newPage();
		}
		return this.page;
	}
	
}

export const browserWrapper = new BrowserWrapper();