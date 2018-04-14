import * as React from 'react';

export interface ValueInterceptor {
    onChangeInterceptor: (name: string, newValue: any) => void,
    getValue: (name: string) => any
}

export const ValueInterceptorContext = React.createContext<ValueInterceptor>();