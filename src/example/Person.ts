import { ID, Model, Field } from "../model";

@Model()
export default class Person {
    @ID()
    id: string

    @Field({required: true})
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
}