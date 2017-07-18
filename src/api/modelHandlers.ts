import { Request, Response, NextFunction } from 'express';
import { omit } from 'lodash';

import { ModelMeta } from '../model';
import getIDKey from '../model/getIDKey';
import { save, update, findByID, find, deleteByID } from '../persistence/EntityManager';
import { createLogger } from '../logging';

const logger = createLogger('modelHandlers');

type ModelsByName = {
    [modelName: string]: {
        modelMeta: ModelMeta,
        type: any
    }
}

export interface RequestWithModel extends Request {
    model: {
        modelMeta: ModelMeta,
        type: any
    }
}

export function getModelParamHandler(models: any[]) {
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

    return (req: RequestWithModel, res: Response, next: NextFunction) => {
        const model = modelsByName[req.params.model.toLowerCase()];
        if (!model) {
            res.sendStatus(404);
            return;
        }

        req.model = model;
        next();
    }
}

export async function createModelHandler(req: RequestWithModel, res: Response) {
    const instance = new req.model.type(req.body);

    try {
        await save(instance);
    }
    catch (err) {
        logger.error(err.stack);
    }

    res.send(JSON.stringify(instance));
}

export async function updateModelHandler(req: RequestWithModel, res: Response) {
    try {
        const { type, modelMeta } = req.model;
        const instance = await findByID(req.model.type, req.params.id);
        if (!instance) {
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
}

export async function getModelListHandler(req: RequestWithModel, res: Response) {
    try {
        const instances = await find(req.model.type, {});
        res.send(JSON.stringify(instances));
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
}

export async function getModelByIDHandler(req: RequestWithModel, res: Response) {
    try {
        const instance = await findByID(req.model.type, req.params.id);

        res.send(JSON.stringify(instance));
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
}

export async function deleteModelByIDHandler(req: RequestWithModel, res: Response) {
    try {
        const result = await deleteByID(req.model.type, req.params.id);

        res.send(JSON.stringify({ result }));
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
}