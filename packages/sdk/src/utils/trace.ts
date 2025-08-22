export const TRACE_FQ = Symbol('sdk:trace:fq');

export function Trace(modulePath: string) {
    const resolvedModulePath = modulePath;

    return function trace(_target: any, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
        const original = descriptor.value as (...args: any[]) => any;
        descriptor.value = function (...args: any[]) {
            // For static methods, 'this' is the class constructor itself
            // For instance methods, 'this' is the instance
            const className = (typeof this === 'function' ? (this as Function).name : this?.constructor?.name) ?? '<function>';
            const methodName = String(propertyKey);
            const fq = `${resolvedModulePath}!${className}.${methodName}`;

            const store = (this as any)[TRACE_FQ] ?? ((this as any)[TRACE_FQ] = {});
            store[methodName] = fq;
            return original.apply(this, args);
        };
        return descriptor;
    };
}

export function getFq(thisArg: any, methodName: string): string | undefined {
    return thisArg?.[TRACE_FQ]?.[methodName];
}


