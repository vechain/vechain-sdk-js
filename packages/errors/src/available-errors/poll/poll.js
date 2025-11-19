"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollExecution = void 0;
const sdk_error_1 = require("../sdk-error");
/**
 * Poll execution error.
 *
 * WHEN TO USE:
 * * Error will be thrown when a poll execution of a function throw error
 */
class PollExecution extends sdk_error_1.VechainSDKError {
}
exports.PollExecution = PollExecution;
