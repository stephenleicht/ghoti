import {ComponentClass} from 'react';
import constants from './constants';
import { ModelMeta } from './ModelMeta';
import { FormElementProps } from '../admin/client/forms/FormElement';

export type FieldOptions = {
    type?: any,
    possibleValues?: {[key: string]: string}
    Component?: ComponentClass<FormElementProps>,
    componentProps?: {[key: string]: any}
}

export type TypeMetaOptions = {
    type: any,
    isID: boolean,
    editable: boolean,
    possibleValues?: {[key: string]: string}
    Component?: ComponentClass<FormElementProps>,
    componentProps?: {[key: string]: any}
}

export function addTypeMeta(target: any,
                            propertyKey: string | symbol,
                            options: TypeMetaOptions ) {
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

export default function Field(options?: FieldOptions): PropertyDecorator {
    return (target: any, propertyKey: string | symbol) => {
        let reflectedType = Reflect.getMetadata('design:type', target, propertyKey);

        const {
            type = reflectedType,
            possibleValues = undefined,
            Component = undefined,
            componentProps = undefined,
        } = options || {};

        addTypeMeta(target.constructor, propertyKey, {
            type,
            possibleValues,
            Component,
            componentProps,
            isID: false, 
            editable: true,
        });
    }
}