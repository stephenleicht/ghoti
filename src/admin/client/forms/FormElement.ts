export interface FormElement<T> {
    name: string,
    value?: T,
    onChange?: (newValue: T) => void,
}