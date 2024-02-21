import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';
import {
    type HttpNetworkConfig,
    type EthereumProvider,
    type JsonRpcRequest,
    type JsonRpcResponse
} from 'hardhat/types';
import { VechainProvider } from '../vechain-provider';
import { createWalletFromHardhatNetworkConfig } from '../../utils';
import { type Wallet } from '@vechain/vechain-sdk-wallet';
import { EventEmitter } from 'events';
import type { EIP1193RequestArguments } from '../../eip1193';

/**
 * This class is a wrapper for the VechainProvider that Hardhat uses.
 *
 * It exposes the interface that Hardhat expects, and uses the VechainProvider as wrapped provider.
 */
class HardhatVechainProvider extends EventEmitter implements EthereumProvider {
    /**
     * The network configuration.
     */
    networkConfig: HttpNetworkConfig;

    /**
     * Debug mode.
     */
    debug: boolean;

    /**
     * Wrapped VechainProvider.
     */
    _wrappedProvider: VechainProvider;

    /**
     * Constructor with the network configuration.
     *
     * @param networkConfig - The network configuration given into hardhat.
     * @param debug - Debug mode.
     */
    constructor(networkConfig: HttpNetworkConfig, debug: boolean = false) {
        super();

        // Initialize the provider with the network configuration.
        this._wrappedProvider = new VechainProvider(
            new ThorClient(
                new HttpClient(networkConfig.url ?? 'http://localhost:8669')
            ),
            createWalletFromHardhatNetworkConfig(networkConfig)
        );

        // Save the network configuration.
        this.networkConfig = networkConfig;

        // Save the debug mode.
        this.debug = debug;
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
        try {
            const result = await this.request({
                method,
                params
            });
            return result;
        } catch (e) {
            if (this.debug) {
                console.log(
                    `\n****************** ERROR ON REQUEST ******************\n` +
                        `\n- request:\n\t\t${JSON.stringify(method)}` +
                        `\n- params:\n\t\t${JSON.stringify(params)}` +
                        `\n- url:\n\t\t${this._wrappedProvider.thorClient.httpClient.baseURL}` +
                        `\n- error:\n\t\t${JSON.stringify(e)}` +
                        `\n\n`
                );
            }
            process.exit(1);
        }
    }

    /**
     * Overload off the sendAsync method.
     * It is the same of the send method, but with a callback.
     * Instead of returning the result, it calls the callback with the result.
     *
     * @param payload - The request payload (it contains method and params as 'send' method).
     * @param callback - The callback to call with the result.
     */
    sendAsync(
        payload: JsonRpcRequest,
        callback: (error: unknown, response: JsonRpcResponse) => void
    ): void {
        // Make the request and call the callback with the result.
        this.request({
            method: payload.method,
            params: payload.params
        })
            // Make the request and call the callback with the result.
            .then((result) => {
                callback(null, {
                    id: payload.id,
                    jsonrpc: '2.0',
                    result
                });
            })

            // Errors occur, call the callback with the error.
            .catch((e) => {
                // Debug mode - get the request and the error
                if (this.debug) {
                    console.log(
                        `\n****************** ERROR ON REQUEST ******************\n` +
                            `\n- request:\n\t\t${JSON.stringify(payload.method)}` +
                            `\n- params:\n\t\t${JSON.stringify(payload.params)}` +
                            `\n- url:\n\t\t${this._wrappedProvider.thorClient.httpClient.baseURL}` +
                            `\n- error:\n\t\t${JSON.stringify(e)}` +
                            `\n\n`
                    );
                }

                // Do the callback with the error
                callback(e, {
                    id: payload.id,
                    jsonrpc: '2.0',
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    error: e
                });

                // Exit the process
                process.exit(1);
            });
    }

    /**
     * It sends the request through the VechainProvider.
     *
     * @param args - The request arguments.
     */
    async request(args: EIP1193RequestArguments): Promise<unknown> {
        // Debug mode - get the request and the accounts
        if (this.debug) {
            const accounts = await (
                this.getInternalVechainProvider().wallet as Wallet
            ).getAddresses();

            console.log(
                `\n****************** SENDING REQUEST ******************\n` +
                    `\n- method:\n\t\t${JSON.stringify(args.method)}` +
                    `\n- params:\n\t\t${JSON.stringify(args.params)}` +
                    `\n- accounts:\n\t\t${JSON.stringify(accounts)}` +
                    `\n- url:\n\t\t${this._wrappedProvider.thorClient.httpClient.baseURL}`
            );
        }

        // Send the request
        const result = await this._wrappedProvider.request({
            method: args.method,
            params: args.params as never
        });

        // Debug mode - get the result
        if (this.debug) {
            console.log(`- result:\n\t\t${JSON.stringify(result)}` + `\n\n`);
        }

        return result;
    }

    /**
     * Get the internal VechainProvider.
     *
     * @returns The internal VechainProvider.
     */
    getInternalVechainProvider(): VechainProvider {
        return this._wrappedProvider;
    }
}

export { HardhatVechainProvider };
