import { Request, Response, NextFunction } from 'express';
import { omit } from 'lodash';

import { ModelMeta } from '../model';
import getIDKey from '../model/getIDKey';
import entityManager from '../persistence/EntityManager';
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
    try {
        const savedInstance = await entityManager.save(req.model, req.body);
        res.send(JSON.stringify(savedInstance))
    }
    catch (err) {
        logger.error(err.stack);
        res.status(500);
        res.send(undefined);
    }

    
}

export async function updateModelHandler(req: RequestWithModel, res: Response) {
    try {
        const instance = await entityManager.updateByID(req.model, req.params.id, req.body);
        res.send(JSON.stringify(instance));
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
}

export async function getModelListHandler(req: RequestWithModel, res: Response) {
    try {
        const instances = await entityManager.find(req.model.type, {});
        res.send(JSON.stringify(instances));
    }
    catch (err) {
        res.status(500);
        res.send(err);
        logger.error(err.stack);
    }
}

export async function getModelByIDHandler(req: RequestWithModel, res: Response) {
    try {
        const instance = await entityManager.findByID(req.model.type, req.params.id);

        res.send(JSON.stringify(instance));
    }
    catch (err) {
        res.status(500);
        res.send(err);
        logger.error(err.stack);
    }
}

export async function deleteModelByIDHandler(req: RequestWithModel, res: Response) {
    try {
        const result = await entityManager.deleteByID(req.model, req.params.id);

        res.send(JSON.stringify({ result }));
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
}