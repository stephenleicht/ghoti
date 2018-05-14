import { Request, Response, NextFunction } from 'express';

export default function authorize(req: Request, res: Response, next: NextFunction){
    if(!req.isAuthenticated()) {
        res.status(401);
        res.send(JSON.stringify({
            message: 'Unauthorized',
        }))
        return;
    }

    next();
}