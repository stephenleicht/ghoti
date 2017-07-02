import constants from './constants';

type PersistedFieldOptions = {
    type: any
}

export type FieldMeta = {
    type: any,
    isID: boolean,
    editable: boolean,
};

export type ModelMeta = {
    name: string,
    fileName: string,
    fields: {[key: string]: FieldMeta}
}

export function addTypeMeta(target: any, propertyKey: string, type: any, isID: boolean, editable: boolean) {
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

export default function PersistedField(options?: PersistedFieldOptions): PropertyDecorator {
    return (target: any, propertyKey: string) => {
        let type = Reflect.getMetadata('design:type', target, propertyKey);

        type = type || (options && options.type);

        addTypeMeta(target.constructor, propertyKey, type, false, true);
    }
}