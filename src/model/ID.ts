import constants from './constants';

import { addTypeMeta } from './Field';

export default function ID(): PropertyDecorator {
    return (target: any, propertyKey: string | symbol): any => {
        let type = Reflect.getMetadata('design:type', target, propertyKey);

        type = type || String;

        addTypeMeta(target.constructor, propertyKey, {
            type,
            isID: true,
            editable: false,
            required: false,
        });
    }
}