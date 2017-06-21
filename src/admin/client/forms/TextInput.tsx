import * as React from 'react';

import { FormElement } from './FormElement';

export default class TextInput extends React.Component<FormElement<string>, {}> {
    render() {
        const { 
            onChange = () => {},
            value = ''
        } = this.props;

        return (
            <input
                {...this.props}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        )
    }
}