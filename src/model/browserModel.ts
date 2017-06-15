import { pick } from 'lodash';
// import * as mongoose from 'mongoose';
import * as stackTrace from 'stack-trace';

import { FieldMeta, ModelMeta } from './PersistedField';

import constants from './constants';

export default function Model() {
    return function modelDecorator<T>(target: T): T {
        return target;
    }
}
