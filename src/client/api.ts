import {createFetch, base, header, init} from 'http-client';

import { ModelMeta } from '../model';
import { SessionSummary } from '../api/SessionSummary';

let fetch = initFetch();

function initFetch(...middleware: any[]) {
    return createFetch(
        header('Content-Type', 'application/json'),
        init('credentials', 'include'),
        ...middleware
    )
}

export function setServer(url: string) {
    fetch = initFetch(
        base(url)
    )
}

export async function createModel(modelMeta: ModelMeta, value: any) {
    const result = await fetch(`/api/models/${modelMeta.namePlural}`, {
        method: 'POST',
        body: JSON.stringify(value),
    } as RequestInit);

    return result.json();
}

export async function updateModel(modelMeta: ModelMeta, id: string, value: any) {
    const result = await fetch(`/api/models/${modelMeta.namePlural}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(value),
    });

    return result.json();
}

export async function getModelByID<T>(modelMeta: ModelMeta, id: string) {
    const model = await fetch(`/api/models/${modelMeta.namePlural}/${id}`);

    return model.json() as T;
}

export async function getModelList(modelMeta: ModelMeta) {
    const models = await fetch(`/api/models/${modelMeta.namePlural}`);
    return models.json();
}

export async function deleteModelByID(modelMeta: ModelMeta, id: string) {
    const res = await fetch(`/api/models/${modelMeta.namePlural}/${id}`, {
        method: 'DELETE',
    });

    return res.json();
}

export async function authenticate(username: string, password: string) {
    const res = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({username, password}),
    })

    if(res.status === 401) {
        return false;
    }

    return res.ok;
}

export async function getSessionInfo() {
    const res = await fetch('/api/auth/session');

    if(res.status === 401) {
        return false;
    }

    const session: SessionSummary = await res.json();
    return session;
}

export async function createUser(value: any) {
    const result = await fetch(`/api/users`, {
        method: 'POST',
        body: JSON.stringify(value),
    });

    return result.json();
}

export async function updateUser(id: string, value: any) {
    const result = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(value)
    });

    return result.json();
}

export async function getUserByID(id: string) {
    const model = await fetch(`/api/users/${id}`);

    return model.json();
}

export async function getUsersList() {
    const models = await fetch(`/api/users`);

    return models.json();
}

export async function deleteUserByID(id: string) {
    const res = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
    });

    return res.json();
}