import { sanitizeWebsocketBaseURL, toQueryString } from './helpers';
import { type VetTransferOptions, type EventOptions } from './types';

/**
 * Endpoints for the REST API.
 */
const thorest = {
    /**
     * Accounts related endpoints.
     */
    accounts: {
        get: {
            ACCOUNT_DETAIL: (address: string): string => `/accounts/${address}`,
            ACCOUNT_BYTECODE: (address: string): string =>
                `/accounts/${address}/code`,
            STORAGE_AT: (address: string, position: string): string =>
                `/accounts/${address}/storage/${position}`
        },
        post: {
            SIMULATE_TRANSACTION: (revision?: string): string => {
                return revision != null
                    ? `/accounts/*?revision=${revision}`
                    : `/accounts/*`;
            }
        }
    },

    /**
     * Blocks related endpoints.
     */
    blocks: {
        get: {
            BLOCK_DETAIL: (revision: string | number): string =>
                `/blocks/${revision}`
        }
    },

    /**
     * Nodes related endpoints.
     */
    nodes: {
        get: {
            NODES: (): string => '/node/network/peers'
        }
    },

    /**
     * Logs related endpoints.
     */
    logs: {
        post: {
            EVENT_LOGS: (): string => '/logs/event',
            TRANSFER_LOGS: (): string => '/logs/transfer'
        }
    },

    /**
     * Transactions related endpoints.
     */
    transactions: {
        get: {
            TRANSACTION: (id: string): string => `/transactions/${id}`,
            TRANSACTION_RECEIPT: (id: string): string =>
                `/transactions/${id}/receipt`
        },
        post: {
            TRANSACTION: (): string => `/transactions`
        }
    },

    /**
     * Subscriptions related endpoints.
     */
    subscriptions: {
        get: {
            /**
             * Subscribe to new blocks.
             *
             * @param baseURL - The URL of the node to request the subscription from.
             * @param position - (optional) The block id to start from, defaults to the best block.
             *
             * @returns The websocket subscription URL.
             */
            BLOCK: (baseURL: string, position?: string): string => {
                const queryParams = toQueryString({
                    pos: position
                });

                return `${sanitizeWebsocketBaseURL(
                    baseURL
                )}/subscriptions/block${queryParams}`;
            },

            /**
             * Subscribe to new events.
             *
             * @param baseURL - The URL of the node to request the subscription from.
             * @param options - (optional) The options for the subscription.
             *
             * @returns The websocket subscription URL.
             */
            EVENT: (baseURL: string, options?: EventOptions): string => {
                const queryParams = toQueryString({
                    pos: options?.position,
                    addr: options?.contractAddress,
                    t0: options?.topic0,
                    t1: options?.topic1,
                    t2: options?.topic2,
                    t3: options?.topic3,
                    t4: options?.topic4
                });

                return `${sanitizeWebsocketBaseURL(
                    baseURL
                )}/subscriptions/event${queryParams}`;
            },

            /**
             * Subscribe to new VET transfers.
             *
             * @param baseURL - The URL of the node to request the subscription from.
             * @param options - (optional) The options for the subscription.
             *
             * @returns The websocket subscription URL.
             */
            VET_TRANSFER: (
                baseURL: string,
                options?: VetTransferOptions
            ): string => {
                const queryParams = toQueryString({
                    pos: options?.position,
                    txOrigin: options?.signerAddress,
                    sender: options?.sender,
                    recipient: options?.receiver
                });

                return `${sanitizeWebsocketBaseURL(
                    baseURL
                )}/subscriptions/transfer${queryParams}`;
            },

            /**
             * Subscribe to new legacy beats.
             * A beat is a notification that a new block has been added to the blockchain with a bloom filter which can be used to check if the block contains any relevant account.
             * @note This subscription has been improved with dynamic size bloom filter with the new `BEAT` subscription.
             *
             * @param baseURL - The URL of the node to request the subscription from.
             * @param position - (optional) The block id to start from, defaults to the best block.
             *
             * @returns The websocket subscription URL.
             */
            BEAT_LEGACY: (baseURL: string, position?: string): string => {
                const queryParams = toQueryString({
                    pos: position
                });

                return `${sanitizeWebsocketBaseURL(
                    baseURL
                )}/subscriptions/beat${queryParams}`;
            },

            /**
             * Subscribe to new beats.
             * A beat is a notification that a new block has been added to the blockchain with a bloom filter which can be used to check if the block contains any relevant account.
             *
             * @param baseURL - The URL of the node to request the subscription from.
             * @param position - (optional) The block id to start from, defaults to the best block.
             *
             * @returns The websocket subscription URL.
             */
            BEAT: (baseURL: string, position?: string): string => {
                const queryParams = toQueryString({
                    pos: position
                });

                return `${sanitizeWebsocketBaseURL(
                    baseURL
                )}/subscriptions/beat2${queryParams}`;
            },

            /**
             * Subscribe to new transactions.
             *
             * @returns The websocket subscription URL.
             */
            NEW_TRANSACTIONS: (baseURL: string): string =>
                `${sanitizeWebsocketBaseURL(baseURL)}/subscriptions/txpool`
        }
    },

    /**
     * Debug related endpoints.
     */
    debug: {
        post: {
            TRACE_TRANSACTION_CLAUSE: (): string => `/debug/tracers`,
            TRACE_CONTRACT_CALL: (): string => `/debug/tracers/call`,
            RETRIEVE_STORAGE_RANGE: (): string => `/debug/storage-range`
        }
    }
};

export { thorest };
