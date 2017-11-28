import * as hook from 'css-modules-require-hook';
import 'reflect-metadata';
import { MongoClient } from 'mongodb';
import { Application } from 'express';

import entityManager, { EntityManager } from './persistence/EntityManager';
import createExpressApp from './server/createExpressApp';
import { processMetaData } from './admin/bundler';
import { GhotiOptions } from './GhotiOptions';

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
        }
        catch (err) {
            console.log(err.stack);
        }

        this.app = createExpressApp(this.configuration);

        this.app.listen(port, () => {
            console.log(`Express server running on ${port}`)
        })
    }
}

export default new Ghoti();