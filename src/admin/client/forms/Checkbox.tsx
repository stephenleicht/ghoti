import * as React from 'react';

import FormElement, {FormElementProps} from './FormElement';

export interface CheckboxProps extends FormElementProps{

}

class Checkbox extends React.Component<CheckboxProps, {}> {
    render() {
        const {
            value, 
            onChange = () => {}
        } = this.props;
        return (
            <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)}/>
        )
    }
}

export default FormElement()(Checkbox);