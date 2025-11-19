"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports._logErrorFunction = void 0;
/**
 * Error logger internal function.
 */
const _logErrorFunction = {
    log: (error) => {
        console.error(`\n****************** ERROR ON: %s ******************\n` +
            `- Error message: '%s'` +
            '\n- Error data:\n%o' +
            `\n- Internal error:\n%o\n`, error.methodName, error.errorMessage, error.data, error.innerError);
    }
};
exports._logErrorFunction = _logErrorFunction;
