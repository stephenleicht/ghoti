import { ValidateCallback } from './ValidateCallback';
import { FormErrorMap } from './FormErrorMap';

export interface FormFieldMeta {
    isPristine: boolean,
    isValid: boolean,
    pendingValidation: boolean,
    errors?: FormErrorMap,
    validate: ValidateCallback,
    children: Set<FormFieldMeta>
}