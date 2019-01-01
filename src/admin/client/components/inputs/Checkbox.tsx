import * as React from 'react';

import formElement, {FormElementProps} from '../../forms/FormElement';

export interface CheckboxProps extends FormElementProps<boolean>{

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

export default formElement<CheckboxProps, boolean>()(Checkbox);