import { pick, toPlainObject } from 'lodash';
import * as mongoose from 'mongoose';
import * as stackTrace from 'stack-trace';
import * as pluralize from 'pluralize';


import { FieldMeta, ModelMeta } from '../PersistedField';

import constants from '../constants';

export default function Model() {
    return function modelDecorator<T extends new (...args: any[]) => {}>(target: T): T {
        const modelMeta: ModelMeta = Reflect.getMetadata(constants.MODEL_META_KEY, target.prototype.constructor);

        //TODO: Find the first file that isn't part of reflect-metadata, this seems like it could be pretty brittle.
        modelMeta.fileName = stackTrace.get()[3].getFileName();
        modelMeta.name = target.prototype.constructor.name;
        modelMeta.namePlural = pluralize.plural(modelMeta.name);

        const schema = Object
            .entries(modelMeta.fields)
            .reduce((agg, [key, fieldMeta]) => {
                return {
                    ...agg,
                    [key]: fieldMeta.type
                }
            }, {});

        const mongooseModel = mongoose.model(target.name, new mongoose.Schema(<any>schema));

        const fieldKeys = Object.keys(modelMeta.fields);
        const idKey = fieldKeys.find(key => modelMeta.fields[key].isID);

        return class ModelWrapper extends target {
            static displayName = `Model<${target.name}>`
            static mongooseModel = mongooseModel;
            static modelMeta = modelMeta;

            _mongooseInstance: any;

            constructor(...args: any[]) {
                super(...args);

                const fieldValues: { [key: string]: any } = pick(this, fieldKeys);

                this._mongooseInstance = new mongooseModel(fieldValues);

                const proxy = new Proxy(this, {
                    get(target, name) {
                        if (name === idKey || name === '_id') {
                            return target._mongooseInstance._id.toString();
                        }
                        else if (!!modelMeta.fields[name]) {
                            return target._mongooseInstance[name];
                        }
                        else {
                            return (target as any)[name];
                        }
                    },
                    set(target, name, value, receiver) {
                        if (name === idKey || name === '_id') {
                            target._mongooseInstance._id = value;
                        }
                        else if (!!modelMeta.fields[name]) {
                            target._mongooseInstance[name] = value;
                        }
                        else {
                            (target as any)[name] = value;
                        }

                        return true;
                    },
                    // ownKeys(target) {
                    //     const keys = Reflect.ownKeys(target);
                    //     if( idKey && !keys.includes(idKey)) {
                    //         keys.push(idKey);
                    //     }
                    //     return keys;
                    // },
                    // getOwnPropertyDescriptor(target, name) {
                    //     if( name === idKey) {
                    //         return {enumerable: true, value: target._mongooseInstance._id.toString()}
                    //     }

                    //     return Reflect.getOwnPropertyDescriptor(target, name);
                    // }
                })

                return proxy;
            }

            toJSON() {
                const copy: any = toPlainObject(this);
                delete copy._mongooseInstance;
                if (idKey) {
                    copy[idKey] = copy[idKey] || this._mongooseInstance._id.toString();
                }
                return copy;
            }
        }
    }
}