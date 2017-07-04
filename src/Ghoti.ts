import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';

import { processMetaData } from './admin/bundler';
import { configureAdminServer } from "./admin/configureAdminServer";
import configureAPI from './api/configureAPI';


import { GhotiOptions } from './GhotiOptions';


export class Ghoti {
    static defaultOptions = {
        models: [],
        port: 3000,
        tempDir: '/tmp/ghoti',
    };

    configuration: GhotiOptions
    private app: express.Application

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
        catch(err) {
            console.log(err.stack);
        }

        // Consolidate all model metadata,
        // build admin bundle from model metadata
        // Start server, listening on port from configuration
        
        this.app = express();

        this.app.use(bodyParser.json());

        const adminRouter = configureAdminServer(this);
        const apiRouter = configureAPI(this);

        this.app.use('/admin', adminRouter);
        this.app.use('/api', apiRouter);


        this.app.listen(port, () => {
            console.log(`Express server running on ${port}`)
        })
    }
}

export default new Ghoti();