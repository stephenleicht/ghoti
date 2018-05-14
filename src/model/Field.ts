import {ComponentClass} from 'react';
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

export type TaggedUnionMeta = {tagField: string, tagMap: {[key: string]: any}};

export type TaggedUnionHelper = (tagField: string, tagMap: {[key: string]: any}) => TaggedUnionMeta;

export function addTypeMeta(target: any,
                            propertyKey: string | symbol,
                            options: FieldMeta ) {
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

        const {
            type = reflectedType,
            possibleValues,
            Component,
            componentProps,
            required = false,
            validators = {},
            editable = true,
            arrayOf,
            taggedUnion,
        } = options || {} as FieldDecoratorOptions;

        if(required) {
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
            arrayOf,
            taggedUnion,
        });
    }
}

const FieldDecorator = (Field as any as FieldDecorator)

FieldDecorator.taggedUnion = (tagField, tagMap) => {
    return {
        tagField,
        tagMap
    }
}

export default FieldDecorator;