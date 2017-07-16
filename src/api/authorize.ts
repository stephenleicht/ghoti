import { Request, Response, NextFunction } from 'express';

export default function authorize(req: Request, res: Response, next: NextFunction){
    if(!req.isAuthenticated()) {
        res.sendStatus(401);
        return;
    }

    next();
}