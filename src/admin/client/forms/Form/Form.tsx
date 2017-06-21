import * as React from 'react';

import { FormState } from './FormState';
import { FormElement } from '../FormElement';

import * as styles from './Form.css';

interface FormProps {
    children: React.ReactNode,
    formState: FormState,
    onChange: (newState: FormState) => void
}

export default class Form extends React.Component<FormProps, {}> {
    onChildChange = (childName: string, newValue: any) => {
        if (newValue.target && newValue.target instanceof HTMLElement){
            newValue = newValue.target.value;
        }

        this.props.onChange({
            ...this.props.formState,
            value: {
                ...this.props.formState.value,
                [childName]: newValue
            }
        });
    }

    prepareChildren(children: React.ReactNode) {
        return React.Children.toArray(children)
            .map((child: React.ReactChild) => {
                if (!React.isValidElement<any>(child)) {
                    return child;
                }

                let propsToAdd: Partial<FormElement<any>> & { children?: any } = {};
                if (child.props.children) {
                    propsToAdd = {
                        ...propsToAdd,
                        children: this.prepareChildren(child.props.children)
                    };
                }

                if (child.props.hasOwnProperty('name')) {
                    const namedChild = child as React.ReactElement<FormElement<any>>;

                    propsToAdd = {
                        ...propsToAdd,
                        value: this.props.formState.value[namedChild.props.name],
                        onChange: (value) => this.onChildChange(namedChild.props.name, value)
                    }
                }

                return React.cloneElement(child, propsToAdd);
            })
    }

    render() {
        return (
            <div>
                {this.prepareChildren(this.props.children)}
            </div>
        );
    }
}