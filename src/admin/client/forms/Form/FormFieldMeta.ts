import { ValidateCallback } from './ValidateCallback';

export interface FormFieldMeta {
    isPristine: boolean,
    isValid: boolean,
    //Errors
    validate: ValidateCallback
}