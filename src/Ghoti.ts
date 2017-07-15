import 'reflect-metadata';
import * as mongoose from 'mongoose';
import { Application } from 'express';

import createExpressApp from './server/createExpressApp';
import { processMetaData } from './admin/bundler';
import { GhotiOptions } from './GhotiOptions';


export class Ghoti {
    static defaultOptions = {
        models: [],
        port: 3000,
        tempDir: '/tmp/ghoti',
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
        const { tempDir, models, port } = this.configuration;

        mongoose.connect('mongodb://localhost:27017/ghoti');

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