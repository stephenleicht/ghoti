import { ValidateCallback } from './ValidateCallback';

export interface FormFieldMeta {
    isPristine: boolean,
    isValid: boolean,
    pendingValidation: boolean,
    errors?: {
        [validatorKey: string]: boolean
    }
    validate: ValidateCallback
}