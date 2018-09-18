import { ModelType } from "./modelDecorator";

export type TaggedUnionMeta = {
    _ghotiType: 'taggedUnion',
    tagField: string,
    tagMap: { [key: string]: any } 
};

export function createTaggedUnionMeta(tagField: string, tagMap: { [key: string]: ModelType<any> }): TaggedUnionMeta {
    return {
        _ghotiType: 'taggedUnion',
        tagField,
        tagMap
    }
}

