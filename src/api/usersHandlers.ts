import { Request, Response } from 'express';

import {
    createEntityHandler,
    getEntityListHandler,
    getEntityByIDHandler,
    updateEntityHandler,
    deleteEntityByIDHandler
} from './entityHandlers';

import User from '../auth/User';
import authManager from '../auth/AuthManager';

export async function createUserHandler(req: Request, res: Response) {
    req.body.passwordHash = await authManager.createPasswordHash(req.body.password);
    req.body.email = req.body.email.toLowerCase();
    createEntityHandler(User, req, res);
}

export async function updateUserHandler(req: Request, res: Response) {
    updateEntityHandler(User, req, res);
}

export async function getUsersListHandler(req: Request, res: Response) {
    getEntityListHandler(User, req, res);
}

export async function getUserByIDHandler(req: Request, res: Response) {
    getEntityByIDHandler(User, req, res);
}

export async function deleteUserByIDHandler(req: Request, res: Response) {
    const reqWithUser = req as Request & {user: User};
    
    if(reqWithUser.user.id === req.params.id) {
        res.status(403);
        res.send(JSON.stringify({
            message: "You cannot delete your own user."
        }));
        return;
    }
    else {
        deleteEntityByIDHandler(User, req, res);
    }
}