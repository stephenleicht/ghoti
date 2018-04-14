export interface ValidationResult {
    isValid: boolean,
    errors: ValidationError,
    fields?: {
        [key: string]: ValidationResult
    }
}

export interface ValidationError {
    [key: string]: boolean | string | { [key: string]: ValidationError }
}