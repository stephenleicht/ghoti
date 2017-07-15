import * as express from 'express';

import { Ghoti } from '../Ghoti';
import { createLogger } from '../logging';

import {
    getModelParamHandler, 
    createModelHandler, 
    getModelListHandler, 
    getModelByIDHandler, 
    updateModelHandler, 
    deleteModelByIDHandler
} from './modelHandlers';

const logger = createLogger('configureAPI');

export default function configureAPI(ghoti: Ghoti) {
    const models = ghoti.configuration.models;

    const router = express.Router();

    router.param('model', getModelParamHandler(models));

    router.post('/models/:model', createModelHandler);
    router.get('/models/:model', getModelListHandler);
    router.get('/models/:model/:id', getModelByIDHandler);
    router.put('/models/:model/:id', updateModelHandler)
    router.delete('/models/:model/:id', deleteModelByIDHandler)

    return router;

}