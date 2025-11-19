import { JsonRpcApiProvider, type JsonRpcError, type JsonRpcPayload, type JsonRpcResult } from 'ethers';
import { type HardhatVeChainProvider } from '../hardhat-provider/hardhat-provider';
/**
 * JSON RPC provider for ethers.
 * Needed to customize ethers functionality into hardhat plugin.
 */
declare class JSONRPCEthersProvider extends JsonRpcApiProvider {
    /**
     * Instance of Hardhat VeChain provider to wrap
     */
    hardhatProvider: HardhatVeChainProvider;
    /**
     * Constructor with parameters.
     *
     * @param chainId - The chain id of the network
     * @param networkName - The name of the network
     * @param hardhatProvider - The hardhat provider to wrap
     */
    constructor(chainId: number, networkName: string, hardhatProvider: HardhatVeChainProvider);
    /**
     * Override the send method to use the hardhat provider and to call _start method.
     *
     * @param method - The method to call
     * @param params - The parameters of the method
     */
    send(method: string, params: unknown[] | Record<string, unknown>): Promise<unknown>;
    /**
     * Internal method to send the payload to the hardhat provider.
     * This method is able to send multiple payloads. (send in batch)
     *
     * @param payload - The payload to send (request and method)'s
     */
    _send(payload: JsonRpcPayload | JsonRpcPayload[]): Promise<Array<JsonRpcResult | JsonRpcError>>;
}
export { JSONRPCEthersProvider };
//# sourceMappingURL=json-rpc-ethers-provider.d.ts.map