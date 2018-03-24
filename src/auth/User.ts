import * as bcrypt from 'bcrypt';

import {Model, Field, ID} from '../model';

@Model()
export default class User {
    @ID()
    public id: string;

    @Field()
    public email: string;

    @Field()
    private passwordHash: string;

    constructor(email: string) {
        this.email = email;
    }

    public async setPassword(newPlainTextPassword: string){
        this.passwordHash = await bcrypt.hash(newPlainTextPassword, 10);
    }

    public get password() {
        return this.passwordHash;
    }
}