"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JSONRPCEthersProvider = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const ethers_1 = require("ethers");
/**
 * JSON RPC provider for ethers.
 * Needed to customize ethers functionality into hardhat plugin.
 */
class JSONRPCEthersProvider extends ethers_1.JsonRpcApiProvider {
    /**
     * Instance of Hardhat VeChain provider to wrap
     */
    hardhatProvider;
    /**
     * Constructor with parameters.
     *
     * @param chainId - The chain id of the network
     * @param networkName - The name of the network
     * @param hardhatProvider - The hardhat provider to wrap
     */
    constructor(chainId, networkName, hardhatProvider) {
        super({ name: networkName, chainId });
        this.hardhatProvider = hardhatProvider;
    }
    /**
     * Override the send method to use the hardhat provider and to call _start method.
     *
     * @param method - The method to call
     * @param params - The parameters of the method
     */
    async send(method, params) {
        // Call the _start method
        this._start();
        // Call the _send method
        return (await super.send(method, params));
    }
    /**
     * Internal method to send the payload to the hardhat provider.
     * This method is able to send multiple payloads. (send in batch)
     *
     * @param payload - The payload to send (request and method)'s
     */
    async _send(payload) {
        // Initialize the request array
        const requestPayloadArray = Array.isArray(payload)
            ? payload
            : [payload];
        // Empty response array
        const responses = [];
        // Call the hardhat provider for each request
        for (const jsonRpcPayload of requestPayloadArray) {
            // Do the request
            try {
                const result = (await this.hardhatProvider.send(jsonRpcPayload.method, jsonRpcPayload.params));
                // Push the result to the response array
                responses.push({
                    id: jsonRpcPayload.id,
                    result
                });
            }
            catch (e) {
                // Push the error to the response array
                responses.push({
                    id: jsonRpcPayload.id,
                    error: {
                        code: -32603,
                        message: (0, sdk_errors_1.stringifyData)(e)
                    }
                });
            }
        }
        return responses;
    }
}
exports.JSONRPCEthersProvider = JSONRPCEthersProvider;
