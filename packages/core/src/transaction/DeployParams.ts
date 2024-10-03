import { type AbiParameter } from 'viem';

/**
 * Represents the parameters required for deployment.
 * @interface DeployParams
 */
interface DeployParams {
    /**
     * An array of types associated with the deployment parameters.
     * @type {string | AbiParameter[]}
     */
    types: string | AbiParameter[];

    /**
     * An array of values corresponding to the deployment parameters.
     * @type {string[]}
     */
    values: string[];
}

export type { DeployParams };
