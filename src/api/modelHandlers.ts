import { Request, Response, NextFunction, RequestHandler } from 'express';
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

    return (req: Request, res: Response, next: NextFunction) => {
        const model = modelsByName[req.params.model.toLowerCase()];
        if (!model) {
            res.sendStatus(404);
            return;
        }

        (req as RequestWithModel).model = model;
        next();
    }
}

export async function createModelHandler(req: Request, res: Response) {
    try {
        const modelReq = req as RequestWithModel;
        const savedInstance = await entityManager.save(modelReq.model, req.body);
        res.send(JSON.stringify(savedInstance))
    }
    catch (err) {
        logger.error(err.stack);
        res.status(500);
        res.send(undefined);
    }

    
}

export async function updateModelHandler(req: Request, res: Response) {
    try {
        const modelReq = req as RequestWithModel;
        const instance = await entityManager.updateByID(modelReq.model, modelReq.params.id, modelReq.body);
        res.send(JSON.stringify(instance));
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
}

export async function getModelListHandler(req: Request, res: Response) {
    try {
        const modelReq = req as RequestWithModel;
        const instances = await entityManager.find(modelReq.model.type, {});
        res.send(JSON.stringify(instances));
    }
    catch (err) {
        res.status(500);
        res.send(err);
        logger.error(err.stack);
    }
}

export async function getModelByIDHandler(req: Request, res: Response) {
    try {
        const modelReq = req as RequestWithModel;
        const instance = await entityManager.findByID(modelReq.model.type, modelReq.params.id);

        res.send(JSON.stringify(instance));
    }
    catch (err) {
        res.status(500);
        res.send(err);
        logger.error(err.stack);
    }
}

export async function deleteModelByIDHandler(req: Request, res: Response) {
    try {
        const modelReq = req as RequestWithModel;
        const result = await entityManager.deleteByID(modelReq.model, modelReq.params.id);

        res.send(JSON.stringify({ result }));
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
}