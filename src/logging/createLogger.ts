import * as winston from 'winston';

export default function createLogger(moduleName: string) {
    return new winston.Logger({
        transports: [
            new winston.transports.Console({
                formatter(options) {
                    // TODO: Date string
                    const metaString = Object.keys(options.meta).length > 0 ? JSON.stringify(options.meta) : ''
                    return `[${moduleName}] ${options.level.toUpperCase()} - ${options.message} ${metaString}`;
            }})
        ]
    })
}