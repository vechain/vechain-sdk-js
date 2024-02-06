/**
 * Get the correct block number for the given block number.
 *
 * @param blockNumber - The block number to get as a hex string or "latest" or "finalized".
 *
 * @note
 *  * Standard RPC method `eth_getBlockByNumber` support following block numbers: hex number of block, 'earliest', 'latest', 'safe', 'finalized', 'pending'. (@see https://ethereum.org/en/developers/docs/apis/json-rpc#default-block)
 *  * Currently, vechain only supports hex number of block, 'latest' and 'finalized'.
 */
const getCorrectBlockNumberRPCToVechain = (blockNumber: string): string => {
    if (blockNumber === 'latest') return 'best'; // 'best' is the alias for 'latest' in vechain Thorest
    return blockNumber;
};

export { getCorrectBlockNumberRPCToVechain };
