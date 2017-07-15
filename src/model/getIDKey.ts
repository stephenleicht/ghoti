import { ModelMeta } from './PersistedField';

export default function getIDKey(modelMeta: ModelMeta): string {
    const idKey = Object.keys(modelMeta.fields).find(key => modelMeta.fields[key].isID);

    return idKey ? idKey : '_id';
}