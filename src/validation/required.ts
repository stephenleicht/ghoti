import { ModelValidator } from './validateModel';

const requiredValidator: ModelValidator = [
    'Field is required',
    (props: any) => !!props.value
];

export default requiredValidator