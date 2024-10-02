/**
 * RPC Method txpool_content implementation
 *
 * @link [txpool_content](https://www.quicknode.com/docs/ethereum/txpool_content)
 *
 * @note
 *  * We return a constant empty object for now.
 *
 * @returns The transaction pool status
 */
const txPoolContent = async (): Promise<object> => {
    return await Promise.resolve({});
};

export { txPoolContent };
