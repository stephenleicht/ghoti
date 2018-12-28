import * as React from 'react';

import formElement, { FormElementProps } from './FormElement';

import { ValueInterceptorContext, ValueInterceptor } from './ValueInterceptor';

class Group extends React.Component<FormElementProps, {}> {
    valueChildContext: ValueInterceptor

    constructor(props: FormElementProps) {
        super(props);

        this.valueChildContext = {
            getValue: this.getChildValue,
            onChangeInterceptor: this.onChildElementChange,
        };
    }

    getChildValue = (fieldName: string) => {
        return this.props.value && this.props.value[fieldName];
    }

    onChildElementChange = (name: string, newChildValue: any) => {
        const newValue = {
            ...this.props.value,
            [name]: newChildValue,
        };

        if (this.props.onChange) {
            this.props.onChange(newValue);
        }
    }

    render() {
        return (
            <ValueInterceptorContext.Provider value={this.valueChildContext}>
                {this.props.children}
            </ValueInterceptorContext.Provider>
        );
    }
}

export default formElement({
    defaultValue: () => ({})
})(Group);