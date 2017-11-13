import * as React from 'react';

import { FormElementProps } from '../forms/FormElement';

import TextInput from '../forms/TextInput';
import NumberInput from '../forms/NumberInput';
import Checkbox from '../forms/Checkbox';


const defaults = new Map<any, React.ComponentClass<any>>([
    [String, TextInput],
    [Number, NumberInput],
    [Boolean, Checkbox],
]);

export {defaults as defaultComponentsByType};