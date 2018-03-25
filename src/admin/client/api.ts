import { ModelMeta } from '../../model';
import { SessionSummary } from '../../api/SessionSummary';

export async function createModel(modelMeta: ModelMeta, value: any) {
    const result = await fetch(`/api/models/${modelMeta.namePlural}`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(value),
        credentials: 'include'
    } as RequestInit);

    return result.json();
}

export async function updateModel(modelMeta: ModelMeta, id: string, value: any) {
    const result = await fetch(`/api/models/${modelMeta.namePlural}/${id}`, {
        method: 'PUT',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
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

export async function deleteModelByID(modelMeta: ModelMeta, id: string) {
    const res = await fetch(`/api/models/${modelMeta.namePlural}/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    return res.json();
}

export async function authenticate(username: string, password: string) {
    const res = await fetch('/api/login', {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
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

export async function createUser(value: any) {
    const result = await fetch(`/api/users`, {
        method: 'POST',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(value),
        credentials: 'include'
    });

    return result.json();
}

export async function updateUser(id: string, value: any) {
    const result = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: new Headers({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify(value),
        credentials: 'include'
    });

    return result.json();
}

export async function getUserByID(id: string) {
    const model = await fetch(`/api/users/${id}`, {
        method: 'GET',
        credentials: 'include'
    });

    return model.json();
}

export async function getUsersList() {
    const models = await fetch(`/api/users`, {
        method: 'GET',
        credentials: 'include'
    });

    return models.json();
}

export async function deleteUserByID(id: string) {
    const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });

    return res.json();
}