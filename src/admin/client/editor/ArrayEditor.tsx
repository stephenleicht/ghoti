import * as React from 'react';
import { GhotiType } from '../../../model';
import Select from '../components/inputs/Select';
import { ArrayInput, FormElement, FormElementProps } from '../forms';
import ModelEditor from './ModelEditor';
import PrimitiveEditor from './PrimitiveEditor';
import TaggedUnionEditor from './TaggedUnionEditor';



export interface ArrayEditorProps extends FormElementProps {
    arrayOf: GhotiType,
}
class ArrayEditor extends React.Component<ArrayEditorProps, object>{
    createNewInstance(type: GhotiType): any {
        let newInstance;
        if(type._ghotiType === 'arrayOf') {
            newInstance = [this.createNewInstance(type.arrayOf)];
        }
        else if(type._ghotiType === 'taggedUnion') {
            newInstance = {};
        }
        else if(type._ghotiType === 'enumOf') {
            newInstance = Object.keys(type.enumOf)[0];
        }
        else if(type._ghotiType === 'ref'){
            newInstance = new type.model();
        }
        else {
            newInstance = new type.type();
        }

        return newInstance
    }

    handleAdd = () => {
        const { value, arrayOf, onChange } = this.props;

        const newInstance = this.createNewInstance(arrayOf);

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

                        if (arrayOf._ghotiType === 'taggedUnion') {
                            component = <TaggedUnionEditor unionMeta={arrayOf} name={name} {...arrayProps} />
                        }
                        else if (arrayOf._ghotiType === 'ref') {
                            component = <ModelEditor modelMeta={arrayOf.modelMeta} name={name} {...arrayProps} />;
                        }
                        else if (arrayOf._ghotiType === 'enumOf') {
                            const selectOptions = Object
                                .entries(arrayOf.enumOf)
                                .map(([valueKey, displayValue]) => ({ key: valueKey, displayValue }));

                            component = <Select name={name} options={selectOptions} {...arrayProps} />
                        }
                        else if(arrayOf._ghotiType === 'primitive') {
                            component = <PrimitiveEditor type={arrayOf.type} name={name} {...arrayProps} />;
                        }
                        else {
                            component = <span>Unsupported Type for ArrayEditor</span>
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