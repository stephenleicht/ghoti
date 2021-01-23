import { GhotiType } from './GhotiType';
import { ModelType } from './modelDecorator';
import { createReferenceMeta } from './Reference';
import { createPrimitiveMeta } from './Primitive';

export type ArrayOfMeta = {
    _ghotiType: 'arrayOf',
    arrayOf: GhotiType
}

export function createArrayOfMeta(arrayOf: GhotiType | ModelType<any>): ArrayOfMeta {
    let ghotiType: GhotiType;

    if(arrayOf.hasOwnProperty('_ghotiType')) {
        ghotiType = arrayOf;
    }
    else if(arrayOf.modelMeta) {
        ghotiType = createReferenceMeta(arrayOf)
    }
    else {
        ghotiType = createPrimitiveMeta(arrayOf);
    }

    return {
        _ghotiType: 'arrayOf',
        arrayOf: ghotiType,
    };
}