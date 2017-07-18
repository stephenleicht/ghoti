import { pick } from 'lodash';
import * as pluralize from 'pluralize';

import { FieldMeta } from '../FieldMeta';
import { ModelMeta } from '../ModelMeta';

import constants from '../constants';

export default function Model() {
    return function modelDecorator<T extends new (...args: any[]) => {}>(target: T): T {
        const modelMeta: ModelMeta = Reflect.getMetadata(constants.MODEL_META_KEY, target.prototype.constructor);

        modelMeta.name = target.prototype.constructor.name;
        modelMeta.namePlural = pluralize.plural(modelMeta.name.toLowerCase());

        return class extends target {
            static modelMeta = modelMeta;
        };
    }
}
