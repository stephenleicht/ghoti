import { Router } from 'express';
import * as passport from 'passport';

import { GhotiOptions } from '../GhotiOptions';

import { configureAdminServer } from "../admin/configureAdminServer";
import configureAPI from '../api/configureAPI';

export default async function configureRoutes(config: GhotiOptions): Promise<Router> {
    const router = Router();
    const adminRouter = await configureAdminServer(config);
    const apiRouter = configureAPI(config);

    router.use('/admin', adminRouter);
    router.use('/api', apiRouter);

    return router;
}