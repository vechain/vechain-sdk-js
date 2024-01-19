import { type DefaultErrorData } from '../../types';
import { ErrorBase } from '../base';

/**
 * Error to be thrown when the contract deployment failed.
 */
class ContractDeploymentFailedError extends ErrorBase<
    CONTRACT.CONTRACT_DEPLOYMENT_FAILED,
    DefaultErrorData
> {}

/**
 * Errors enum.
 */
enum CONTRACT {
    CONTRACT_DEPLOYMENT_FAILED = 'CONTRACT_DEPLOYMENT_FAILED'
}

export { ContractDeploymentFailedError, CONTRACT };
