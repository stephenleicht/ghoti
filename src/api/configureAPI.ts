import * as express from 'express';
import { omit } from 'lodash';

import { Ghoti } from '../Ghoti';
import { ModelMeta } from '../model/PersistedField';
import getIDKey from '../model/getIDKey';
import { save, update, findByID, find, deleteByID } from '../persistence/EntityManager';

import { createLogger } from '../logging';

const logger = createLogger('configureAPI');

type ModelsByName = {
    [modelName: string]: {
        modelMeta: ModelMeta,
        type: any
    }
}

interface RequestWithModel extends express.Request {
    model: {
        modelMeta: ModelMeta,
        type: any
    }
}

export default function configureAPI(ghoti: Ghoti) {
    const models = ghoti.configuration.models;

    const modelsByName: ModelsByName = models.reduce((agg, model) => {
        const modelMeta: ModelMeta = model.modelMeta;
        if (!modelMeta) {
            logger.warn('Could not find modelMeta field on registered model.', { model });
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
        if (!model) {
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
        catch (err) {
            logger.error(err.stack);
        }

        res.send(JSON.stringify(instance));
    });

    router.put('/models/:model/:id', async (req: RequestWithModel, res) => {
        try {
            const { type, modelMeta } = req.model;
            const instance = await findByID(req.model.type, req.params.id);
            if(!instance) {
                res.sendStatus(404);
            }

            const idKey = getIDKey(modelMeta);

            const toUpdate = omit(req.body, idKey);
            Object.assign(instance, toUpdate);
            await save(instance);
            res.send(JSON.stringify(instance));
        }
        catch (err) {
            res.status(500);
            res.send(err);
        }
    })

    router.get('/models/:model', async (req: RequestWithModel, res) => {
        try {
            const instances = await find(req.model.type, {});
            res.send(JSON.stringify(instances));
        }
        catch (err) {
            res.status(500);
            res.send(err);
        }
    })

    router.get('/models/:model/:id', async (req: RequestWithModel, res) => {
        try {
            const instance = await findByID(req.model.type, req.params.id);

            res.send(JSON.stringify(instance));
        }
        catch (err) {
            res.status(500);
            res.send(err);
        }
    })

    router.delete('/models/:model/:id', async (req: RequestWithModel, res) => {
        try {
            const result = await deleteByID(req.model.type, req.params.id);

            res.send(JSON.stringify({result}));
        }
        catch(err) {
            res.status(500);
            res.send(err);
        }
    })

    return router;

}