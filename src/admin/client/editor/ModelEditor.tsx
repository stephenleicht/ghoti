import * as React from 'react';
import modelContstants from '../../../model/constants';
import { ModelMeta } from '../../../model';

import { FormElement, FormElementProps } from '../forms';

import Select from '../components/inputs/Select';
import Group from '../forms/Group';

import FieldEditor from './FieldEditor';

type Predicate = (value: any) => boolean

export interface ModelEditorProps extends FormElementProps {
    modelMeta: ModelMeta,
}

class ModelEditor extends React.Component<ModelEditorProps, {}> {
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
                    <div key={key}>
                        <label>{key}</label>
                        <FieldEditor
                            name={key}
                            fieldMeta={f}
                            validators={componentValidators}
                        />
                    </div>
                )
            })

        return (
            <Group name={name} {...otherProps}>
                {fields}
            </Group>
        );
    }
}

export default FormElement()(ModelEditor);