import * as React from 'react';

import FormElement, { FormElementProps } from './FormElement';

export interface ArrayInputRenderProps {
    idx: number,
    name: string,
    key: string,
    value: any,
    onChange: (newValue: any) => void,
    removeSelf: () => void,
}

export interface ArrayInputProps extends FormElementProps<any[]> {
    children: (props: ArrayInputRenderProps) => React.ReactNode
}

class ArrayInput extends React.Component<ArrayInputProps, {}> {
    handleChange(idx: number, newChildValue: any) {
        const newValue = this.props.value ? [...this.props.value] : [];
        newValue[idx] = newChildValue;

        this.props.onChange && this.props.onChange(newValue);
    }

    handleRemove(idx: number) {
        const newValue = this.props.value ? [...this.props.value] : [];
        newValue.splice(idx, 1);

        this.props.deregister && this.props.deregister(`${this.props.name}-${newValue.length}`);
        this.props.onChange && this.props.onChange(newValue);
    }

    render() {
        const {
            name,
            value,
            children,
            onChange = () => { }
        } = this.props;

        if (!value) {
            return null;
        }

        return (
            <>
                {value.map((el, idx) => {
                    const childName = `${name}-${idx}`
                    return children({
                        idx: idx,
                        name: childName,
                        key: childName,
                        value: el,
                        onChange: (newValue) => this.handleChange(idx, newValue),
                        removeSelf: () => this.handleRemove(idx),
                    })
                })}
            </>
        )
    }
}

export default FormElement()(ArrayInput);