import {ComponentClass} from 'react';
import constants from './constants';
import { ModelMeta } from './ModelMeta';
import { FormElementProps } from '../admin/client/forms/FormElement';

import { FieldMeta } from './FieldMeta';

export type FieldDecoratorOptions = Partial<FieldMeta>

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

export default function Field(options?: FieldDecoratorOptions): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        let reflectedType = Reflect.getMetadata('design:type', target, propertyKey);

        const {
            type = reflectedType,
            possibleValues,
            Component,
            componentProps,
            validators
        } = options || {} as FieldDecoratorOptions;

        addTypeMeta(target.constructor, propertyKey, {
            type,
            possibleValues,
            Component,
            componentProps,
            validators,
            isID: false, 
            editable: true,
        });
    }
}