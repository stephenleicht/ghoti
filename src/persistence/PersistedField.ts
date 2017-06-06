import constants from './constants';

type PersistedFieldOptions = {
    type: any
}

export type FieldMeta = {
    type: any,
    isID: boolean,
};

export type FieldMetaMap = {
    [key: string]: FieldMeta
}

export function addTypeMeta(target: any, propertyKey: string, type: any, isID: boolean) {
        const currentMetaData = <FieldMetaMap>Reflect.getMetadata(constants.FIELD_META_KEY, target);

        const newMeta = {
            ...currentMetaData,
            [propertyKey]: {
                type,
                isID,
            }
        };

        Reflect.defineMetadata(constants.FIELD_META_KEY, newMeta, target)
}

export default function PersistedField(options?: PersistedFieldOptions): PropertyDecorator {
    return (target: any, propertyKey: string) => {
        let type = Reflect.getMetadata('design:type', target, propertyKey);

        type = type || (options && options.type);

        addTypeMeta(target.constructor, propertyKey, type, false);
    }
}