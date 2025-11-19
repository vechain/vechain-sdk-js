"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VechainSDKError = void 0;
const helpers_1 = require("../helpers");
/**
 * Generic error class for SDK errors.
 *
 * Each error of SDK should extend this class.
 * And, then, error must redefine properly the TErrorDataType generic type.
 * In this way, the error will have a specific data type.
 */
class VechainSDKError extends Error {
    methodName;
    errorMessage;
    data;
    innerError;
    constructor(methodName, errorMessage, data, innerError) {
        super((0, helpers_1.createErrorMessage)(methodName, errorMessage, data, innerError === undefined
            ? undefined
            : (0, helpers_1.assertInnerError)(innerError)));
        this.methodName = methodName;
        this.errorMessage = errorMessage;
        this.data = data;
        this.innerError = innerError;
    }
}
exports.VechainSDKError = VechainSDKError;
