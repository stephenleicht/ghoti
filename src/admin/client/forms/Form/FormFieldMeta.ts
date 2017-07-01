import { ValidateCallback } from './ValidateCallback';

export interface FormFieldMeta {
    isPristine: boolean,
    isValid: boolean,
    errors?: {
        [validatorKey: string]: boolean
    }
    validate: ValidateCallback
}