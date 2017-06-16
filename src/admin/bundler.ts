import * as fs from 'fs';
import * as util from 'util';

import * as webpackRaw from 'webpack';

import {constants as modelConstants, ModelMeta} from '../model';

import getWebpackConfig from './getWebpackConfig';

const writeFile = util.promisify(fs.writeFile);
const webpack = util.promisify(webpackRaw);

const getRawBundlePath = (tempDir: string) => `${tempDir}/metaBundleRaw.js`;
const getPackedBundlePath = (tempDir: string) => `${tempDir}/ghotiMeta.bundle.js`;

function buildMetaFileString(metaData: ModelMeta[]): string {
    return `//Auto generated admin bundle file, do not manually edit.
        import 'reflect-metadata';
        ${metaData.map((meta) =>  `import ${meta.name} from'${meta.fileName}'`).join('\n')}

        window.__ghotiMeta__ = {
            models: {
                ${metaData.map(meta => `${meta.name}: ${meta.name}`).join('\n')}
            }
        }
    `;
}

async function generatePackedBundle(tempDir: string): Promise<boolean> {
    try {
        const stats = await webpack(getWebpackConfig(getRawBundlePath(tempDir), getPackedBundlePath(tempDir)));

         console.log(stats.toString());
        return true;
    }
    catch(err) {
        console.error(err.stack);
        return false;
    }
}

export async function processMetaData(models: any[], tempDir: string): Promise<boolean> {
    const metaData: ModelMeta[] = models.map(model => Reflect.getMetadata(modelConstants.MODEL_META_KEY, model.prototype.constructor));

    const metaFileString = buildMetaFileString(metaData);

    try {
        await writeFile(getRawBundlePath(tempDir), metaFileString);

        await generatePackedBundle(tempDir);
        return true;
    }
    catch(err) {
        console.error(err.stack);
        return false;
    }


}