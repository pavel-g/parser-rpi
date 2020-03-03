import { BrowserWrapper } from "./browser-wrapper";
import { Page, Browser } from "puppeteer";
import axios from 'axios';
import { Config } from "./config";

export const CAPTCHA_SELECTOR = '#CaptchaSolicitarInforme5';

export const CAPTCHA_VALUE_FIELD_SELECTOR = '#CodigoImagen';

export class CaptchaFiller {
	
	constructor(protected browser: BrowserWrapper) {}
	
	public async fillPage(): Promise<void> {
		const page: Page = await this.browser.getPage();
		// const url = await this.getImageUrl(CAPTCHA_SELECTOR);
		// console.log('===> url', url); /* DEBUG */
		// const img = await this.downloadImage(url);
		const captchaElement = await page.$(CAPTCHA_SELECTOR);
		const img = await captchaElement.screenshot({encoding: 'base64', path: 'captcha.png'});
		console.log('===> img', img); /* DEBUG */
		const text = await this.parseCaptcha(img);
		console.log('===> text', text); /* DEBUG */
		await page.type(CAPTCHA_VALUE_FIELD_SELECTOR, text);
	}
	
	protected async getImageUrl(selector: string): Promise<string> {
		const page: Page = await this.browser.getPage();
		return await page.evaluate((selector) => {
			return document.querySelector(selector).src;
		}, selector);
	}
	
	protected async downloadImage(url: string): Promise<string> {
		const resp = await axios.get(url, {responseType: 'arraybuffer'});
		return Buffer.from(resp.data, 'binary').toString('base64');
	}
	
	protected async parseCaptcha(img: string): Promise<string|null> {
		const taskReq = {
			clientKey: Config.antiCaptcha.key,
			task: {
				type: 'ImageToTextTask',
				body: img,
			},
		};
		console.log('===> send request to anti-captcha', taskReq); /* DEBUG */
		const taskResp = await axios.post('https://api.anti-captcha.com/createTask', taskReq);
		console.log('===> response from anti-captcha', taskResp); /* DEBUG */
		if (taskResp.data.errorId !== 0) {
			throw new Error('Не удалось передать задание на anti-captcha');
		}
		const taskId = taskResp.data.taskId;
		return await this.waitParseCaptchaRes(taskId);
	}
	
	protected waitParseCaptchaRes(taskId: number): Promise<string|null> {
		
		const promise = new Promise<any>((success, failure) => {
			let attempt = 0
			
			const start = () => {
				setTimeout(() => {
					attempt++;
					if (attempt > Config.antiCaptcha.countOfAttempts) {
						failure(new Error('Превышено число попыток'));
						return;
					}
					this.getTaskResult(taskId).then((res) => {
						if (res !== null) {
							success(res);
						} else {
							start();
						}
					}).catch(start);
				}, Config.antiCaptcha.timeout);
			};
			
			start();
		});
		
		return promise;
		
	}
	
	protected async getTaskResult(taskId: number): Promise<string|null> {
		const resp = await axios.post('https://api.anti-captcha.com/getTaskResult', {
			clientKey: Config.antiCaptcha.key,
			taskId: taskId
		});
		if (resp.data.errorId !== 0) {
			console.error(
				'Ошибка при расшифровке капчи',
				resp.data.errorCode,
				resp.data.errorDescription
			);
			return null;
		}
		if (resp.data.status !== 'ready') {
			return null;
		}
		return resp.data.solution.text;
	}
	
}