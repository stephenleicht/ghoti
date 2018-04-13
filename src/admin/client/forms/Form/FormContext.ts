import * as React from 'react';

import { ValidateCallback } from './ValidateCallback';

export interface FormContextValue {
    register: (path: string[], validateCallback: ValidateCallback) => void,
    addToChangeQueue: (fieldName: string) => void,
    onChangeNotifier: (name: string, newValue: any) => void,
    getValue: (fieldName: string) => any,
}

export const FormContext = React.createContext<FormContextValue>();
