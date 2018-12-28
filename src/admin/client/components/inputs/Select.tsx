import * as React from 'react';

import formElement, {FormElementProps} from '../../forms/FormElement';

export interface SelectProps extends FormElementProps{
    options: Array<{key?: string, displayValue: string}>
}

const UNDEFINED = '_ghotiUndefined';

class Select extends React.Component<SelectProps, {}> {
    onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value === UNDEFINED ? undefined : e.target.value;
        this.props.onChange && this.props.onChange(value);
    }
    render() {
        const {
            options,
            value,
            required,
            onChange = () => {}
        } = this.props;

        const optionElems = options.sort((a, b) => {
            if(a.displayValue > b.displayValue) {
                return 1;
            }
            else if(a.displayValue < b.displayValue) {
                return -1;
            }
            else {
                return 0;
            }
        }).map(({key, displayValue}) => <option key={key} value={key}>{displayValue}</option>)

        let valueIsOption = !required && !value;
        if(!valueIsOption) {
            valueIsOption = options.some(o => o.key === value)
        }

        const renderValue = (!required && !value) ? UNDEFINED : value 

        return (
            <select value={renderValue} onChange={this.onChange}>
                {!valueIsOption && <option value={value}></option>}
                {!required && <option value={UNDEFINED}>None</option>}
                {optionElems}
            </select>
        )
    }
}

export default formElement()(Select);