import { BrowserWrapper } from "./browser-wrapper";
import { Page } from "puppeteer";

export const MATRICULA3_REG_EXP = /(\w+)-(\w+)\/(\w+)/;

export const MATRICULA2_REG_EXP = /(\w+)-(\w+)/;

export const FIELD1_SELECTOR = '#MatriculaCircunscripcion';

export const FIELD2_SELECTOR = '#Matricula';

export const FIELD3_SELECTOR = '#Unidad';

export class Matricula {
	
	protected parts: string[];
	
	public static createFromString(value: string): Matricula|null {
		const parts = value.match(MATRICULA3_REG_EXP) || value.match(MATRICULA2_REG_EXP);
		if (parts) {
			parts.splice(0, 1);
			return new Matricula(parts);
		}
		return null;
	}
	
	constructor(parts: string[]) {
		if (parts.length !== 2 && parts.length !== 3) {
			throw new Error('Не допустимое значение');
		}
		this.parts = parts;
	}
	
	async fillPage(browser: BrowserWrapper): Promise<void> {
		const page: Page = await browser.getPage();
		await page.waitForSelector(FIELD1_SELECTOR);
		
		// await page.type(FIELD1_SELECTOR, '');
		
		await page.focus(FIELD1_SELECTOR);
		// await page.keyboard.press('Backspace');
		await page.evaluate((selector) => {
			document.querySelector(selector).value = "";
		}, FIELD1_SELECTOR);
		
		await page.type(FIELD1_SELECTOR, this.parts[0]);
		await page.type(FIELD2_SELECTOR, this.parts[1]);
		if (this.parts[2]) {
			await page.type(FIELD3_SELECTOR, this.parts[2]);
		}
		await page.screenshot({path: 'after-fill-matricula.png'}); /* DEBUG */
	}
	
}