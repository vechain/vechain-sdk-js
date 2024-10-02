/**
 * RPC Method txpool_status implementation
 *
 * @link [txpool_status](https://www.quicknode.com/docs/ethereum/txpool_status)
 *
 * @note
 *  * We return a constant empty object for now.
 *
 * @returns The transaction pool status
 */
const txPoolStatus = async (): Promise<object> => {
    return await Promise.resolve({});
};

export { txPoolStatus };
