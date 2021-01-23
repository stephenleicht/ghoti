import * as hook from 'css-modules-require-hook';
import 'reflect-metadata';
import { MongoClient } from 'mongodb';
import { Application } from 'express';

import entityManager, { EntityManager } from './persistence/EntityManager';
import createExpressApp from './server/createExpressApp';
import { processMetaData } from './admin/bundler';
import { GhotiOptions } from './GhotiOptions';

import User from './auth/User';
import authManager from './auth/AuthManager';

import createLogger from './logging/createLogger';

hook({});

const logger = createLogger('Ghoti');


export class Ghoti {
    static defaultOptions: GhotiOptions = {
        models: [],
        port: 3000,
        tempDir: '/tmp/ghoti',
        mongoConnectionString: 'mongodb://localhost:27017/ghoti',
        username: 'ghoti',
        password: 'password'
    };

    configuration: GhotiOptions
    private app: Application

    configure(options: Partial<GhotiOptions>) {
        this.configuration = {
            ...Ghoti.defaultOptions,
            ...options,
        };
    }

    async run() {
        const { tempDir, models, port, mongoConnectionString } = this.configuration;

        logger.info('Starting ghoti...');
        try {
            const connectionResult = await entityManager.connect(mongoConnectionString);

            if (!connectionResult) {
                logger.info('Unable to connect to database');
                return;
            }

            await processMetaData(models, tempDir);

            await this.checkFirstUser();
        }
        catch (err) {
            console.log(err.stack);
        }

        this.app = await createExpressApp(this.configuration);

        this.app.listen(port, () => {
            console.log(`Express server running on ${port}`)
        })
    }

    private async checkFirstUser() {
        logger.info('Checking for first user');
        const isFirstUserCreated = await authManager.isFirstUserCreated();

        if(isFirstUserCreated) {
            logger.info('First user already created. Proceeding with startup.')
            return;
        }

        logger.info('Creating firt user');
        const firstUser = new User(this.configuration.username);
        firstUser.passwordHash = await authManager.createPasswordHash(this.configuration.password);

        try {
            await entityManager.save(User, firstUser);
            logger.info("First user created.");
        }
        catch(err) {
            logger.error("Error while creating first user: {}", err);
        }
    }
}

export default new Ghoti();