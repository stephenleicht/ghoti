import { ID, Model, Field } from "../model";

export interface PersonOptions {
    firstName: string,
    lastName: string,
    favoriteColor?: string,
}

@Model()
export default class Person {
    @ID()
    id: string

    @Field()
    firstName: string

    @Field()
    lastName: string

    @Field()
    favoriteColor: string

    @Field()
    gender: string

    @Field()
    hairColor: string

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    constructor(options: PersonOptions){
        Object.assign(this, options);
    }
}