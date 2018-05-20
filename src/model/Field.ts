import { ComponentClass } from 'react';
import constants from './constants';
import { ModelMeta } from './ModelMeta';
import { FormElementProps } from '../admin/client/forms/FormElement';

import { FieldMeta } from './FieldMeta';

import requiredValidator from '../validation/required';

export type FieldDecoratorOptions = Partial<FieldMeta>

const defaultOptions = {
    required: false,
    editable: true,
} as FieldDecoratorOptions

export type FieldDecorator = PropertyDecorator & {
    taggedUnion: TaggedUnionHelper
}

export type TaggedUnionMeta = {
    __ghotiTaggedUnion: true,
    tagField: string,
    tagMap: { [key: string]: any } 
};

export type TaggedUnionHelper = (tagField: string, tagMap: { [key: string]: any }) => TaggedUnionMeta;

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

        let {
            type = reflectedType,
            possibleValues,
            Component,
            componentProps,
            required = false,
            validators = {},
            editable = true,
            arrayOf,
            enumOf,
            taggedUnion,
        } = options || {} as FieldDecoratorOptions;

        if (required) {
            validators.required = requiredValidator
        }

        if(arrayOf && arrayOf.__ghotiTaggedUnion){
            taggedUnion = arrayOf;
        }
        else if(type.__ghotiTaggedUnion) {
            taggedUnion = type;
        }

        if (enumOf && !possibleValues) {
            possibleValues = Object.entries(enumOf)
                .reduce((agg, [displayValue, key]) => {
                    agg[key] = displayValue;
                    return agg;
                }, {} as {[key: string]: string})
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
            arrayOf,
            enumOf,
            taggedUnion,
        });
    }
}

const FieldDecorator = (Field as any as FieldDecorator)

FieldDecorator.taggedUnion = (tagField, tagMap): TaggedUnionMeta => {
    return {
        __ghotiTaggedUnion: true,
        tagField,
        tagMap
    }
}

export default FieldDecorator;