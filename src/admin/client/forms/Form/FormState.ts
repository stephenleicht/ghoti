import { FormFieldMeta } from './FormFieldMeta';

export interface FormState {
    isValid: boolean,
    isPristine: boolean,
    value: {
        [key: string]: any
    },
    fields: {
        [fieldName: string]: FormFieldMeta
    }
}
