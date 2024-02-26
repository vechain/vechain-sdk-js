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
 * Error to be thrown when the private key is missing.
 */
class MissingPrivateKeyError extends ErrorBase<
    CONTRACT.MISSING_PRIVATE_KEY,
    DefaultErrorData
> {}

/**
 * Errors enum.
 */
enum CONTRACT {
    CONTRACT_DEPLOYMENT_FAILED = 'CONTRACT_DEPLOYMENT_FAILED',
    MISSING_PRIVATE_KEY = 'MISSING_PRIVATE_KEY'
}

export { ContractDeploymentFailedError, MissingPrivateKeyError, CONTRACT };
