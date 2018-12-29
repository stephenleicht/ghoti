import * as React from 'react';

import { ValidateCallback } from './ValidateCallback';
import { FormErrorMap } from '../errors/FormErrorMap';

export interface FormContextValue {
    register: (path: string, validateCallback: ValidateCallback) => void,
    deregister: (path: string) => void,
    addToChangeQueue: (fieldName: string) => void,
    getErrors: (fieldName: string) => FormErrorMap | undefined
    parentPath: string,
}

const defaultValue = {
    register: () => {},
    deregister: () => {},
    addToChangeQueue: () => {},
    getErrors: () => undefined,
    parentPath: ''
}

export const FormContext = React.createContext<FormContextValue>(defaultValue);
