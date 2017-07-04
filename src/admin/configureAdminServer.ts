import * as path from "path";
import * as express from 'express';

import getMarkup from "./getMarkup";

import { Ghoti } from "../Ghoti";

export function configureAdminServer(ghoti: Ghoti) {
    const router = express.Router();

    const jsPath = path.resolve(__dirname, './client');
    router.use('/js', express.static(jsPath));
    router.use('/generated', express.static(ghoti.configuration.tempDir));

    router.get('*', (req, res) => {
        res.send(getMarkup())
    })

    return router;
}