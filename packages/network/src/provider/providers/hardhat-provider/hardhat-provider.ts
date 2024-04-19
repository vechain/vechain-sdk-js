import { VechainProvider } from '../vechain-provider';
import type { EIP1193RequestArguments } from '../../eip1193';
import { getJSONRPCErrorCode, JSONRPC } from '@vechain/sdk-errors';
import { VechainSDKLogger } from '@vechain/sdk-logging';
import {
    type BuildHardhatErrorFunction,
    type JsonRpcRequest,
    type JsonRpcResponse
} from './types';
import { HttpClient } from '../../../utils';
import { ThorClient } from '../../../thor-client';
import { type ProviderInternalWallet } from '../../helpers';

/**
 * This class is a wrapper for the VechainProvider that Hardhat uses.
 *
 * It exposes the interface that Hardhat expects, and uses the VechainProvider as wrapped provider.
 */
class HardhatVechainProvider extends VechainProvider {
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
     * It sends the request through the VechainProvider.
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

                VechainSDKLogger('log').log({
                    title: `Sending request - ${args.method}`,
                    messages: [
                        `params: ${JSON.stringify(args.params)}`,
                        `accounts: ${JSON.stringify(accounts)}`,
                        `delegator: ${JSON.stringify(delegator)}`,
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
                VechainSDKLogger('log').log({
                    title: `Get request - ${args.method} result`,
                    messages: [`result: ${JSON.stringify(result)}`]
                });
            }

            return result;
        } catch (e) {
            // Debug the error
            if (this.debug) {
                VechainSDKLogger('error').log({
                    errorCode: JSONRPC.INTERNAL_ERROR,
                    errorMessage: `Error on request - ${args.method}`,
                    errorData: {
                        code: getJSONRPCErrorCode(JSONRPC.INVALID_REQUEST),
                        message: `Error on request - ${args.method} to endpoint ${this.thorClient.httpClient.baseURL}`
                    },
                    innerError: e
                });
            }

            // Throw the error
            throw this.buildHardhatErrorFunctionCallback(
                `Error on request - ${args.method}`,
                e as Error
            );
        }
    }
}

export { HardhatVechainProvider };
