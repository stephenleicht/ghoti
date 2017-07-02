import { FormFieldMeta } from './FormFieldMeta';

export interface FormState {
    isValid: boolean,
    isPristine: boolean,
    pendingValidation: boolean,
    value: {
        [key: string]: any
    },
    fields: {
        [fieldName: string]: FormFieldMeta
    }
}

export function createFormState(value: {[key: string]: any}): FormState {
    return {
        isValid: true,
        isPristine: true,
        pendingValidation: false,
        value: {...value},
        fields: {}
    };
}