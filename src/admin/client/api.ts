import { ModelMeta } from '../../model/PersistedField';

export async function createModel(modelMeta: ModelMeta, value: any) {
    const result = await fetch(`/api/models/${modelMeta.namePlural}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
    });

    return result.json();
}

export async function updateModel(modelMeta: ModelMeta, id: string, value: any) {
    const result = await fetch(`/api/models/${modelMeta.namePlural}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
    });

    return result.json();
}

export async function getModelByID(modelMeta: ModelMeta, id: string) {
    const model = await fetch(`/api/models/${modelMeta.namePlural}/${id}`, {
        method: 'GET'
    });

    return model.json();
}

export async function getModelList(modelMeta: ModelMeta) {
    const models = await fetch(`/api/models/${modelMeta.namePlural}`, {
        method: 'GET'
    });

    return models.json();
}

export async function deleteByID(modelMeta: ModelMeta, id: string) {
    const res = await fetch(`/api/models/${modelMeta.namePlural}/${id}`, {
        method: 'DELETE'
    });

    return res.json();
}