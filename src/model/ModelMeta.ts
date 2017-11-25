import { FieldMeta } from './FieldMeta';

export type ModelMeta = {
    idKey: string,
    name: string,
    namePlural: string,
    fileName: string,
    fields: {[key: string]: FieldMeta}
    refFields: string[],
}