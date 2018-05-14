import {ComponentClass, ComponentType} from 'react';
import {FormElementProps} from '../admin/client/forms/FormElement';
import { TaggedUnionMeta } from './Field';

export interface FieldMeta {
    type: any,
    arrayOf?: any
    
    isID: boolean,
    editable: boolean,
    required: boolean,

    possibleValues?: {[key: string]: string},
    Component?: ComponentType<FormElementProps>,
    componentProps?: {[key: string]: any},

    taggedUnion?: TaggedUnionMeta,
    
    validators?: {
        [key: string]: [string, (value: any) => boolean]
    },
};