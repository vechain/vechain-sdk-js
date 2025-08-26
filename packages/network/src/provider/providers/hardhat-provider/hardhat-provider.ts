import {
    JSONRPCInternalError,
    JSONRPCTransactionRevertError,
    stringifyData,
    VechainSDKError
} from '@vechain/sdk-errors';
import { VeChainSDKLogger } from '@vechain/sdk-logging';
import { SimpleHttpClient } from '../../../http';
import { ThorClient } from '../../../thor-client';
import type { EIP1193RequestArguments } from '../../eip1193';
import { type ProviderInternalWallet } from '../../helpers';
import { VeChainProvider } from '../vechain-provider/vechain-provider';
import {
    type BuildHardhatErrorFunction,
    type JsonRpcRequest,
    type JsonRpcResponse
} from './types';

/**
 * This class is a wrapper for the VeChainProvider that Hardhat uses.
 *
 * It exposes the interface that Hardhat expects, and uses the VeChainProvider as wrapped provider.
 */
class HardhatVeChainProvider extends VeChainProvider {
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
    constructor(
        walletToUse: ProviderInternalWallet,
        nodeUrl: string,
        buildHardhatErrorFunctionCallback: BuildHardhatErrorFunction,
        debug: boolean = false,
        enableDelegation: boolean = false,
        rpcConfiguration = {
            // By default, the eth_getTransactionCount method returns a random number.
            ethGetTransactionCountMustReturn0: false
        }
    ) {
        // Initialize the provider with the network configuration.
        super(
            new ThorClient(new SimpleHttpClient(nodeUrl)),
            walletToUse,
            enableDelegation
        );

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
    async send(method: string, params?: unknown[]): Promise<unknown> {
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
    async sendAsync(
        payload: JsonRpcRequest,
        callback: (error: unknown, response: JsonRpcResponse) => void
    ): Promise<void> {
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
        } catch (e) {
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
    async request(args: EIP1193RequestArguments): Promise<unknown> {
        // Must return 0 with the eth_getTransactionCount method
        const mustReturn0 =
            this.rpcConfiguration.ethGetTransactionCountMustReturn0 &&
            args.method === 'eth_getTransactionCount';

        try {
            // Debug mode - get the request and the accounts
            if (this.debug) {
                const accounts = await (
                    this.wallet as ProviderInternalWallet
                ).getAddresses();
                const gasPayer = await (
                    this.wallet as ProviderInternalWallet
                ).getGasPayer();

                VeChainSDKLogger('log').log({
                    title: `Sending request - ${args.method}`,
                    messages: [
                        `params: ${stringifyData(args.params)}`,
                        `accounts: ${stringifyData(accounts)}`,
                        `gasPayer: ${stringifyData(gasPayer)}`,
                        `url: ${this.thorClient.httpClient.baseURL}`
                    ]
                });
            }
            // Send the request
            const result = mustReturn0
                ? '0x0'
                : await super.request({
                      method: args.method,
                      params: args.params as never
                  });

            // Debug mode - get the result
            if (this.debug) {
                VeChainSDKLogger('log').log({
                    title: `Get request - ${args.method} result`,
                    messages: [`result: ${stringifyData(result)}`]
                });
            }

            return result;
        } catch (error) {
            // Debug the error
            if (this.debug) {
                VeChainSDKLogger('error').log(
                    new JSONRPCInternalError(
                        args.method,
                        `Error on request - ${args.method}`,
                        {
                            args
                        }
                    )
                );
            }

            // eth_call transaction revert error already in correct format
            if (error instanceof JSONRPCTransactionRevertError) {
                throw error;
            }

            if (error instanceof VechainSDKError) {
                throw this.buildHardhatErrorFunctionCallback(
                    `Error on request ${args.method}: ${error.innerError}`,
                    error
                );
            }
        }
    }
}

export { HardhatVeChainProvider };
