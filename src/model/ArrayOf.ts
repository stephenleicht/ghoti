import { GhotiType } from './GhotiType';
import { ModelType } from './modelDecorator';
import { createReferenceMeta } from './Reference';
import { array } from 'prop-types';

export type ArrayOfMeta = {
    _ghotiType: 'arrayOf',
    arrayOf: GhotiType
}

export function createArrayOfMeta(arrayOf: GhotiType | ModelType<any>): ArrayOfMeta {
    let ghotiType: GhotiType;

    if(arrayOf.hasOwnProperty('_ghotiType')) {
        ghotiType = arrayOf as GhotiType;
    }
    else {
        ghotiType = createReferenceMeta(arrayOf as ModelType<any>)
    }

    return {
        _ghotiType: 'arrayOf',
        arrayOf: ghotiType,
    };
}