import { Model } from 'mongoose';
import { omit } from 'lodash';

import { ModelMeta } from '../model/PersistedField'

export function save<T>(model: T) {
    return new Promise((resolve, reject) => {
        (<any>model)._mongooseInstance.save((err: any) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(true);
        })
    })
}

export function update<T>(model: T) {
    return new Promise((resolve, reject) => {
        (<any>model)._mongooseInstance.update((err: any) => {
            if (err) {
                reject(err);
                return;
            }

            resolve(true);
        })
    })
}

export function findByID<T extends new (...args: any[]) => T>(model: T, id: string): Promise<T | undefined> {
    return new Promise<T | undefined>((resolve, reject) => {
        const anyModel: any = model as any;
        const modelMeta: ModelMeta = anyModel.modelMeta;
        anyModel.mongooseModel.findById(id, '-__v').exec((err: any, doc: any) => {
            if (err) {
                reject(err);
                return;
            }

            if (!doc) {
                resolve(undefined);
                return;
            }

            const instance = createModelInstanceFromMongooseInstance(model, doc);

            resolve(instance);
        })
    })
}

export function find(model: any, query: any) {
    return new Promise((resolve, reject) => {
        const anyModel: any = model as any;
        const modelMeta: ModelMeta = anyModel.modelMeta;
        anyModel.mongooseModel.find({}, '-__v').exec((err: any, docs: any) => {
            if (err) {
                reject(err);
                return;
            }

            if (!docs) {
                resolve(undefined);
                return;
            }

            const instances = docs.map((doc: any) => createModelInstanceFromMongooseInstance(model, doc))

            resolve(instances);
        })
    })
}

export function deleteByID(model: any, id: string) {
    return new Promise((resolve, reject) => {
        const anyModel: any = model as any;
        const modelMeta: ModelMeta = anyModel.modelMeta;
        anyModel.mongooseModel.findByIdAndRemove(id).exec((err: any, docs: any) => {
            if (err) {
                reject(false);
                return;
            }

            resolve(true);
        })
    })
}

function createModelInstanceFromMongooseInstance(model: any, _mongooseInstance: any) {
    const instance = new model();
    instance._mongooseInstance = _mongooseInstance;

    const toMerge = omit(_mongooseInstance.toObject(), '_id');
    Object.assign(instance, toMerge);

    return instance;
}