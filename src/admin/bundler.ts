import * as fs from 'fs';
import * as util from 'util';

import * as webpackRaw from 'webpack';

import {constants as modelConstants, ModelMeta} from '../model';

import getWebpackConfig from './getWebpackConfig';

import { createLogger } from '../logging';

const logger = createLogger('bundler');


const writeFile = util.promisify(fs.writeFile);
const webpack = util.promisify(webpackRaw);

const getRawBundlePath = (tempDir: string) => `${tempDir}/metaBundleRaw.js`;
export const getMetaBundlePath = (tempDir: string) => `${tempDir}/ghotiMeta.bundle.js`;

function buildMetaFileString(metaData: ModelMeta[]): string {
    return `//Auto generated admin bundle file, do not manually edit.
        import 'reflect-metadata';
        ${metaData.map((meta) =>  `import ${meta.name} from'${meta.fileName}'`).join('\n')}

        window.__ghotiMeta__ = {
            models: {
                ${metaData.map(meta => `${meta.namePlural.toLowerCase()}: ${meta.name}`).join(',\n')}
            }
        }
    `;
}

async function generatePackedBundle(tempDir: string): Promise<boolean> {
    try {
        const webpackConfig = getWebpackConfig(getRawBundlePath(tempDir), getMetaBundlePath(tempDir));
        const stats = await webpack([webpackConfig]);

        return true;
    }
    catch(err) {
        console.error(err.stack);
        return false;
    }
}

export async function processMetaData(models: any[], tempDir: string): Promise<boolean> {
    const metaData: ModelMeta[] = models.map(model => model.modelMeta);

    logger.info('Processing model metadata');
    const metaFileString = buildMetaFileString(metaData);

    try {
        logger.info('Writing raw bundle to temp location', {tempDir});
        await writeFile(getRawBundlePath(tempDir), metaFileString);

        logger.info('Generating bundle with webpack...')
        await generatePackedBundle(tempDir);
        logger.info('Bundle generation complete.');
        return true;
    }
    catch(err) {
        console.error(err.stack);
        return false;
    }


}