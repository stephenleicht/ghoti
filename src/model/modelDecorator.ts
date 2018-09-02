import { pick, toPlainObject } from 'lodash';
import * as stackTrace from 'stack-trace';
import * as pluralize from 'pluralize';

import getIDKey from './getIDKey';
import { ModelMeta } from './ModelMeta';

import constants from './constants';

export type ModelType<T extends {new(...args:any[]):{}}> = T & {
    modelMeta: ModelMeta
}

export default function Model() {
    return function modelDecorator<T extends {new(...args:any[]):{}}>(target: T) : ModelType<T> {
        const rawModelMeta: ModelMeta = Reflect.getOwnMetadata(constants.MODEL_META_KEY, target) || {};
        const parentModelMeta: ModelMeta = target.prototype.constructor && target.prototype.constructor.modelMeta || {};
    
        const modelMeta = {
            fields: {
                ...parentModelMeta.fields,
                ...rawModelMeta.fields,
            }
        } as ModelMeta
        
        //TODO: Find the first file that isn't part of reflect-metadata, this seems like it could be pretty brittle.
        modelMeta.fileName = stackTrace.get()[3].getFileName();
        modelMeta.name = target.name.toLowerCase();
        modelMeta.namePlural = pluralize.plural(modelMeta.name).toLowerCase();
        modelMeta.idKey = getIDKey(modelMeta);

        Object.assign(target, {
            modelMeta
        });

        return target as ModelType<T>;
    }
}