import { JSONRPCMethodNotImplemented } from '@vechain/sdk-errors';

/**
 * RPC Method eth_getProof implementation
 *
 * @link [eth_getProof](https://ethereum.github.io/execution-apis/api-documentation/)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 * @note:
 * * params[0]: ...
 * * params[1]: ...
 * * params[n]: ...
 */
const ethGetProof = async (): Promise<JSONRPCMethodNotImplemented> => {
    return await Promise.resolve(
        new JSONRPCMethodNotImplemented(
            'eth_getProof',
            'Method "eth_getProof" has not been implemented yet.',
            {}
        )
    );
};

export { ethGetProof };
