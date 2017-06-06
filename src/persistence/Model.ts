import * as mongoose from 'mongoose';

import { FieldMeta, FieldMetaMap } from './PersistedField';

import constants from './constants';

export default function Model() {
    return function modelDecorator<T extends new (...args: any[]) => {}>(target: T): T {
        const fieldMetaMap: FieldMetaMap = Reflect.getMetadata(constants.FIELD_META_KEY, target.prototype.constructor);

        const schema = Object
                        .entries(fieldMetaMap)
                        .reduce((agg, [key, fieldMeta]) => {
                            return {
                                ...agg,
                                [key]: fieldMeta.type
                            }
                        }, {});

        const mongooseModel = mongoose.model(target.name, new mongoose.Schema(<any>schema));

        const original = target;


        const WrappedCtor = class WrappedCtor extends target {
            static mongooseModel = mongooseModel

            _mongooseInstance: any

            constructor(...args: any[]) {
                super(...args);

                this._mongooseInstance = new WrappedCtor.mongooseModel();
            }
        }

        buildProperties(fieldMetaMap, WrappedCtor.prototype);

        return WrappedCtor;

        // the new constructor behaviour
        // const wrappedCtor: any = function (this: any, ...args: any[]) {
        //     this._mongooseInstance = new mongooseModel();

        //     buildProperties(fieldMetaMap, target.constructor);

        //     return original.constructor.apply(this, args)
        // }

        // wrappedCtor.mongooseModel = mongooseModel;

        // wrappedCtor.prototype = original.prototype;

        // return wrappedCtor;
    }
}

function buildProperties(fieldMetaMap: FieldMetaMap, target: any) {
    Object.entries(fieldMetaMap).forEach(([key, fieldMeta]) => {
        if(fieldMeta.isID) {
            Object.defineProperty(target, 'id', {
                get: () => target._mongooseInstance['_id'].toString(),
            })
        }
        else {
            Object.defineProperty(target, key, {
                get: () => target._mongooseInstance[key],
                set: (value: any) => {
                    target._mongooseInstance[key] = value;
                }
            })
        }
        
    });
}