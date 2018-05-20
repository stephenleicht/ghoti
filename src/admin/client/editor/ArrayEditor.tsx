import * as React from 'react';

import { FormElement, FormElementProps, ArrayInput } from '../forms';

import TaggedUnionEditor from './TaggedUnionEditor';
import PrimitiveEditor from './PrimitiveEditor';
import ModelEditor from './ModelEditor';

export interface ArrayEditorProps extends FormElementProps {
    arrayOf: any,
}
class ArrayEditor extends React.Component<ArrayEditorProps, object>{
    handleAdd = () => {
        const { value, arrayOf, onChange } = this.props;

        const newInstance = arrayOf.__ghotiTaggedUnion ? {} : new arrayOf();

        const newValue = value ? [...value, newInstance] : [newInstance];
        onChange && onChange(newValue);
    }

    render() {
        const { arrayOf, ...otherProps } = this.props;

        return (
            <div>
                <button type="button" onClick={this.handleAdd}>Add</button>
                <ArrayInput name="list" {...otherProps}>
                    {({ removeSelf, key, ...arrayProps }) => {
                        let component;
    
                        if(arrayOf.__ghotiTaggedUnion) {
                            component = <TaggedUnionEditor unionMeta={arrayOf} {...arrayProps} />;
                        }
                        else if (!!arrayOf.modelMeta) {
                            component = <ModelEditor modelMeta={arrayOf.modelMeta} {...arrayProps} />;
                        }
                        else {
                            component = <PrimitiveEditor type={arrayOf} {...arrayProps} />;
                        }
    
                        return (
                            <div key={key}>
                                <div>
                                    {component}
                                </div>
                                <button type="button" onClick={removeSelf}>Remove</button>
                            </div>
                        )
                    }}
                </ArrayInput>
            </div>
        )
    }
} 

export default FormElement()(ArrayEditor);