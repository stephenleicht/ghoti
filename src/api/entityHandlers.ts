import { Request, Response, NextFunction, RequestHandler } from 'express';
import { omit } from 'lodash';

import { ModelMeta } from '../model';
import getIDKey from '../model/getIDKey';
import entityManager from '../persistence/EntityManager';
import { createLogger } from '../logging';

import ValidationError from '../errors/ValidationError';

const logger = createLogger('entityHandlers');

// TODO: more robust error codes for the API

export async function createEntityHandler(model: any, req: Request, res: Response) {
    try {
        const savedInstance = await entityManager.save(model, req.body);
        res.send(JSON.stringify(savedInstance))
    }
    catch (err) {
        if (err instanceof ValidationError) {
            logger.info(err.message)
            res.status(400);
            res.send(JSON.stringify({
                error: true,
                result: err.result
            }))
        }
        else {
            logger.error(err.stack);
            res.status(500);
            res.send(undefined);
        }
    }


}

export async function updateEntityHandler(model: any, req: Request, res: Response) {
    try {
        const instance = await entityManager.updateByID(model, req.params.id, req.body);
        res.send(JSON.stringify(instance));
    }
    catch (err) {
        if (err instanceof ValidationError) {
            logger.info(err.message)
            res.status(400);
            res.send(JSON.stringify({
                error: true,
                result: err.result
            }))
        }
        else {
            res.status(500);
            res.send(err);
        }
    }
}

export async function getEntityListHandler(model: any, req: Request, res: Response) {
    try {
        const instances = await entityManager.find(model, {});
        res.send(JSON.stringify(instances));
    }
    catch (err) {
        res.status(500);
        res.send(err);
        logger.error(err.stack);
    }
}

export async function getEntityByIDHandler(model: any, req: Request, res: Response) {
    try {
        const instance = await entityManager.findByID(model, req.params.id);

        res.send(JSON.stringify(instance));
    }
    catch (err) {
        res.status(500);
        res.send(err);
        logger.error(err.stack);
    }
}

export async function deleteEntityByIDHandler(model: any, req: Request, res: Response) {
    try {
        const result = await entityManager.deleteByID(model, req.params.id);

        res.send(JSON.stringify({ result }));
    }
    catch (err) {
        res.status(500);
        res.send(err);
    }
}