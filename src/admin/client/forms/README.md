# Ghoti Forms
This is a (relatively) unopinionated library for common form functionality like validation and metadata tracking like dirty checking. It does not provide any form elements itself, just the building blocks to wrap your favorite ones in it's functionality with minimal boilerplate.

The main Ghoti project uses this library, but it can be used independently by installing `@ghoti/forms` from npm or yarn. Check out that side of the repository for some more complex examples.
### Current Functionality
* Track meta data like isPristine/isDirty
* Synchronous validation
* Hooks to wrap your favorite form components via `formElement()`

### Planned functionality
* A less aggressive validation strategy, currently it validates on every change. It would be nice to only trigger it at certain element events like blur
* Asynchronous validation. The foundation is theoretically there, I just haven't needed it yet.

### Hello World

Making a form is fairly simple. Here is an obligatory Hello world to show a simple example of capturing text in a field named `helloName` and writing that value back out on the screen.
```js
import {Form, FormState} from '@ghoti/forms';
import TextInput from './TextInput'; // A component wrapped in the formElement HOC, more on that later...

<>
    <Form
        onSubmit={this.onFormSubmit}
        formState={formState}
        onChange={(formState) => this.setState({formState}))}
    >
        <div>
            <label htmlFor="helloName">What is your name?</label>
            <TextInput name="helloName" />
        </div>
    </Form>
    <div>
        Hello {formState.value.helloName}
    </div>
</>
```

Notice there is no need to set up value and on change props on each element in your form. Everything is driven by the `formState` and `onChange` props on the form itself.

## Usage

### Creating your first form element component

Wrapping a component in the `formElement` HOC is simple. 
`formElement` takes one paramenter `options: FormElementOptions` and returns a function that you call with 1 parameter, the `Component: React.ComponentType | React.SFC` you want to wrap.

At a minimum your component shold take 2 props. `value` and `onChange`
* `value: any` - the currently value of the element
* `onChange: (newValue: any) => void` - Call this function with the new value of the element when it changes.


```typescript
// TextInput.tsx

import * as React from 'react';
import { formElement, FormElementProps } from '@ghoti/forms';

const noOp = () => {};

// Give on change and value default values just in case
function TextInput ({ onChange = noOp, value = '' }: FormElementProps<string>) {
    return (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} />
    )
}

export default formElement<FormElementProps<string>, string>()(TextInput);
```
If you're using typescript, formElement requires 2 generic types, the propType and the value type. If anyone knows a better way to infer this information I am open to pull requests.

See [here](../components/inputs/TextInput.tsx) for a full example.

### Form Example
```typescript
//CreateUserPage.tsx
import * as React from 'react';
import { FormState, createFormState, Form, Group } from '@ghoti/forms';
import TextInput from './TextInput'


interface CreateUserPageState {
    formState: FormState,
}

class CreateUserPage extends React.Component<{}, CreateUserPageState> {
    constructor(props: object) {
        super(props);

        this.state = {
            formState: createFormState(),
        };
    }

    onSubmit = (newValue: any) => {
        // create the user
    }

    onFormChange = (newState: FormState) => {
        this.setState({ formState: newState });
    }

    render() {
        return (
            <div>
                <h1>Create User</h1>
                <Form
                    onSubmit={this.onSubmit}
                    formState={this.state.formState}
                    onChange={this.onFormChange}
                >
                    <div>
                        <label htmlFor="firstName">First Name</label>
                        <TextInput name="firstName" required />
                    </div>
                    <div>
                        <label htmlFor="lastName">Last Name</label>
                        <TextInput name="lastName" required />
                    </div>
                    <div>
                        <h3>Address</h3>
                        <Group name="address">
                            <div>
                                <label htmlFor="address1">Address 1</label>
                                <TextInput name="address1" required />
                            </div>
                            <div>
                                <label htmlFor="address2">Address 2</label>
                                <TextInput name="address2" />
                            </div>
                            <div>
                                <label htmlFor="city">City</label>
                                <TextInput name="city" />
                                <label htmlFor="state">State</label>
                                <TextInput name="state" />
                                <label htmlFor="zip">Zip</label>
                                <TextInput name="zip" />
                            </div>
                        </Group>
                    </div>
                    <button type="submit">Create User</button>
                </Form>
            </div>
        )
    }
}
```

### Validation
TODO: Creating a validation function and handling errors.
* Max length example
* Displaying error messages

## Design Principles
* Be opinionated on how forms should work
* Be unopinionated on things like markup, you do you.
* Minimal boilerplate