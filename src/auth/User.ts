import {omit} from 'lodash';

import {Model, Field, ID} from '../model';

@Model()
export default class User {
    @ID()
    public id: string;

    @Field()
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