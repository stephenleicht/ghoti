import { ComponentType } from 'react';
import {FormElementProps} from '../admin/client/forms/formElement';
import { GhotiType } from './GhotiType';


export interface FieldMeta {
    type: GhotiType,
    
    isID: boolean,
    editable: boolean,
    required: boolean,
    
    possibleValues?: {[key: string]: string},
    Component?: ComponentType<FormElementProps<any>>,
    componentProps?: {[key: string]: any},
    
    validators?: {
        [key: string]: [string, (value: any) => boolean]
    },
};