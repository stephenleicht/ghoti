import 'reflect-metadata';
import * as mongoose from 'mongoose';
import { Application } from 'express';

import createExpressApp from './server/createExpressApp';
import { processMetaData } from './admin/bundler';
import { GhotiOptions } from './GhotiOptions';


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

        mongoose.connect(mongoConnectionString);

        try {
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