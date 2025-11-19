"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractDeploymentFailed = exports.ContractCallError = void 0;
const sdk_error_1 = require("../sdk-error");
/**
 * Cannot find transaction error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the transaction is not into the blockchain.
 */
class ContractDeploymentFailed extends sdk_error_1.VechainSDKError {
}
exports.ContractDeploymentFailed = ContractDeploymentFailed;
/**
 * Error when calling a read function on a contract.
 *
 * WHEN TO USE:
 * * Error will be thrown when a read (call) operation fails.
 */
class ContractCallError extends sdk_error_1.VechainSDKError {
}
exports.ContractCallError = ContractCallError;
