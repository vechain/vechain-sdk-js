import { VechainSDKError } from '../sdk-error';
import { type ObjectErrorData } from '../types';
/**
 * Cannot find transaction error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the transaction is not into the blockchain.
 */
declare class ContractDeploymentFailed extends VechainSDKError<ObjectErrorData> {
}
/**
 * Error when calling a read function on a contract.
 *
 * WHEN TO USE:
 * * Error will be thrown when a read (call) operation fails.
 */
declare class ContractCallError extends VechainSDKError<ObjectErrorData> {
}
export { ContractCallError, ContractDeploymentFailed };
//# sourceMappingURL=contract.d.ts.map