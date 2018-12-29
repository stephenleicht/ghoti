import * as React from 'react';
import { ErrorMessagesContext } from './ErrorMessagesContext';

export interface MessageProps {
    errorKey: string,
    children: React.ReactNode
}

export default function Message({ errorKey, children }: MessageProps) {
    return (
        <ErrorMessagesContext.Consumer>
            {({ errors }) => {
                if(!errors || !errors[errorKey]){
                    return null;
                }

                return children;
            }}
        </ErrorMessagesContext.Consumer>
    )
}