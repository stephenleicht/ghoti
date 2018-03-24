import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session';
import * as passport from 'passport';


import { GhotiOptions } from '../GhotiOptions';
import configureRoutes from './configureRoutes';

export default async function createExpressApp(config: GhotiOptions): Promise<express.Express> {
    const app = express();

    app.use(cookieParser());
    app.use(bodyParser.json());
    app.use(session({ 
        secret: 'some super cool secret',
        resave: false,
        saveUninitialized: false,
    }));
    app.use(passport.initialize());
    app.use(passport.session());    

    app.use(await configureRoutes(config));

    return app;
}