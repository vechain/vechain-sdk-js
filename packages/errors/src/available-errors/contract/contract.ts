import { VechainSDKError } from '../sdk-error';
import { type ObjectErrorData } from '../types';

/**
 * Cannot find transaction error.
 *
 * WHEN TO USE:
 * * Error will be thrown when the transaction is not into the blockchain.
 */
class ContractDeploymentFailed extends VechainSDKError<ObjectErrorData> {}

export { ContractDeploymentFailed };
