import { FieldMeta } from './FieldMeta';

export type ModelMeta = {
    name: string,
    namePlural: string,
    fileName: string,
    fields: {[key: string]: FieldMeta}
    refFields: string[]
}