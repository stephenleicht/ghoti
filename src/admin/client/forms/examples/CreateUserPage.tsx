// //CreateUserPage.tsx
// import * as React from 'react';
// import { FormState, createFormState, Form, Group } from '@ghoti/forms';
// import TextInput from './TextInput'


// interface CreateUserPageState {
//     formState: FormState,
// }

// class CreateUserPage extends React.Component<{}, CreateUserPageState> {
//     constructor(props: object) {
//         super(props);

//         this.state = {
//             formState: createFormState(),
//         };
//     }

//     onSubmit = (newValue: any) => {
//         // create the user
//     }

//     onFormChange = (newState: FormState) => {
//         this.setState({ formState: newState });
//     }

//     render() {
//         return (
//             <div>
//                 <h1>Create User</h1>
//                 <Form
//                     onSubmit={this.onSubmit}
//                     formState={this.state.formState}
//                     onChange={this.onFormChange}
//                 >
//                     <div>
//                         <label htmlFor="firstName">First Name</label>
//                         <TextInput name="firstName" required />
//                     </div>
//                     <div>
//                         <label htmlFor="lastName">Last Name</label>
//                         <TextInput name="lastName" required />
//                     </div>
//                     <div>
//                         <h3>Address</h3>
//                         <Group name="address">
//                             <div>
//                                 <label htmlFor="address1">Address 1</label>
//                                 <TextInput name="address1" required />
//                             </div>
//                             <div>
//                                 <label htmlFor="address2">Address 2</label>
//                                 <TextInput name="address2" />
//                             </div>
//                             <div>
//                                 <label htmlFor="city">City</label>
//                                 <TextInput name="city" />
//                                 <label htmlFor="state">State</label>
//                                 <TextInput name="state" />
//                                 <label htmlFor="zip">Zip</label>
//                                 <TextInput name="zip" />
//                             </div>
//                         </Group>
//                     </div>
//                     <button type="submit">Create User</button>
//                 </Form>
//             </div>
//         )
//     }
// }