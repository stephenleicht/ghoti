import { ModelValidator } from './validateModel';

const isValidEmailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const isEmailValidator: ModelValidator = [
    'Email is invalid',
    (maybeEmail: string) => isValidEmailRegex.test(maybeEmail)
];

export default isEmailValidator