import { Model } from 'mongoose';
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

export function findByID<T extends new (...args: any[]) => T>(model: T, id: string): Promise<T> {
    return new Promise((resolve, reject) => {
        const anyModel: any = model as any;
        anyModel.mongooseModel.findById(id, '-__v').lean().exec((err: any, doc: any) => {
            if (err) {
                reject(err);
                return;
            }
            
            const { _id, ...dbValues} = doc;
            const idKey = Object.keys(anyModel.modelMeta.fields).find(key => anyModel.modelMeta.fields[key].isID);

            if (idKey) {
                dbValues[idKey] = _id.toString();
            }
            
            resolve(new model(dbValues));
        })
    })
}