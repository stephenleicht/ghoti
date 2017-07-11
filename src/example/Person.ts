import { ID, Model, PersistedField } from "../model";

interface PersonOptions {
    firstName: string,
    lastName: string,
    favoriteColor?: string,
}

@Model()
export default class Person {
    @ID()
    id: string

    @PersistedField()
    firstName: string

    @PersistedField()
    lastName: string

    @PersistedField()
    favoriteColor: string

    @PersistedField()
    gender: string

    @PersistedField()
    hairColor: string

    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    constructor(options: PersonOptions){
        Object.assign(this, options);
    }
}