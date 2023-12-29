import { sanitizeWebsocketBaseURL, toQueryString } from './helpers';

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
             * @param position - (optional) The block id to start from, defaults to the best block.
             * @param contractAddress - (optional) The contract address to filter events by.
             * @param topic0 - (optional) The topic0 to filter events by.
             * @param topic1 - (optional) The topic1 to filter events by.
             * @param topic2 - (optional) The topic2 to filter events by.
             * @param topic3 - (optional) The topic3 to filter events by.
             * @param topic4 - (optional) The topic4 to filter events by.
             *
             * @returns The websocket subscription URL.
             */
            EVENT: (
                baseURL: string,
                position?: string,
                contractAddress?: string,
                topic0?: string,
                topic1?: string,
                topic2?: string,
                topic3?: string,
                topic4?: string
            ): string => {
                const queryParams = toQueryString({
                    pos: position,
                    addr: contractAddress,
                    t0: topic0,
                    t1: topic1,
                    t2: topic2,
                    t3: topic3,
                    t4: topic4
                });

                return `${sanitizeWebsocketBaseURL(
                    baseURL
                )}/subscriptions/event${queryParams}`;
            },

            /**
             * Subscribe to new VET transfers.
             *
             * @param baseURL - The URL of the node to request the subscription from.
             * @param position - (optional) The block id to start from, defaults to the best block.
             * @param signerAddress - (optional) The signer address to filter transfers by.
             * @param sender - (optional) The sender address to filter transfers by.
             * @param receiver - (optional) The receiver address to filter transfers by.
             *
             * @returns The websocket subscription URL.
             */
            VET_TRANSFER: (
                baseURL: string,
                position?: string,
                signerAddress?: string,
                sender?: string,
                receiver?: string
            ): string => {
                const queryParams = toQueryString({
                    pos: position,
                    txOrigin: signerAddress,
                    sender,
                    recipient: receiver
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
             * Subscribe to new transactions in the mempool.
             *
             * @returns The websocket subscription URL.
             */
            NEW_TRANSACTIONS: (baseURL: string): string =>
                `${sanitizeWebsocketBaseURL(baseURL)}/subscriptions/txpool`
        }
    }
};

export { thorest };
