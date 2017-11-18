import * as React from 'react';
import * as PropTypes from 'prop-types';
import FormElement, {FormElementProps} from './FormElement';

class Group extends React.Component<FormElementProps, {}> {
    static childContextTypes = {
        getValue: PropTypes.func,
    }

    getChildContext() {
        return {
            getValue: this.getChildValue,
        }
    }

    getChildValue = (fieldName: string) => {
        return this.props.value && this.props.value[fieldName];
    }

    onChildElementChange = (name: string, newChildValue: any) => {
        const newValue = {
            ...this.props.value,
            [name]: newChildValue,
        };

        if(this.props.onChange) {
            this.props.onChange(newValue);
        }
    }

    render() {
        return (
            <div>
                {this.props.children}
            </div>
        );
    }
}

export default FormElement({
    defaultValue: () => ({})
})(Group);