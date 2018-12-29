import * as React from 'react';
import { FormErrorMap } from './FormErrorMap';
import { ErrorMessagesContext } from './ErrorMessagesContext';

export interface ErrorMessagesProps {
    errors?: FormErrorMap
    children: React.ReactNode
}

export default function ErrorMessages({errors, children}: ErrorMessagesProps) {
    return (
        <ErrorMessagesContext.Provider value={{
            errors: errors
        }}>
            {errors && children}
        </ErrorMessagesContext.Provider>
    )
}


