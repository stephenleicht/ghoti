import { Router } from 'express';
import * as passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import { GhotiOptions } from '../GhotiOptions';
import { createLogger } from '../logging';
import authManager from '../auth/AuthManager';
import User from '../auth/User';
import entityManager from '../persistence/EntityManager';

import {
    getModelParamHandler,
    createModelHandler,
    getModelListHandler,
    getModelByIDHandler,
    updateModelHandler,
    deleteModelByIDHandler,
} from './modelHandlers';

import {
    getUsersListHandler,
    getUserByIDHandler,
    createUserHandler,
    deleteUserByIDHandler,
    updateUserHandler,
} from './usersHandlers';

import authorize from './authorize';

const logger = createLogger('configureAPI');

passport.serializeUser(function (user: User, done) {
    done(null, user.id);
});

passport.deserializeUser(async function (userID: string, done) {
    const user = await entityManager.findByID(User, userID);

    if(!user) {
        done("Invalid user id");
    }
    else {
        done(null, user);
    }
});

function configureAuthentication() {
    passport.use(new LocalStrategy(
        async function (email, password, done) {
            logger.info('Authenticating user: %s', email);
           const result: User | null = await authManager.authenticateUser(email, password);
            
            if(!result) {
                logger.info("Authentication failed, invalid username or password: %s", email);
                done("Invalid Username or Password");
            }
            else {
                logger.info("Authentication successful: {}, email");
                done(null, result);
            }
        }
    ));
}

export default function configureAPI(config: GhotiOptions): Router {
    const models = config.models;

    const router = Router();

    configureAuthentication()

    router.post('/login',
        passport.authenticate('local'),
        (req, res) => {
            res.send(JSON.stringify(req.user));
        }
    );
    router.get('/auth/session', authorize, (req, res) => {
        const sessionInfo = {
            id: req.sessionID,
            user: req.user
        };

        res.send(JSON.stringify(sessionInfo));
    })

    router.get('/users', getUsersListHandler);
    router.post('/users', createUserHandler);
    router.get('/users/:id', getUserByIDHandler);
    router.put('/users/:id', updateUserHandler);
    router.delete('/users/:id', deleteUserByIDHandler);

    // router.use('/models*', authorize);
    router.param('model', getModelParamHandler(models));
    router.post('/models/:model', createModelHandler);
    router.get('/models/:model', getModelListHandler);
    router.get('/models/:model/:id', getModelByIDHandler);
    router.put('/models/:model/:id', updateModelHandler)
    router.delete('/models/:model/:id', deleteModelByIDHandler)

    return router;

}