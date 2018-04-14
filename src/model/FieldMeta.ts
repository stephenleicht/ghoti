import {ComponentClass} from 'react';
import {FormElementProps} from '../admin/client/forms/FormElement';

export interface FieldMeta {
    type: any,
    
    isID: boolean,
    editable: boolean,
    required: boolean,

    possibleValues?: {[key: string]: string},
    Component?: ComponentClass<FormElementProps>,
    componentProps?: {[key: string]: any},
    
    validators?: {
        [key: string]: [string, (value: any) => boolean]
    },
};