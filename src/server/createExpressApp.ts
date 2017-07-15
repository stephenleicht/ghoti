import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser'
import * as session from 'express-session';
import * as passport from 'passport';


import { GhotiOptions } from '../GhotiOptions';
import configureRoutes from './configureRoutes';

export default function createExpressApp(config: GhotiOptions) {
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

    app.use(configureRoutes(config));

    return app;
}