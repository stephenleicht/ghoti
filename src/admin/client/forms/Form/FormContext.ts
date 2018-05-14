import * as React from 'react';

import { ValidateCallback } from './ValidateCallback';

export interface FormContextValue {
    register: (path: string, validateCallback: ValidateCallback) => void,
    deregister: (path: string) => void,
    addToChangeQueue: (fieldName: string) => void,
    parentPath: string,
}

const defaultValue = {
    register: () => {},
    deregister: () => {},
    addToChangeQueue: () => {},
    parentPath: ''
}

export const FormContext = React.createContext<FormContextValue>(defaultValue);
