import * as React from 'react';

import { FormElementProps } from '../forms/FormElement';

import TextInput from '../forms/TextInput';
import NumberInput from '../forms/NumberInput';


const defaults = new Map<any, React.ComponentClass<any>>([
    [String, TextInput],
    [Number, NumberInput]
]);

export {defaults as defaultComponentsByType};