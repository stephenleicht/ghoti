import * as React from 'react';

import FormElement, {FormElementProps} from '../forms/FormElement';

export interface EmbededModelProps extends FormElementProps {
    constructor: Function,
}

class EmbededModel extends React.Component<EmbededModelProps, {}> {
    render() {
        const {children} = this.props;
        const mappedChildren = React.Children.map(children, (child: React.ReactChild) => {
            if(React.isValidElement(child)) {
                console.log(child);
            }

            return child;
        })

        return (
            <div>
                {mappedChildren}
            </div>
        );
    }
}

//Replace with Group component
// Group will recursivley search through children only stopping at dead ends and other FormElements
// when it finds a formElement with a name it will clone it and add an onchange interceptor that modifies
// it's internal object with the new value using that form elements name as key and call it's own on change

// Option 2:
// Group provides context for onChangeInterceptor, when this is truthy the FormElement onChange wrapper calls this
// callback to notify that it changed. When this is called the Group component calls it's own onChange with the new
// map value. This allows us to have a Group component that can automatically wrap a few inputs in an object
// FormElement should always set onChangeInterceptor to null, that way the interceptor cannot affect anything but
// first level FormElements

export default FormElement()(EmbededModel);