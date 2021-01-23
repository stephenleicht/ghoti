export type PrimitiveMeta = {
    _ghotiType: 'primitive',
    type: StringConstructor | NumberConstructor | BooleanConstructor
}

export function createPrimitiveMeta(type: StringConstructor | NumberConstructor | BooleanConstructor): PrimitiveMeta {
    return {
        _ghotiType: 'primitive',
        type,
    };
}