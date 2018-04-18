import {ComponentClass, ComponentType} from 'react';
import {FormElementProps} from '../admin/client/forms/FormElement';

export interface FieldMeta {
    type: any,
    arrayOf?: any
    
    isID: boolean,
    editable: boolean,
    required: boolean,

    possibleValues?: {[key: string]: string},
    Component?: ComponentType<FormElementProps>,
    componentProps?: {[key: string]: any},
    
    validators?: {
        [key: string]: [string, (value: any) => boolean]
    },
};