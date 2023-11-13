/**
 * Endpoints for the Theta REST API.
 *
 * @public
 */
const thorest = {
    /**
     * Account related endpoints.
     */
    accounts: {
        get: {
            ACCOUNT_DETAIL: (address: string): string => `/accounts/${address}`,
            ACCOUNT_BYTECODE: (address: string): string =>
                `/accounts/${address}/code`,
            STORAGE_AT: (address: string, position: string): string =>
                `/accounts/${address}/storage/${position}`
        }
        // @NOTE: Define better parameters and gas estimation
        // post: {
        //     ACCOUNT: (revision: string): string =>
        //         `/accounts/*?revision=${revision}`
        // }
    },

    /**
     * Block related endpoints.
     */
    blocks: {
        get: {
            BLOCK_DETAIL: (revision: string | number): string =>
                `/blocks/${revision}`
        }
    },

    /**
     * Transaction related endpoints.
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
