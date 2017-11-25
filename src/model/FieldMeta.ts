import {ComponentClass} from 'react';
import {FormElementProps} from '../admin/client/forms/FormElement';

export type FieldMeta = {
    type: any,
    isID: boolean,
    editable: boolean,
    possibleValues?: {[key: string]: string},
    Component?: ComponentClass<FormElementProps>,
    componentProps?: {[key: string]: any}
};