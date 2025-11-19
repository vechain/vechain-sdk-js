/**
 * Generic error class for SDK errors.
 *
 * Each error of SDK should extend this class.
 * And, then, error must redefine properly the TErrorDataType generic type.
 * In this way, the error will have a specific data type.
 */
declare class VechainSDKError<TErrorDataType> extends Error {
    readonly methodName: string;
    readonly errorMessage: string;
    readonly data: TErrorDataType;
    readonly innerError?: unknown | undefined;
    constructor(methodName: string, errorMessage: string, data: TErrorDataType, innerError?: unknown | undefined);
}
export { VechainSDKError };
//# sourceMappingURL=sdk-error.d.ts.map