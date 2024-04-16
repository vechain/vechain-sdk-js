import { type ThorClient } from '../../../../../../thor-client';
import { assert, buildProviderError, DATA, JSONRPC } from '@vechain/sdk-errors';
import { blocksFormatter, type BlocksRPC } from '../../../../formatter';
import { RPCMethodsMap } from '../../../rpc-mapper';
import {
    RPC_METHODS,
    getCorrectBlockNumberRPCToVechain
} from '../../../../const';

/**
 * RPC Method eth_getBlockByNumber implementation
 *
 * @link [eth_getBlockByNumber](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_getblockbynumber)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *                 * params[0]: The block number to get as a hex string or "latest" or "finalized".
 *                 * params[1]: The transaction detail flag. If true, the block will contain the transaction details, otherwise it will only contain the transaction hashes.
 *
 * @returns the block at the given block number formatted to the RPC standard or null if the block does not exist.
 *
 * @note
 *  * Standard RPC method `eth_getBlockByNumber` support following block numbers: hex number of block, 'earliest', 'latest', 'safe', 'finalized', 'pending'. (@see https://ethereum.org/en/developers/docs/apis/json-rpc#default-block)
 *  * Currently, vechain only supports hex number of block, 'latest' and 'finalized'.
 *
 * @throws {ProviderRpcError} - Will throw an error if the retrieval of the block fails.
 */
const ethGetBlockByNumber = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<BlocksRPC | null> => {
    assert(
        'eth_getBlockByNumber',
        params.length === 2 &&
            typeof params[0] === 'string' &&
            typeof params[1] === 'boolean',
        DATA.INVALID_DATA_TYPE,
        'Invalid params length, expected 2.\nThe params should be [blockNumber: string (an hex number) | "latest" | "finalized", transactionDetailFlag: boolean]'
    );

    try {
        const [blockNumber, isTxDetail] = params as [string, boolean];

        let chainId: string = '0x0';

        // If the transaction detail flag is set, we need to get the chain id
        if (isTxDetail)
            chainId = (await RPCMethodsMap(thorClient)[RPC_METHODS.eth_chainId](
                []
            )) as string;

        const block = await thorClient.blocks.getBlockExpanded(
            getCorrectBlockNumberRPCToVechain(blockNumber)
        );

        return block !== null
            ? blocksFormatter.formatToRPCStandard(block, chainId)
            : null;
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_getBlockByNumber' failed: Error while getting block ${
                params[0] as string
            }\n
            Params: ${JSON.stringify(params)}\n
            URL: ${thorClient.httpClient.baseURL}`,
            {
                params,
                innerError: JSON.stringify(e)
            }
        );
    }
};

export { ethGetBlockByNumber };
