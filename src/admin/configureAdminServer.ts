import * as path from "path";
import * as express from 'express';

import { getMarkupForAdminUI, getMarkupForInitPage } from "./getMarkup";

import { Ghoti } from "../Ghoti";
import { GhotiOptions } from '../GhotiOptions';

import authManager from '../auth/AuthManager';

import { createLogger } from '../logging';

const log = createLogger('configureAdminServer')

export async function configureAdminServer(config: GhotiOptions): Promise<express.Router> {
    const router = express.Router();

    const jsPath = path.resolve(__dirname, './client');
    router.use('/js', express.static(jsPath));
    router.use('/generated', express.static(config.tempDir));

    router.get('*', (req, res) => {
        res.send(getMarkupForAdminUI())
    })

    return router;
}

