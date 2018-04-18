import * as React from 'react';

import FormElement, {FormElementProps} from '../../forms/FormElement';

export interface SelectProps extends FormElementProps{
    options: Array<{key: string | undefined, displayValue: string}>
}

class Select extends React.Component<SelectProps, {}> {
    onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        this.props.onChange && this.props.onChange(e.target.value);
    }
    render() {
        const {
            options,
            value, 
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

        return (
            <select value={value} onChange={this.onChange}>
                {optionElems}
            </select>
        )
    }
}

export default FormElement()(Select);