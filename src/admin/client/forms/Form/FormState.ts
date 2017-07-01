import { FormFieldMeta } from './FormFieldMeta';

export interface FormState {
    value: {
        [key: string]: any
    },
    fields: {
        [fieldName: string]: FormFieldMeta
    }
}
