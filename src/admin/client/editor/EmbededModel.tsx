import * as React from 'react';

import FormElement, {FormElementProps} from '../forms/FormElement';

import Group from '../forms/Group';

export interface EmbededModelProps extends FormElementProps {
    constructor: Function,
}

class EmbededModel extends React.Component<EmbededModelProps, {}> {
    render() {
        const {children} = this.props;

        return (
            <Group name={this.props.name} onChange={this.props.onChange}>
                {children}
            </Group>
        );
    }
}

export default FormElement()(EmbededModel);