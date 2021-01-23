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

export function omit<T extends {[key: string]: unknown}, U extends keyof T>(obj: T, ...fields: U[]): Omit<T, U> {
    const retVal = {} as {[key: string]: unknown};
    Object.entries(obj)
    .reduce((agg, curr) => {
        const key = curr[0] as U;
        const value = curr[1];
        if(!fields.includes(key)) {
            agg[(key as string)] = value;
        }
        
        return agg;
    }, retVal)

    return retVal as Omit<T, U>;
}