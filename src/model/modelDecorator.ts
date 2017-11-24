import { pick, toPlainObject } from 'lodash';
import * as stackTrace from 'stack-trace';
import * as pluralize from 'pluralize';

import getIDKey from './getIDKey';
import { ModelMeta } from './ModelMeta';

import constants from './constants';

export default function Model() {
    return function modelDecorator(target: any): any {
        const modelMeta: ModelMeta = Reflect.getMetadata(constants.MODEL_META_KEY, target.prototype.constructor);

        //TODO: Find the first file that isn't part of reflect-metadata, this seems like it could be pretty brittle.
        modelMeta.fileName = stackTrace.get()[3].getFileName();
        modelMeta.name = target.prototype.constructor.name.toLowerCase();
        modelMeta.namePlural = pluralize.plural(modelMeta.name).toLowerCase();
        modelMeta.idKey = getIDKey(modelMeta);
        modelMeta.refFields = [];

        target.modelMeta = modelMeta;

        return target;
    }
}