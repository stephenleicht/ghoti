import * as React from 'react';
import modelContstants from '../../../model/constants';
import { ModelMeta } from '../../../model';

import { FormElement, FormElementProps } from '../forms';

import EmbededModel from './EmbededModel';

import Select from '../components/inputs/Select';
import Group from '../forms/Group';

import FieldEditor from './FieldEditor';

type Predicate = (value: any) => boolean

export interface ModelEditorProps extends FormElementProps {
    model: any,
}

class ModelEditor extends React.Component<ModelEditorProps, {}> {
    render() {
        const { model, name, ...otherProps } = this.props;
        const modelMeta: ModelMeta = model.modelMeta;

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