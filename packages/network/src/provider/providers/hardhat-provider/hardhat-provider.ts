import { VeChainProvider } from '../vechain-provider';
import type { EIP1193RequestArguments } from '../../eip1193';
import {
    JSONRPCInternalError,
    stringifyData,
    VechainSDKError
} from '@vechain/sdk-errors';
import {
    type BuildHardhatErrorFunction,
    type JsonRpcRequest,
    type JsonRpcResponse
} from './types';
import { HttpClient } from '../../../utils';
import { ThorClient } from '../../../thor-client';
import { type ProviderInternalWallet } from '../../helpers';
import { VeChainSDKLogger } from '@vechain/sdk-logging';

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
        enableDelegation: boolean = false
    ) {
        // Initialize the provider with the network configuration.
        super(
            new ThorClient(new HttpClient(nodeUrl)),
            walletToUse,
            enableDelegation
        );

        // Save the debug mode.
        this.debug = debug;

        // Save the buildHardhatErrorFunction.
        this.buildHardhatErrorFunctionCallback =
            buildHardhatErrorFunctionCallback;
    }

    /**
     * Overload off the send method
     *
     * @param method - The method to call.
     * @param params - The parameters to pass to the method.
     */
    async send(
        method: string,
        params?: unknown[] | undefined
    ): Promise<unknown> {
        return await this.request({
            method,
            params
        });
    }

    /**
     * Overload off the sendAsync method.
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
        try {
            // Debug mode - get the request and the accounts
            if (this.debug) {
                const accounts = await (
                    this.wallet as ProviderInternalWallet
                ).getAddresses();
                const delegator = await (
                    this.wallet as ProviderInternalWallet
                ).getDelegator();

                VeChainSDKLogger('log').log({
                    title: `Sending request - ${args.method}`,
                    messages: [
                        `params: ${stringifyData(args.params)}`,
                        `accounts: ${stringifyData(accounts)}`,
                        `delegator: ${stringifyData(delegator)}`,
                        `url: ${this.thorClient.httpClient.baseURL}`
                    ]
                });
            }

            // Send the request
            const result = await super.request({
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
                        -32603,
                        `Error on request - ${args.method}`,
                        {
                            args
                        }
                    )
                );
            }

            if (error instanceof VechainSDKError) {
                // Throw the error
                throw this.buildHardhatErrorFunctionCallback(
                    `Error on request ${args.method}: ${error.innerError}`,
                    error
                );
            }

            // Throw the error
            throw this.buildHardhatErrorFunctionCallback(
                `Error on request ${args.method}`,
                error as Error
            );
        }
    }
}

export { HardhatVeChainProvider };
