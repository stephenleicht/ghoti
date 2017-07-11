import { ID, Model, PersistedField } from "../model";

interface FishOptions {
    name: string,
    color: string,
    gender?: string,
}

@Model()
export default class Fish {
    @ID()
    id: string

    @PersistedField()
    name: string

    @PersistedField()
    color: string

    @PersistedField()
    gender: string

    constructor(options: FishOptions){
        Object.assign(this, options);
    }
}