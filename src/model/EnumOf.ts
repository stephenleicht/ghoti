export type EnumOfMeta = {
    _ghotiType: 'enumOf',
    enumOf: {[key: string]: string}
}

export function createEnumOfMeta(type: any): EnumOfMeta {
    const enumMeta = Object.entries(type as {[key: string]: string})
    .reduce((agg, [displayValue, key]) => {
        agg[key] = displayValue;
        return agg;
    }, {} as {[key: string]: string})

    return {
        _ghotiType: 'enumOf',
        enumOf: enumMeta,
    };
}