import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser'



import { GhotiOptions } from '../GhotiOptions';
import configureRoutes from './configureRoutes';

export default async function createExpressApp(config: GhotiOptions): Promise<express.Express> {
    const app = express();

    app.use(cookieParser());
    app.use(bodyParser.json());
    
    const routes = await configureRoutes(config)
    app.use(routes);

    return app;
}