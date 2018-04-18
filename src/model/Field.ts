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

export function addTypeMeta(target: any,
                            propertyKey: string | symbol,
                            options: FieldMeta ) {
        const modelMeta = <ModelMeta>Reflect.getMetadata(constants.MODEL_META_KEY, target) || {};

        const newMeta = {
            ...modelMeta.fields,
            [propertyKey]: {
                ...options
            }
        };

        modelMeta.fields = newMeta;

        Reflect.defineMetadata(constants.MODEL_META_KEY, modelMeta, target)
}

export default function Field(options: FieldDecoratorOptions = defaultOptions): PropertyDecorator {
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
            arrayOf
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
            arrayOf
        });
    }
}