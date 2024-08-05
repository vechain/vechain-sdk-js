import { type ThorClient } from '../../../../../../thor-client';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import { blocksFormatter, type BlocksRPC } from '../../../../formatter';
import { RPCMethodsMap } from '../../../rpc-mapper';
import {
    getCorrectBlockNumberRPCToVeChain,
    RPC_METHODS
} from '../../../../const';
import { RPC_DOCUMENTATION_URL } from '../../../../../../utils';

/**
 * RPC Method eth_getBlockByNumber implementation
 *
 * @link [eth_getBlockByNumber](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_getblockbynumber)
 *
 * @note
 *  * Standard RPC method `eth_getBlockByNumber` support following block numbers: hex number of block, 'earliest', 'latest', 'safe', 'finalized', 'pending'. (@see https://ethereum.org/en/developers/docs/apis/json-rpc#default-block)
 *  * Currently, VeChainonly supports hex number of block, 'latest' and 'finalized'.
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The block number to get as a hex string or "latest" or "finalized".
 *                 * params[1]: The transaction detail flag. If true, the block will contain the transaction details, otherwise it will only contain the transaction hashes.
 * @returns the block at the given block number formatted to the RPC standard or null if the block does not exist.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethGetBlockByNumber = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<BlocksRPC | null> => {
    // Input validation
    if (
        params.length !== 2 ||
        typeof params[0] !== 'string' ||
        typeof params[1] !== 'boolean'
    )
        throw new JSONRPCInvalidParams(
            'eth_getBlockByNumber',
            -32602,
            `Invalid input params for "eth_getBlockByNumber" method. See ${RPC_DOCUMENTATION_URL} for details.`,
            { params }
        );

    try {
        const [blockNumber, isTxDetail] = params as [string, boolean];

        let chainId: string = '0x0';

        // If the transaction detail flag is set, we need to get the chain id
        if (isTxDetail)
            chainId = (await RPCMethodsMap(thorClient)[RPC_METHODS.eth_chainId](
                []
            )) as string;

        const block = isTxDetail
            ? await thorClient.blocks.getBlockExpanded(
                  getCorrectBlockNumberRPCToVeChain(blockNumber)
              )
            : await thorClient.blocks.getBlockCompressed(
                  getCorrectBlockNumberRPCToVeChain(blockNumber)
              );

        return block !== null
            ? blocksFormatter.formatToRPCStandard(block, chainId)
            : null;
    } catch (e) {
        throw new JSONRPCInternalError(
            'eth_getBlockByNumber()',
            -32603,
            'Method "eth_getBlockByNumber" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL,
                innerError: stringifyData(e)
            }
        );
    }
};

export { ethGetBlockByNumber };
