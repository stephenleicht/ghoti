import * as React from 'react';

import { ValidateCallback } from './ValidateCallback';
import { FormErrorMap } from '../errors/FormErrorMap';

export interface FormContextValue {
    register: (path: string, validateCallback: ValidateCallback) => void,
    deregister: (path: string) => void,
    setTouched: (path: string, isTouched: boolean) => void,
    addToChangeQueue: (fieldName: string) => void,
    getErrors: (fieldName: string) => FormErrorMap | undefined
    parentPath: string,
    getIsTouched: (fieldName: string) => boolean
    getHasSubmitted: () => boolean
}

const defaultValue = {
    register: () => {},
    deregister: () => {},
    setTouched: (path: string, isTouched: boolean) => {},
    addToChangeQueue: () => {},
    getErrors: () => undefined,
    getIsTouched: () => false,
    getHasSubmitted: () => false,
    parentPath: '',
}

export const FormContext = React.createContext<FormContextValue>(defaultValue);
