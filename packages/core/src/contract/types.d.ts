import { type ParamType } from '../abi';

/**
 * Represents the parameters required for deployment.
 * @interface DeployParams
 */
interface DeployParams {
    /**
     * An array of types associated with the deployment parameters.
     * @type {string[] | ParamType[]}
     */
    types: string[] | ParamType[];

    /**
     * An array of values corresponding to the deployment parameters.
     * @type {string[]}
     */
    values: string[];
}

export type { DeployParams };
