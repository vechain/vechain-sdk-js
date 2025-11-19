"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.thorest = void 0;
const helpers_1 = require("./helpers");
/**
 * Endpoints for the REST API.
 */
const thorest = {
    /**
     * Accounts related endpoints.
     */
    accounts: {
        get: {
            ACCOUNT_DETAIL: (address) => `/accounts/${address}`,
            ACCOUNT_BYTECODE: (address) => `/accounts/${address}/code`,
            STORAGE_AT: (address, position) => `/accounts/${address}/storage/${position}`
        },
        post: {
            SIMULATE_TRANSACTION: (revision) => {
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
            BLOCK_DETAIL: (revision) => `/blocks/${revision}`
        }
    },
    /**
     * Nodes related endpoints.
     */
    nodes: {
        get: {
            NODES: () => '/node/network/peers'
        }
    },
    /**
     * Logs related endpoints.
     */
    logs: {
        post: {
            EVENT_LOGS: () => '/logs/event',
            TRANSFER_LOGS: () => '/logs/transfer'
        }
    },
    /**
     * Transactions related endpoints.
     */
    transactions: {
        get: {
            TRANSACTION: (id) => `/transactions/${id}`,
            TRANSACTION_RECEIPT: (id) => `/transactions/${id}/receipt`
        },
        post: {
            TRANSACTION: () => `/transactions`
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
            BLOCK: (baseURL, position) => {
                const queryParams = (0, helpers_1.toQueryString)({
                    pos: position
                });
                return `${(0, helpers_1.sanitizeWebsocketBaseURL)(baseURL)}/subscriptions/block${queryParams}`;
            },
            /**
             * Subscribe to new events.
             *
             * @param baseURL - The URL of the node to request the subscription from.
             * @param options - (optional) The options for the subscription.
             *
             * @returns The websocket subscription URL.
             */
            EVENT: (baseURL, options) => {
                const queryParams = (0, helpers_1.toQueryString)({
                    pos: options?.position,
                    addr: options?.contractAddress,
                    t0: options?.topic0,
                    t1: options?.topic1,
                    t2: options?.topic2,
                    t3: options?.topic3,
                    t4: options?.topic4
                });
                return `${(0, helpers_1.sanitizeWebsocketBaseURL)(baseURL)}/subscriptions/event${queryParams}`;
            },
            /**
             * Subscribe to new VET transfers.
             *
             * @param baseURL - The URL of the node to request the subscription from.
             * @param options - (optional) The options for the subscription.
             *
             * @returns The websocket subscription URL.
             */
            VET_TRANSFER: (baseURL, options) => {
                const queryParams = (0, helpers_1.toQueryString)({
                    pos: options?.position,
                    txOrigin: options?.signerAddress,
                    sender: options?.sender,
                    recipient: options?.receiver
                });
                return `${(0, helpers_1.sanitizeWebsocketBaseURL)(baseURL)}/subscriptions/transfer${queryParams}`;
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
            BEAT_LEGACY: (baseURL, position) => {
                const queryParams = (0, helpers_1.toQueryString)({
                    pos: position
                });
                return `${(0, helpers_1.sanitizeWebsocketBaseURL)(baseURL)}/subscriptions/beat${queryParams}`;
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
            BEAT: (baseURL, position) => {
                const queryParams = (0, helpers_1.toQueryString)({
                    pos: position
                });
                return `${(0, helpers_1.sanitizeWebsocketBaseURL)(baseURL)}/subscriptions/beat2${queryParams}`;
            },
            /**
             * Subscribe to new transactions.
             *
             * @returns The websocket subscription URL.
             */
            NEW_TRANSACTIONS: (baseURL) => `${(0, helpers_1.sanitizeWebsocketBaseURL)(baseURL)}/subscriptions/txpool`
        }
    },
    /**
     * Debug related endpoints.
     */
    debug: {
        post: {
            TRACE_TRANSACTION_CLAUSE: () => `/debug/tracers`,
            TRACE_CONTRACT_CALL: () => `/debug/tracers/call`,
            RETRIEVE_STORAGE_RANGE: () => `/debug/storage-range`
        }
    },
    /**
     * Fees related endpoints.
     */
    fees: {
        get: {
            FEES_HISTORY: (blockCount, newestBlock, rewardPercentiles) => {
                const queryParams = (0, helpers_1.toQueryString)({
                    blockCount,
                    newestBlock,
                    rewardPercentiles: rewardPercentiles?.join(',')
                });
                return `/fees/history${queryParams}`;
            }
        }
    }
};
exports.thorest = thorest;
