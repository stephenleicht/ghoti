import { Model } from 'mongoose';

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