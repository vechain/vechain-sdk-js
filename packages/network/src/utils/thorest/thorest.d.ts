import { type VetTransferOptions, type EventOptions } from './types';
/**
 * Endpoints for the REST API.
 */
declare const thorest: {
    /**
     * Accounts related endpoints.
     */
    accounts: {
        get: {
            ACCOUNT_DETAIL: (address: string) => string;
            ACCOUNT_BYTECODE: (address: string) => string;
            STORAGE_AT: (address: string, position: string) => string;
        };
        post: {
            SIMULATE_TRANSACTION: (revision?: string) => string;
        };
    };
    /**
     * Blocks related endpoints.
     */
    blocks: {
        get: {
            BLOCK_DETAIL: (revision: string | number) => string;
        };
    };
    /**
     * Nodes related endpoints.
     */
    nodes: {
        get: {
            NODES: () => string;
        };
    };
    /**
     * Logs related endpoints.
     */
    logs: {
        post: {
            EVENT_LOGS: () => string;
            TRANSFER_LOGS: () => string;
        };
    };
    /**
     * Transactions related endpoints.
     */
    transactions: {
        get: {
            TRANSACTION: (id: string) => string;
            TRANSACTION_RECEIPT: (id: string) => string;
        };
        post: {
            TRANSACTION: () => string;
        };
    };
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
            BLOCK: (baseURL: string, position?: string) => string;
            /**
             * Subscribe to new events.
             *
             * @param baseURL - The URL of the node to request the subscription from.
             * @param options - (optional) The options for the subscription.
             *
             * @returns The websocket subscription URL.
             */
            EVENT: (baseURL: string, options?: EventOptions) => string;
            /**
             * Subscribe to new VET transfers.
             *
             * @param baseURL - The URL of the node to request the subscription from.
             * @param options - (optional) The options for the subscription.
             *
             * @returns The websocket subscription URL.
             */
            VET_TRANSFER: (baseURL: string, options?: VetTransferOptions) => string;
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
            BEAT_LEGACY: (baseURL: string, position?: string) => string;
            /**
             * Subscribe to new beats.
             * A beat is a notification that a new block has been added to the blockchain with a bloom filter which can be used to check if the block contains any relevant account.
             *
             * @param baseURL - The URL of the node to request the subscription from.
             * @param position - (optional) The block id to start from, defaults to the best block.
             *
             * @returns The websocket subscription URL.
             */
            BEAT: (baseURL: string, position?: string) => string;
            /**
             * Subscribe to new transactions.
             *
             * @returns The websocket subscription URL.
             */
            NEW_TRANSACTIONS: (baseURL: string) => string;
        };
    };
    /**
     * Debug related endpoints.
     */
    debug: {
        post: {
            TRACE_TRANSACTION_CLAUSE: () => string;
            TRACE_CONTRACT_CALL: () => string;
            RETRIEVE_STORAGE_RANGE: () => string;
        };
    };
    /**
     * Fees related endpoints.
     */
    fees: {
        get: {
            FEES_HISTORY: (blockCount: number, newestBlock: string | number, rewardPercentiles?: number[]) => string;
        };
    };
};
export { thorest };
//# sourceMappingURL=thorest.d.ts.map