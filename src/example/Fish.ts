import { ID, Model, Field } from "../model";

import Person from './Person';

export interface FishOptions {
    name: string,
    color: string,
    gender?: string,
}

@Model()
export default class Fish {
    @ID()
    id: string

    @Field()
    name: string

    @Field()
    color: string

    @Field()
    link: Person

    constructor(options: FishOptions){
        Object.assign(this, options);
    }
}