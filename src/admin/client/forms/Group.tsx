import * as React from 'react';

import FormElement, { FormElementProps } from './FormElement';

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
                <div>
                    {this.props.children}
                </div>
            </ValueInterceptorContext.Provider>
        );
    }
}

export default FormElement({
    defaultValue: () => ({})
})(Group);