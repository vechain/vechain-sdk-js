"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HardhatVeChainProvider = void 0;
const sdk_errors_1 = require("@vechain/sdk-errors");
const sdk_logging_1 = require("@vechain/sdk-logging");
const http_1 = require("../../../http");
const thor_client_1 = require("../../../thor-client");
const vechain_provider_1 = require("../vechain-provider/vechain-provider");
/**
 * This class is a wrapper for the VeChainProvider that Hardhat uses.
 *
 * It exposes the interface that Hardhat expects, and uses the VeChainProvider as wrapped provider.
 */
class HardhatVeChainProvider extends vechain_provider_1.VeChainProvider {
    /**
     * Debug mode.
     */
    debug;
    /**
     * The function to use to build Hardhat errors.
     */
    buildHardhatErrorFunctionCallback;
    /**
     * RPC configuration.
     */
    rpcConfiguration;
    /**
     * Constructor with the network configuration.
     *
     * @param walletToUse - The wallet to use.
     * @param nodeUrl - The node url to use
     * @param buildHardhatErrorFunctionCallback - The function to use to build Hardhat errors.
     * @param debug - Debug mode.
     * @param enableDelegation - Enable fee delegation or not.
     */
    constructor(walletToUse, nodeUrl, buildHardhatErrorFunctionCallback, debug = false, enableDelegation = false, rpcConfiguration = {
        // By default, the eth_getTransactionCount method returns a random number.
        ethGetTransactionCountMustReturn0: false
    }) {
        // Initialize the provider with the network configuration.
        super(new thor_client_1.ThorClient(new http_1.SimpleHttpClient(nodeUrl)), walletToUse, enableDelegation);
        // Save the debug mode.
        this.debug = debug;
        // Save the RPC configuration.
        this.rpcConfiguration = rpcConfiguration;
        // Save the buildHardhatErrorFunction.
        this.buildHardhatErrorFunctionCallback =
            buildHardhatErrorFunctionCallback;
    }
    /**
     * Overload of the send method
     *
     * @param method - The method to call.
     * @param params - The parameters to pass to the method.
     */
    async send(method, params) {
        return await this.request({
            method,
            params
        });
    }
    /**
     * Overload of the sendAsync method.
     * It is the same of the send method, but with a callback.
     * Instead of returning the result, it calls the callback with the result.
     *
     * @param payload - The request payload (it contains method and params as 'send' method).
     * @param callback - The callback to call with the result.
     */
    async sendAsync(payload, callback) {
        try {
            const result = await this.request({
                method: payload.method,
                params: payload.params
            });
            // Execute the callback with the result
            callback(null, {
                id: payload.id,
                jsonrpc: '2.0',
                result
            });
        }
        catch (e) {
            // Execute the callback with the error
            callback(e, {
                id: payload.id,
                jsonrpc: '2.0'
            });
        }
    }
    /**
     * It sends the request through the VeChainProvider.
     *
     * @param args - The request arguments.
     */
    async request(args) {
        // Must return 0 with the eth_getTransactionCount method
        const mustReturn0 = this.rpcConfiguration.ethGetTransactionCountMustReturn0 &&
            args.method === 'eth_getTransactionCount';
        try {
            // Debug mode - get the request and the accounts
            if (this.debug) {
                const accounts = await this.wallet.getAddresses();
                const gasPayer = await this.wallet.getGasPayer();
                (0, sdk_logging_1.VeChainSDKLogger)('log').log({
                    title: `Sending request - ${args.method}`,
                    messages: [
                        `params: ${(0, sdk_errors_1.stringifyData)(args.params)}`,
                        `accounts: ${(0, sdk_errors_1.stringifyData)(accounts)}`,
                        `gasPayer: ${(0, sdk_errors_1.stringifyData)(gasPayer)}`,
                        `url: ${this.thorClient.httpClient.baseURL}`
                    ]
                });
            }
            // Send the request
            const result = mustReturn0
                ? '0x0'
                : await super.request({
                    method: args.method,
                    params: args.params
                });
            // Debug mode - get the result
            if (this.debug) {
                (0, sdk_logging_1.VeChainSDKLogger)('log').log({
                    title: `Get request - ${args.method} result`,
                    messages: [`result: ${(0, sdk_errors_1.stringifyData)(result)}`]
                });
            }
            return result;
        }
        catch (error) {
            // Debug the error
            if (this.debug) {
                (0, sdk_logging_1.VeChainSDKLogger)('error').log(new sdk_errors_1.JSONRPCInternalError(args.method, `Error on request - ${args.method}`, {
                    args
                }));
            }
            // eth_call transaction revert error already in correct format
            if (error instanceof sdk_errors_1.JSONRPCTransactionRevertError) {
                throw error;
            }
            if (error instanceof sdk_errors_1.VechainSDKError) {
                throw this.buildHardhatErrorFunctionCallback(`Error on request ${args.method}: ${error.innerError}`, error);
            }
        }
    }
}
exports.HardhatVeChainProvider = HardhatVeChainProvider;
