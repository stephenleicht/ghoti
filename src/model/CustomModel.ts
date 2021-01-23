import { Model, Field, ID, FieldMeta, ModelMeta } from ".";

@Model()
export default class CustomModel {
    @ID()
    id: string

    @Field()
    name: string;

    @Field()
    namePlural: string;

    fileName: string;
    fields: { [key: string]: FieldMeta; };

    constructor() {
        this.fileName = "";
    }

    
}