import { timeStamp } from 'console';
import * as React from 'react';
import { ModelMeta } from '../../../../model';

import { formElement, FormElementProps } from '../../forms';

import Group, { GroupValue } from '../../forms/Group';

import FieldEditor from '../FieldEditor';

import * as styles from './ModelEditor.css'

type Predicate = (value: any) => boolean

export interface ModelEdtitorValue {
    [fieldName: string]: any
}

export interface ModelEditorProps extends FormElementProps<ModelEdtitorValue> {
    modelMeta: ModelMeta,
}

class ModelEditor extends React.Component<ModelEditorProps, {}> {
    onChange(newValue: unknown){
        this.props.onChange??(newValue as ModelEdtitorValue)
    }
    render() {
        const { modelMeta, name, ...otherProps } = this.props;

        const fields = Object.entries(modelMeta.fields)
            .filter(([key, f]) => f.editable)
            .map(([key, f]) => {

                const validators = modelMeta.fields[key].validators || {}

                const componentValidators = Object.entries(validators)
                    .map<[string, Predicate]>(([key, [msg, validatorFn]]) => [key, validatorFn])
                    .reduce((agg, [key, validatorFn]) => {
                        agg[key] = validatorFn;
                        return agg;
                    }, {} as { [key: string]: any })

                return (
                    <div className={styles.fieldWrapper} key={key}>
                        <label className={styles.label}>{key}</label>
                        <FieldEditor
                            name={key}
                            fieldMeta={f}
                            validators={componentValidators}
                        />
                    </div>
                )
            })

        return (
            <div className={styles.wrapper}>
                <Group name={name} {...otherProps} onChange={this.onChange}>
                    {fields}
                </Group>
            </div>

        );
    }
}

export default formElement<ModelEditorProps, ModelEdtitorValue>()(ModelEditor);