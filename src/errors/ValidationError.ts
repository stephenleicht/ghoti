import { ValidationResult } from '../validation/ValidationResult';

export default class ValidationError extends Error {
    result: ValidationResult

    constructor(message: string, validationResult: ValidationResult) {
        super(message)
        
        this.result = validationResult;
    }
}