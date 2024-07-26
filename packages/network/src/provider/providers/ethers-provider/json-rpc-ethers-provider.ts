import { vechain_sdk_core_ethers } from '@vechain/sdk-core';
import { type HardhatVeChainProvider } from '../hardhat-provider';
import {
    type JsonRpcError,
    type JsonRpcPayload,
    type JsonRpcResult
} from './types';
import { stringifyData } from '@vechain/sdk-errors';

/**
 * JSON RPC provider for ethers.
 * Needed to customize ethers functionality into hardhat plugin.
 */
class JSONRPCEthersProvider extends vechain_sdk_core_ethers.JsonRpcApiProvider {
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
    constructor(
        chainId: number,
        networkName: string,
        hardhatProvider: HardhatVeChainProvider
    ) {
        super({ name: networkName, chainId });
        this.hardhatProvider = hardhatProvider;
    }

    /**
     * Override the send method to use the hardhat provider and to call _start method.
     *
     * @param method - The method to call
     * @param params - The parameters of the method
     */
    async send(
        method: string,
        params: unknown[] | Record<string, unknown>
    ): Promise<unknown> {
        // Call the _start method
        this._start();

        // Call the _send method
        return (await super.send(method, params)) as unknown;
    }

    /**
     * Internal method to send the payload to the hardhat provider.
     * This method is able to send multiple payloads. (send in batch)
     *
     * @param payload - The payload to send (request and method)'s
     */
    async _send(
        payload: JsonRpcPayload | JsonRpcPayload[]
    ): Promise<Array<JsonRpcResult | JsonRpcError>> {
        // Initialize the request array
        const requestPayloadArray = Array.isArray(payload)
            ? payload
            : [payload];

        // Empty response array
        const responses: Array<JsonRpcResult | JsonRpcError> = [];

        // Call the hardhat provider for each request
        for (const jsonRpcPayload of requestPayloadArray) {
            // Do the request
            try {
                const result = (await this.hardhatProvider.send(
                    jsonRpcPayload.method,
                    jsonRpcPayload.params as unknown[]
                )) as JsonRpcResult;

                // Push the result to the response array
                responses.push({
                    id: jsonRpcPayload.id,
                    result
                });
            } catch (e) {
                // Push the error to the response array
                responses.push({
                    id: jsonRpcPayload.id,
                    error: {
                        code: -32603,
                        message: stringifyData(e)
                    }
                });
            }
        }

        return responses;
    }
}

export { JSONRPCEthersProvider };
