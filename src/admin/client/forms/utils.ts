// Add small util functions here to keep the form library dependency free.


export function debounce<T extends Function>(func: T, delay: number = 50): T {
    let timeoutID: number;

    return function (this: any, ...args: any[]) {
        const context = this;

        clearTimeout(timeoutID);

        timeoutID = window.setTimeout(() => {
            timeoutID = -1;
            func.apply(context, args);
        }, delay);
    } as unknown as T; // Because typescript said so.
};

export function omit<T extends {[key: string]: any}>(obj: T, ...fields: string[]): T {
    const retVal = {} as T;
    Object.entries(obj)
    .reduce((agg, [key, value]) => {
        if(!fields.includes(key)) {
            agg[key] = value;
        }
        
        return agg;
    }, retVal)

    return retVal;
}