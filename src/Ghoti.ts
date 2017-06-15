import { processMetaData } from './admin/bundler';

import { GhotiOptions } from './GhotiOptions';


class Ghoti {
    static defaultOptions = {
        models: [],
        port: 3000,
        tempDir: '/tmp/ghoti',
    };

    private configuration: GhotiOptions

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
        console.log('RUN!')
    }
}

export default new Ghoti();