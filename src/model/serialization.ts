import { ModelType } from "./modelDecorator";
import { ModelMeta } from "./ModelMeta";


export function deserialize<T extends ModelType<any>>(model: T, json: object) {
    const meta: ModelMeta | undefined = model.modelMeta;
    if(!meta) {
        throw new Error('model is not a valid ghoti model.')
    }

    const toMerge = Object.entries(json)
    .reduce((agg, [key, value]) => {
        const fieldMeta = meta.fields[key];

        if(!fieldMeta) {
            agg[key] = value;
            return agg;
        }

        const type = fieldMeta.type;
        if(type._ghotiType === 'ref') {
            agg[key] = deserialize(type.model, value);
        }
        else if(type._ghotiType === 'taggedUnion') {
            const tagFieldValue = value[type.tagField];
            if(!tagFieldValue) {
                agg[key] = value;
            }
            else {
                agg[key] = deserialize(type.tagMap[tagFieldValue], value);
            }
        }
        else {
            agg[key] = value;
        }

        return agg;
    }, {} as {[key: string]: any})

    const target = new model();
    Object.assign(target, toMerge);

    return target;
}