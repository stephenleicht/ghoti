import { ModelType } from './modelDecorator';
import { ModelMeta } from './ModelMeta';

export type ReferenceMeta = {
    _ghotiType: 'ref',
    model: ModelType<any>,
    modelMeta: ModelMeta
}

export function createReferenceMeta(model: ModelType<any>): ReferenceMeta {
    return {
        _ghotiType: 'ref',
        model: model,
        modelMeta: model.modelMeta,
    };
}