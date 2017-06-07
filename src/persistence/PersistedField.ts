import constants from './constants';

type PersistedFieldOptions = {
    type: any
}

export type FieldMeta = {
    type: any,
    isID: boolean,
};

export type ModelMeta = {
    fileName: string,
    fields: {[key: string]: FieldMeta}
}

export function addTypeMeta(target: any, propertyKey: string, type: any, isID: boolean) {
        const modelMeta = <ModelMeta>Reflect.getMetadata(constants.MODEL_META_KEY, target) || {};

        const newMeta = {
            ...modelMeta.fields,
            [propertyKey]: {
                type,
                isID,
            }
        };

        modelMeta.fields = newMeta;

        Reflect.defineMetadata(constants.MODEL_META_KEY, modelMeta, target)
}

export default function PersistedField(options?: PersistedFieldOptions): PropertyDecorator {
    return (target: any, propertyKey: string) => {
        let type = Reflect.getMetadata('design:type', target, propertyKey);

        type = type || (options && options.type);

        addTypeMeta(target.constructor, propertyKey, type, false);
    }
}