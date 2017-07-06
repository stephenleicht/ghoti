import * as express from 'express';

import { Ghoti } from '../Ghoti';
import { ModelMeta } from '../model/PersistedField';
import { save } from '../persistence//EntityManager';

import { createLogger } from '../logging';

const logger = createLogger('configureAPI');

type ModelsByName = {
    [modelName: string]: {
        modelMeta: ModelMeta,
        type: any
    }
}

interface RequestWithModel extends express.Request {
    model:  {
        modelMeta: ModelMeta,
        type: any
    }
}

export default function configureAPI(ghoti: Ghoti) {
    const models = ghoti.configuration.models;

    const modelsByName: ModelsByName = models.reduce((agg, model) => {
        const modelMeta: ModelMeta = model.modelMeta;
        if (!modelMeta) {
            logger.warn('Could not find modelMeta field on registered model.', {model});
            return agg;
        }

        agg[modelMeta.namePlural.toLowerCase()] = {
            modelMeta,
            type: model,
        };
        return agg;
    }, {});

    const router = express.Router();

    router.param('model', (req: RequestWithModel, res, next) => {
         const model = modelsByName[req.params.model.toLowerCase()];
        if(!model) {
            res.sendStatus(404);
            return;
        }

        req.model = model;
        next();
    });

    router.post('/models/:model', async (req: RequestWithModel, res) => {
        const instance = new req.model.type(req.body);
        
        try {
            await save(instance);
        }
        catch(err) {
            logger.error(err.stack);
        }
    
        res.send(JSON.stringify(instance));
    });

    router.get('/models/:model/:id', async (req, res) => {
        const model = modelsByName[req.params.model];
        if(!model) {
            res.send(404);
            return;
        }
    })

    return router;

}