/**
 * Simple query builder for thor_client
 */
function buildQuery(
    params: Record<string, string | number | boolean | undefined>
): { query: string } {
    const queryParams: string[] = [];

    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
            queryParams.push(
                `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
            );
        }
    });

    return { query: queryParams.length > 0 ? `?${queryParams.join('&')}` : '' };
}

/**
 * Thor REST API endpoints
 */
const thorest = {
    accounts: {
        get: {
            ACCOUNT_DETAIL: (address: string) => `/accounts/${address}`,
            ACCOUNT_BYTECODE: (address: string) => `/accounts/${address}/code`,
            STORAGE_AT: (address: string, position: string) =>
                `/accounts/${address}/storage/${position}`
        },
        post: {
            SIMULATE_TRANSACTION: (revision?: string) =>
                `/accounts/${revision || 'best'}`
        }
    },
    blocks: {
        get: {
            BLOCK_DETAIL: (revision: string) => `/blocks/${revision}`
        }
    },
    transactions: {
        get: {
            TRANSACTION: (id: string) => `/transactions/${id}`,
            TRANSACTION_RECEIPT: (id: string) => `/transactions/${id}/receipt`
        },
        post: {
            TRANSACTION: () => `/transactions`
        }
    },
    logs: {
        post: {
            EVENT_LOGS: () => `/logs/event`,
            TRANSFER_LOGS: () => `/logs/transfer`
        }
    },
    debug: {
        post: {
            RETRIEVE_STORAGE_RANGE: () => `/debug/storage-range`,
            TRACE_CONTRACT_CALL: () => `/debug/tracers/call`,
            TRACE_TRANSACTION_CLAUSE: () => `/debug/tracers`
        }
    },
    fees: {
        get: {
            FEES_HISTORY: () => `/fees/history`
        }
    },
    nodes: {
        get: {
            NODES: () => `/node/network/peers`
        }
    }
};

export { buildQuery, thorest };
