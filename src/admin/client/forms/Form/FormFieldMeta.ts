import { ValidateCallback } from './ValidateCallback';
import { FormErrorMap } from '../errors/FormErrorMap';

export interface FormFieldMeta {
    isPristine: boolean,
    isValid: boolean,
    isTouched: boolean,
    pendingValidation: boolean,
    errors?: FormErrorMap,
    validate: ValidateCallback,
    children: Set<string>
}