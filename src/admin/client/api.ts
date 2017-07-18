import { ModelMeta } from '../../model';
import { SessionSummary } from '../../api/SessionSummary';

export async function createModel(modelMeta: ModelMeta, value: any) {
    const result = await fetch(`/api/models/${modelMeta.namePlural}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value),
        credentials: 'include'
    });

    return result.json();
}

export async function updateModel(modelMeta: ModelMeta, id: string, value: any) {
    const result = await fetch(`/api/models/${modelMeta.namePlural}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value),
        credentials: 'include'
    });

    return result.json();
}

export async function getModelByID(modelMeta: ModelMeta, id: string) {
    const model = await fetch(`/api/models/${modelMeta.namePlural}/${id}`, {
        method: 'GET',
        credentials: 'include'
    });

    return model.json();
}

export async function getModelList(modelMeta: ModelMeta) {
    const models = await fetch(`/api/models/${modelMeta.namePlural}`, {
        method: 'GET',
        credentials: 'include'
    });

    return models.json();
}

export async function deleteByID(modelMeta: ModelMeta, id: string) {
    const res = await fetch(`/api/models/${modelMeta.namePlural}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    return res.json();
}

export async function authenticate(username: string, password: string) {
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, password}),
        credentials: 'include'
    })

    if(res.status === 401) {
        return false;
    }

    return res.ok;
}

export async function getSessionInfo() {
    const res = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'include'
    });

    if(res.status === 401) {
        return false;
    }

    const session: SessionSummary = await res.json();
    return session;
}