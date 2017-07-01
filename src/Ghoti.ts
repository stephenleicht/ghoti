import 'reflect-metadata';
import * as express from 'express';

import { processMetaData } from './admin/bundler';
import { configureAdminServer } from "./admin/adminServer";

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

        const adminRouter = configureAdminServer(this);

        this.app.use('/ghoti', adminRouter);


        this.app.listen(port, () => {
            console.log(`Express server running on ${port}`)
        })
    }
}

export default new Ghoti();