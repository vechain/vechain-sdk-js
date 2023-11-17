/**
 * Endpoints for the REST API.
 *
 * @public
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
    }
};

export { thorest };
