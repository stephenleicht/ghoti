import * as React from 'react';
import { FormErrorMap } from "./FormErrorMap";

export interface ErrorMessagesContextValue {
    errors?: FormErrorMap
}

const defaultValue: ErrorMessagesContextValue = {
    errors: undefined
}

export const ErrorMessagesContext = React.createContext(defaultValue);