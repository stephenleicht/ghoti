import 'reflect-metadata';
import * as express from 'express';

import { processMetaData } from './admin/bundler';
import { GhotiOptions } from './GhotiOptions';


class Ghoti {
    static defaultOptions = {
        models: [],
        port: 3000,
        tempDir: '/tmp/ghoti',
    };

    private configuration: GhotiOptions
    private app: express.Application

    configure(options: Partial<GhotiOptions>) {
        this.configuration = {
            ...Ghoti.defaultOptions,
            ...options,
        };
    }

    async run() {
        processMetaData(this.configuration.models, this.configuration.tempDir);
        // Consolidate all model metadata,
        // build admin bundle from model metadata
        // Start server, listening on port from configuration
        
        this.app = express();

        const router = express.Router();

        router.get('/', (req, res) => {
            res.send('Hello world')
        })

        this.app.use(router);

        this.app.listen(this.configuration.port, () => {
            console.log(`Express server running on ${this.configuration.port}`)
        })
    }
}

export default new Ghoti();