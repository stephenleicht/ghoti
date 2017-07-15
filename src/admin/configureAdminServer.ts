import * as path from "path";
import * as express from 'express';

import getMarkup from "./getMarkup";

import { Ghoti } from "../Ghoti";
import { GhotiOptions } from '../GhotiOptions';

export function configureAdminServer(config: GhotiOptions) {
    const router = express.Router();

    const jsPath = path.resolve(__dirname, './client');
    router.use('/js', express.static(jsPath));
    router.use('/generated', express.static(config.tempDir));

    router.get('*', (req, res) => {
        res.send(getMarkup())
    })

    return router;
}