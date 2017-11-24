import constants from './constants';
import { ModelMeta } from './ModelMeta';

export type FieldOptions = {
    type: any
}

export function addTypeMeta(target: any, propertyKey: string | symbol, type: any, isID: boolean, editable: boolean) {
        const modelMeta = <ModelMeta>Reflect.getMetadata(constants.MODEL_META_KEY, target) || {};

        const newMeta = {
            ...modelMeta.fields,
            [propertyKey]: {
                type,
                isID,
                editable,
            }
        };

        modelMeta.fields = newMeta;

        Reflect.defineMetadata(constants.MODEL_META_KEY, modelMeta, target)
}

export default function Field(options?: FieldOptions): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        let type = Reflect.getMetadata('design:type', target, propertyKey);

        type = type || (options && options.type);

        addTypeMeta(target.constructor, propertyKey, type, false, true);
    }
}