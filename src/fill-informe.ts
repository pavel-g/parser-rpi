import { BrowserWrapper } from "./browser-wrapper";
import { Page } from "puppeteer";
import { Matricula } from "./matricula";
import { AUTH_LOGIN } from "./auth";
import { CaptchaFiller } from "./fill-captcha";

export const DESTINO_INPUT_FIELD_SELECTOR = '#Destino';

export const SOLICITANTE_ID_FIELD_SELECTOR = '#SolicitanteId';

export const POPUP_PANEL_SELECTOR = '#popup_panel';

export const POPUP_OK_BUTTON_SELECTOR = '#popup_ok';

export const SEND_BUTTON_SELECTOR = '#solicitar';

export const InformeDataDestinationsValues = [
	'Contrato de locación',
	'boleta de compra venta',
	'adjuntar a un expediente',
	'futuro juicio ejecutivo',
	'futuro juicio sucesorio',
];

export type InformeData = {
	destination: string,
	matricula: string
};

export async function fillInforme(browser: BrowserWrapper, params: InformeData) {
	
	const page: Page = await browser.getPage();
	
	await page.waitForSelector(DESTINO_INPUT_FIELD_SELECTOR);
	
	if (InformeDataDestinationsValues.indexOf(params.destination) < 0) {
		throw new Error('Не верное значение destination');
	}
	await page.type(DESTINO_INPUT_FIELD_SELECTOR, params.destination);
	
	const matricula = Matricula.createFromString(params.matricula);
	if (!matricula) {
		throw new Error('Не верный формат matricula');
	}
	await matricula.fillPage(browser);
	
	const solicitanteIdFieldSelectorValue = AUTH_LOGIN;
	await page.select(SOLICITANTE_ID_FIELD_SELECTOR, solicitanteIdFieldSelectorValue);
	
	const captchaFiller = new CaptchaFiller(browser);
	await captchaFiller.fillPage();
	
	await page.screenshot({path: 'after-fill-informe.png'}); /* DEBUG */
	
	await page.click(SEND_BUTTON_SELECTOR);
	
	await page.waitForSelector(POPUP_OK_BUTTON_SELECTOR);
	await page.click(POPUP_OK_BUTTON_SELECTOR);
	
}