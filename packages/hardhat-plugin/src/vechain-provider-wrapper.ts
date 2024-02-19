import { VechainProvider } from '@vechain/vechain-sdk-provider';
import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';
import {
    type EthereumProvider,
    type HttpNetworkConfig,
    type JsonRpcRequest,
    type JsonRpcResponse,
    type NetworkConfig,
    type RequestArguments
} from 'hardhat/types';
import { BaseWallet, type Wallet } from '@vechain/vechain-sdk-wallet';
import { EventEmitter } from 'events';

class HardhatProvider extends EventEmitter implements EthereumProvider {
    vechainProvider: VechainProvider;
    thorClient: ThorClient;
    wallet: Wallet;
    verbose: boolean;
    networkName: string;

    constructor(
        networkConfig: NetworkConfig,
        verbose: boolean,
        networkName: string
    ) {
        super();
        this.verbose = verbose;
        this.networkName = networkName;

        this.thorClient = new ThorClient(
            new HttpClient((networkConfig as HttpNetworkConfig).url)
        );
        // Implement createWallet
        this.wallet = new BaseWallet([], {});
        this.vechainProvider = new VechainProvider(
            this.thorClient,
            this.wallet
        );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async send(method: string, params?: any[] | undefined): Promise<any> {
        try {
            const result = await this.vechainProvider.request({
                method,
                params
            });
            if (this.verbose) {
                console.debug(
                    `Request:\n${JSON.stringify({ method, params })}`
                );
                console.debug(`Response:\n${JSON.stringify(result)}`);
            }
            return result;
        } catch (e) {
            if (this.verbose) {
                console.debug(
                    `Request:\n${JSON.stringify({ method, params })}`
                );
                console.error(`Error:\n${JSON.stringify(e)}`);
            }
            // View if throw buildProviderError
        }
    }

    sendAsync(
        payload: JsonRpcRequest,
        callback: (error: unknown, response: JsonRpcResponse) => void
    ): void {
        this.vechainProvider
            .request({
                method: payload.method,
                params: payload.params
            })
            .then((result) => {
                if (this.verbose) {
                    console.debug(`Request:\n${JSON.stringify(payload)}`);
                    console.debug(`Response:\n${JSON.stringify(result)}`);
                }
                return result;
            })
            .then((result) => {
                callback(null, {
                    id: payload.id,
                    jsonrpc: '2.0',
                    result
                });
            })
            .catch((error) => {
                if (this.verbose) {
                    console.debug(`Request:\n${JSON.stringify(payload)}`);
                    console.error(`Error:\n${JSON.stringify(error)}`);
                }
                callback(error, {
                    id: payload.id,
                    jsonrpc: '2.0',
                    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                    error
                });
            });
    }

    async request(args: RequestArguments): Promise<unknown> {
        try {
            const result = await this.vechainProvider.request({
                method: args.method,
                params: args.params as never
            });
            if (this.verbose) {
                console.debug(`Request:\n${JSON.stringify(args)}`);
                console.debug(`Response:\n${JSON.stringify(result)}`);
            }
            return result;
        } catch (e) {
            if (this.verbose) {
                console.debug(`Request:\n${JSON.stringify(args)}`);
                console.error(`Error:\n${JSON.stringify(e)}`);
            }
            // View if throw buildProviderError
        }
    }

    // addListener(
    //     eventName: string | symbol,
    //     listener: (...args: any[]) => void
    // ): this {
    //     throw new Error('Method not implemented.');
    // }
    //
    // on(eventName: string | symbol, listener: (...args: any[]) => void): this {
    //     throw new Error('Method not implemented.');
    // }
    //
    // once(eventName: string | symbol, listener: (...args: any[]) => void): this {
    //     throw new Error('Method not implemented.');
    // }
    //
    // removeListener(
    //     eventName: string | symbol,
    //     listener: (...args: any[]) => void
    // ): this {
    //     throw new Error('Method not implemented.');
    // }
    //
    // off(eventName: string | symbol, listener: (...args: any[]) => void): this {
    //     throw new Error('Method not implemented.');
    // }
    //
    // removeAllListeners(event?: string | symbol | undefined): this {
    //     throw new Error('Method not implemented.');
    // }
    //
    // setMaxListeners(n: number): this {
    //     throw new Error('Method not implemented.');
    // }
    //
    // getMaxListeners(): number {
    //     throw new Error('Method not implemented.');
    // }
    //
    // listeners(eventName: string | symbol): Function[] {
    //     throw new Error('Method not implemented.');
    // }
    //
    // rawListeners(eventName: string | symbol): Function[] {
    //     throw new Error('Method not implemented.');
    // }
    //
    // emit(eventName: string | symbol, ...args: any[]): boolean {
    //     throw new Error('Method not implemented.');
    // }
    //
    // listenerCount(
    //     eventName: string | symbol,
    //     listener?: Function | undefined
    // ): number {
    //     throw new Error('Method not implemented.');
    // }
    //
    // prependListener(
    //     eventName: string | symbol,
    //     listener: (...args: any[]) => void
    // ): this {
    //     throw new Error('Method not implemented.');
    // }
    //
    // prependOnceListener(
    //     eventName: string | symbol,
    //     listener: (...args: any[]) => void
    // ): this {
    //     throw new Error('Method not implemented.');
    // }
    //
    // eventNames(): Array<string | symbol> {
    //     throw new Error('Method not implemented.');
    // }
}

export { HardhatProvider };
