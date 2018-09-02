import constants from './constants';
import { ModelMeta } from './ModelMeta';
import { FieldMeta } from './FieldMeta';
import { createTaggedUnionMeta } from './TaggedUnion';
import { createArrayOfMeta } from './ArrayOf';
import { createReferenceMeta } from './Reference';
import { createPrimitiveMeta } from './Primitive';
import { createEnumOfMeta } from './EnumOf';

import requiredValidator from '../validation/required';
import { GhotiType } from './GhotiType';

export type FieldDecoratorOptions = Partial<FieldMeta>

const defaultOptions = {
    required: false,
    editable: true,
} as FieldDecoratorOptions

export type FieldDecoratorType = ((options?: FieldDecoratorOptions) => PropertyDecorator) & {
    taggedUnion: typeof createTaggedUnionMeta,
    arrayOf: typeof createArrayOfMeta,
    enumOf: typeof createEnumOfMeta,
    reference: typeof createReferenceMeta,
    primitive: typeof createPrimitiveMeta,
}

export function addTypeMeta(target: any,
    propertyKey: string | symbol,
    options: FieldMeta) {
    const modelMeta = <ModelMeta>Reflect.getOwnMetadata(constants.MODEL_META_KEY, target) || {};

    const newMeta = {
        ...modelMeta.fields,
        [propertyKey]: {
            ...options
        }
    };

    modelMeta.fields = newMeta;

    Reflect.defineMetadata(constants.MODEL_META_KEY, modelMeta, target)
}


function Field(options: FieldDecoratorOptions = defaultOptions): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        let reflectedType = Reflect.getMetadata('design:type', target, propertyKey);

        let inferedType: GhotiType;

        if (reflectedType.modelMeta) {
            inferedType = createReferenceMeta(reflectedType);
        }
        else {
            inferedType = createPrimitiveMeta(reflectedType);
        }

        let {
            type = inferedType,
            possibleValues,
            Component,
            componentProps,
            required = false,
            validators = {},
            editable = true,
        } = options || {} as FieldDecoratorOptions;

        if (required) {
            validators.required = requiredValidator
        }

        addTypeMeta(target.constructor, propertyKey, {
            type,
            possibleValues,
            Component,
            componentProps,
            required,
            editable,
            validators,
            isID: false,
        });
    }
}

const helpers = {
    taggedUnion: createTaggedUnionMeta,
    arrayOf: createArrayOfMeta,
    enumOf: createEnumOfMeta,
    reference: createReferenceMeta,
    primitive: createPrimitiveMeta,
}

Object.assign(Field, helpers)

export default Field as FieldDecoratorType;