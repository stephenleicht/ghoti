import * as React from 'react';

import { ValidateCallback } from './ValidateCallback';

export interface FormContextValue {
    register: (path: string, validateCallback: ValidateCallback) => void,
    addToChangeQueue: (fieldName: string) => void,
    parentPath: string,
}

const defaultValue = {
    register: () => {},
    addToChangeQueue: () => {},
    parentPath: ''
}

export const FormContext = React.createContext<FormContextValue>(defaultValue);
