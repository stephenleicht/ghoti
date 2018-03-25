import { Request, Response, NextFunction, RequestHandler } from 'express';
import { omit } from 'lodash';

import { ModelMeta } from '../model';
import getIDKey from '../model/getIDKey';
import entityManager from '../persistence/EntityManager';
import {
    createEntityHandler,
    getEntityListHandler,
    getEntityByIDHandler,
    updateEntityHandler,
    deleteEntityByIDHandler
} from './entityHandlers';

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
    const modelReq = req as RequestWithModel;
    createEntityHandler(modelReq.model, req, res);
}

export async function updateModelHandler(req: Request, res: Response) {
    const modelReq = req as RequestWithModel;
    updateEntityHandler(modelReq.model, req, res);
}

export async function getModelListHandler(req: Request, res: Response) {
    const modelReq = req as RequestWithModel;
    getEntityListHandler(modelReq.model.type, req, res);
}

export async function getModelByIDHandler(req: Request, res: Response) {
    const modelReq = req as RequestWithModel;
    getEntityByIDHandler(modelReq.model.type, req, res);
}

export async function deleteModelByIDHandler(req: Request, res: Response) {
    const modelReq = req as RequestWithModel;
    deleteEntityByIDHandler(modelReq.model, req, res);
}