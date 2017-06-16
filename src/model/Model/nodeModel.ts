import { pick } from 'lodash';
import * as mongoose from 'mongoose';
import * as stackTrace from 'stack-trace';

import { FieldMeta, ModelMeta } from '../PersistedField';

import constants from '../constants';

export default function Model() {
    return function modelDecorator<T extends new (...args: any[]) => {}>(target: T): T {
        const modelMeta: ModelMeta = Reflect.getMetadata(constants.MODEL_META_KEY, target.prototype.constructor);

        //TODO: Find the first file that isn't part of reflect-metadata, this seems like it could be pretty brittle.
        modelMeta.fileName = stackTrace.get()[3].getFileName();
        modelMeta.name = target.prototype.constructor.name;

        const schema = Object
                        .entries(modelMeta.fields)
                        .reduce((agg, [key, fieldMeta]) => {
                            return {
                                ...agg,
                                [key]: fieldMeta.type
                            }
                        }, {});

        const mongooseModel = mongoose.model(target.name, new mongoose.Schema(<any>schema));

        return class extends target {
            static displayName = `Model<${target.name}>`
            static mongooseModel = mongooseModel;

            _mongooseInstance: any;

            constructor(...args: any[]){
                super(...args);

                const fieldValues = pick(this, Object.keys(modelMeta));

                this._mongooseInstance = new mongooseModel(fieldValues);

                buildProperties(modelMeta, this);
            }
        }
    }
}

function buildProperties(modelMeta: ModelMeta, target: any) {
    Object.entries(modelMeta.fields).forEach(([key, fieldMeta]) => {
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