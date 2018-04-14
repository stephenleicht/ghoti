import { ModelMeta, Field } from '../model';
import {ValidationResult, ValidationError} from './ValidationResult';

export type ModelValidator = [
    string,
    (value: any) => boolean
]

export function validateModel(modelMeta: ModelMeta, value: any): ValidationResult {
    const result: ValidationResult = Object.entries(modelMeta.fields)
        .map(([key]): [string, ValidationResult] => {
            let retVal: ValidationResult;

            const validators = modelMeta.fields[key].validators
            if (!validators) {
                retVal = {
                    isValid: true,
                    errors: {},
                }
            }
            else {
                retVal = Object.entries(validators)
                    .map(([validatorKey, [msg, validateFn]]): [string, boolean, string] => {
                        const isValid = validateFn({value: value[key]});
                        return [validatorKey, isValid, msg];
                    })
                    .reduce((agg, [validatorKey, isValid, msg]) => {
                        agg = {
                            isValid: agg.isValid && isValid,
                            errors: {
                                ...agg.errors,
                                [validatorKey]: isValid ? false : msg
                            }
                        };

                        return agg;
                    }, {
                            isValid: true,
                            errors: {}
                        })
            }

            return [key, retVal];
        })
        .reduce((agg, [fieldKey, result]) => {
            agg = {
                isValid: agg.isValid && result.isValid,
                errors: {
                    ...agg.errors,
                    [fieldKey]: result.isValid ? false : result.errors
                }
            }

            return agg;
        }, {
                isValid: true,
                errors: {},
            });
        
        return result;
}