import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';
import {
    type EthereumProvider,
    type JsonRpcRequest,
    type JsonRpcResponse
} from 'hardhat/types';
import { VechainProvider } from '../vechain-provider';
import { type Wallet } from '@vechain/vechain-sdk-wallet';
import type { EIP1193RequestArguments } from '../../eip1193';
import {
    buildError,
    getJSONRPCErrorCode,
    JSONRPC
} from '@vechain/vechain-sdk-errors';

/**
 * This class is a wrapper for the VechainProvider that Hardhat uses.
 *
 * It exposes the interface that Hardhat expects, and uses the VechainProvider as wrapped provider.
 */
class HardhatVechainProvider
    extends VechainProvider
    implements EthereumProvider
{
    /**
     * Debug mode.
     */
    debug: boolean;

    /**
     * Constructor with the network configuration.
     *
     * @param walletToUse - The wallet to use.
     * @param nodeUrl - The node url to use
     * @param debug - Debug mode.
     */
    constructor(walletToUse: Wallet, nodeUrl: string, debug: boolean = false) {
        // Initialize the provider with the network configuration.
        super(new ThorClient(new HttpClient(nodeUrl)), walletToUse);

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
            return await this.request({
                method,
                params
            });
        } catch (e) {
            // Debug the error
            if (this.debug) {
                const delegator = await (this.wallet as Wallet).getDelegator();
                const accounts = await (this.wallet as Wallet).getAddresses();

                console.log(
                    `\n****************** ERROR ON REQUEST ******************\n` +
                        `\n- request:\n\t\t${JSON.stringify(method)}` +
                        `\n- params:\n\t\t${JSON.stringify(params)}` +
                        `\n- accounts:\n\t\t${JSON.stringify(accounts)}` +
                        `\n- delegator:\n\t\t${JSON.stringify(delegator)}` +
                        `\n- url:\n\t\t${this.thorClient.httpClient.baseURL}` +
                        `\n- error:\n\t\t${JSON.stringify(e)}` +
                        `\n\n`
                );
            }

            // Throw the error
            throw buildError(
                JSONRPC.INVALID_REQUEST,
                `Invalid request to endpoint ${method}`,
                {
                    code: getJSONRPCErrorCode(JSONRPC.INVALID_REQUEST),
                    message: `Invalid request to endpoint ${method}`
                },
                e
            );
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
        // Debug mode - get the request and the accounts
        if (this.debug) {
            const accounts = await (this.wallet as Wallet).getAddresses();
            const delegator = await (this.wallet as Wallet).getDelegator();

            console.log(
                `\n****************** SENDING REQUEST ******************\n` +
                    `\n- method:\n\t\t${JSON.stringify(args.method)}` +
                    `\n- params:\n\t\t${JSON.stringify(args.params)}` +
                    `\n- accounts:\n\t\t${JSON.stringify(accounts)}` +
                    `\n- delegator:\n\t\t${JSON.stringify(delegator)}` +
                    `\n- url:\n\t\t${this.thorClient.httpClient.baseURL}`
            );
        }

        // Send the request
        const result = await super.request({
            method: args.method,
            params: args.params as never
        });

        // Debug mode - get the result
        if (this.debug) {
            console.log(`- result:\n\t\t${JSON.stringify(result)}` + `\n\n`);
        }

        return result;
    }
}

export { HardhatVechainProvider };
