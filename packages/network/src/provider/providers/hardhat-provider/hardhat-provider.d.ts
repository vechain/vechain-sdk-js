import type { EIP1193RequestArguments } from '../../eip1193';
import { type ProviderInternalWallet } from '../../helpers';
import { VeChainProvider } from '../vechain-provider/vechain-provider';
import { type BuildHardhatErrorFunction, type JsonRpcRequest, type JsonRpcResponse } from './types';
/**
 * This class is a wrapper for the VeChainProvider that Hardhat uses.
 *
 * It exposes the interface that Hardhat expects, and uses the VeChainProvider as wrapped provider.
 */
declare class HardhatVeChainProvider extends VeChainProvider {
    /**
     * Debug mode.
     */
    debug: boolean;
    /**
     * The function to use to build Hardhat errors.
     */
    buildHardhatErrorFunctionCallback: BuildHardhatErrorFunction;
    /**
     * RPC configuration.
     */
    rpcConfiguration: {
        ethGetTransactionCountMustReturn0: boolean;
    };
    /**
     * Constructor with the network configuration.
     *
     * @param walletToUse - The wallet to use.
     * @param nodeUrl - The node url to use
     * @param buildHardhatErrorFunctionCallback - The function to use to build Hardhat errors.
     * @param debug - Debug mode.
     * @param enableDelegation - Enable fee delegation or not.
     */
    constructor(walletToUse: ProviderInternalWallet, nodeUrl: string, buildHardhatErrorFunctionCallback: BuildHardhatErrorFunction, debug?: boolean, enableDelegation?: boolean, rpcConfiguration?: {
        ethGetTransactionCountMustReturn0: boolean;
    });
    /**
     * Overload of the send method
     *
     * @param method - The method to call.
     * @param params - The parameters to pass to the method.
     */
    send(method: string, params?: unknown[]): Promise<unknown>;
    /**
     * Overload of the sendAsync method.
     * It is the same of the send method, but with a callback.
     * Instead of returning the result, it calls the callback with the result.
     *
     * @param payload - The request payload (it contains method and params as 'send' method).
     * @param callback - The callback to call with the result.
     */
    sendAsync(payload: JsonRpcRequest, callback: (error: unknown, response: JsonRpcResponse) => void): Promise<void>;
    /**
     * It sends the request through the VeChainProvider.
     *
     * @param args - The request arguments.
     */
    request(args: EIP1193RequestArguments): Promise<unknown>;
}
export { HardhatVeChainProvider };
//# sourceMappingURL=hardhat-provider.d.ts.map