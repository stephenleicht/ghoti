import {omit} from 'lodash';

import {Model, Field, ID} from '../model';

import isEmailValidator from '../validation/isEmail';

@Model()
export default class User {
    @ID()
    public id: string;

    @Field({
        validators: {
            isEmail: isEmailValidator
        }
    })
    public email: string;

    @Field()
    public passwordHash: string;

    constructor(email: string) {
        this.email = email;
    }

    public toJSON() {
        return omit(this, ['passwordHash']);
    }
}