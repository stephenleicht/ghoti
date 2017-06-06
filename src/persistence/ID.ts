import constants from './constants';

import { addTypeMeta } from './PersistedField';

export default function ID(): PropertyDecorator {
    return (target: any, propertyKey: string): any  =>{
    let type = Reflect.getMetadata('design:type', target, propertyKey);

    type = type || String;

    addTypeMeta(target.constructor, propertyKey, type, true);
}
}