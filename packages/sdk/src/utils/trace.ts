export const TRACE_FQ = Symbol('sdk:trace:fq');
export const TRACE_CURRENT = Symbol('sdk:trace:current');

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
            
            // Set current method context
            const previousCurrent = (this as any)[TRACE_CURRENT];
            (this as any)[TRACE_CURRENT] = fq;
            
            try {
                return original.apply(this, args);
            } finally {
                // Restore previous context
                (this as any)[TRACE_CURRENT] = previousCurrent;
            }
        };
        return descriptor;
    };
}

export function getFqp(thisArg: any): string {
    // Simply return the current execution context set by the decorator
    return thisArg?.[TRACE_CURRENT] ?? '';
}


