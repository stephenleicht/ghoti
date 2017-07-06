import { ModelMeta } from '../../model/PersistedField';

export async function createModel(modelMeta: ModelMeta, value: any) {
    const result = await fetch(`/api/models/${modelMeta.namePlural}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
    });

    return result;
}
