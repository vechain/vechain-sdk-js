/**
 * RPC Method txpool_status implementation
 *
 * @link [txpool_inspect](https://www.quicknode.com/docs/ethereum/txpool_inspect)
 *
 * @note
 *  * We return a constant empty object for now.
 *
 * @returns The transaction pool status
 */
const txPoolInspect = async (): Promise<object> => {
    return await Promise.resolve({});
};

export { txPoolInspect };
