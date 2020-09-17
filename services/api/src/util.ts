// tslint:disable-next-line
export const Sealed = (constructor: Function) => {
    Object.seal(constructor);
    Object.seal(constructor.prototype);
}