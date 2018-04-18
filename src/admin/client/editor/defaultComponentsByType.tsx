import * as React from 'react';

import { FormElementProps } from '../forms/FormElement';

import TextInput from '../components/inputs/TextInput';
import NumberInput from '../components/inputs/NumberInput';
import Checkbox from '../components/inputs/Checkbox';

const defaults = new Map<any, any>([
    [String, TextInput],
    [Number, NumberInput],
    [Boolean, Checkbox],
]);

export {defaults as defaultComponentsByType};