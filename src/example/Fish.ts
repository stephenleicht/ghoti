import { ID, Model, Field } from "../model";

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
    gender: string

    constructor(options: FishOptions){
        Object.assign(this, options);
    }
}