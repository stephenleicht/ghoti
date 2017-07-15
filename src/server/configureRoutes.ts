import { Router } from 'express';
import * as passport from 'passport';

import { GhotiOptions } from '../GhotiOptions';

import { configureAdminServer } from "../admin/configureAdminServer";
import configureAPI from '../api/configureAPI';

export default function configureRoutes(config: GhotiOptions) {
    const router = Router();
    const adminRouter = configureAdminServer(config);
    const apiRouter = configureAPI(config);

    router.use('/admin', adminRouter);
    router.use('/api', apiRouter);

    return router;
}