// TextInput.tsx

import * as React from 'react';

import { formElement, FormElementProps } from '@ghoti/forms';

const noOp = () => {};

function TextInput ({ onChange = noOp, value = '' }: FormElementProps) {
    return (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    )
}

export default formElement()(TextInput);