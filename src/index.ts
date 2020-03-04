import express from 'express';
import { Request, Response } from 'express';
import { Config } from './config';
import { browserWrapper } from './browser-wrapper';
import { auth } from './auth';
import { gotoIngresoMinutaElectronica } from './goto-ingreso-minuta-electronica';
import { fillInforme, InformeData } from './fill-informe';
import bodyParser from 'body-parser';
import { getResults } from './get-results';

const app = express();

const port = Config.port;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req: Request, res: Response) => {
	const informeData: InformeData = {
		destination: req.body.destination,
		matricula: req.body.matricula
	};
	auth(browserWrapper)
		.then(() => gotoIngresoMinutaElectronica(browserWrapper))
		.then(() => fillInforme(browserWrapper, informeData))
		.then(() => getResults(browserWrapper))
		.then((result) => {
			console.log('done', result)
			res.send(result);
		});
});

app.listen(port, () => {
	console.log(`server started at http://localhost:${port}`);
});