import * as React from 'react';

import { FormElementProps } from '../forms/FormElement';

import TextInput from '../forms/TextInput';

const defaults = new Map<any, React.ComponentClass<FormElementProps<any>>>([
    [String, TextInput]
]);

export {defaults as defaultComponentsByType};