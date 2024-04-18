import { assert, buildProviderError, DATA, JSONRPC } from '@vechain/sdk-errors';
import { getCorrectBlockNumberRPCToVechain } from '../../../../const';
import { type TransactionObjectInput } from './types';
import { type BlockQuantityInputRPC } from '../../../types';
import {
    type SimulateTransactionClause,
    type SimulateTransactionOptions,
    type ThorClient
} from '../../../../../../thor-client';

/**
 * RPC Method eth_call implementation
 *
 * @link [eth_call](https://docs.infura.io/networks/ethereum/json-rpc-methods/eth_call)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The transaction call object
 *
 * @returns The return value of executed contract.
 */
const ethCall = async (
    thorClient: ThorClient,
    params: unknown[]
): Promise<string> => {
    // Check input params
    assert(
        'eth_call',
        params.length === 2 &&
            typeof params[0] === 'object' &&
            (typeof params[1] === 'object' || typeof params[1] === 'string'),
        DATA.INVALID_DATA_TYPE,
        `Invalid params length, expected 1 object containing transaction info with following properties: \n{` +
            `\tfrom: 20 bytes [Required] Address the transaction is sent from.` +
            `\tto: 20 bytes - Address the transaction is directed to.` +
            `\tgas: Hexadecimal value of the gas provided for the transaction execution. eth_call consumes zero gas, but this parameter may be needed by some executions.` +
            `\tgasPrice: Hexadecimal value of the gasPrice used for each paid gas.` +
            `\tmaxPriorityFeePerGas: Maximum fee, in Wei, the sender is willing to pay per gas above the base fee` +
            `\tmaxFeePerGas: Maximum total fee (base fee + priority fee), in Wei, the sender is willing to pay per gas` +
            `\tvalue: Hexadecimal of the value sent with this transaction.` +
            `\tdata: Hash of the method signature and encoded parameters` +
            `}\n\n and the block tag parameter. 'latest', 'earliest', 'pending', 'safe' or 'finalized' or an object: \n{.` +
            '\tblockNumber: The number of the block' +
            '\n}\n\nOR\n\n{' +
            '\tblockHash: The hash of block' +
            '\n}'
    );

    try {
        const [inputOptions, block] = params as [
            TransactionObjectInput,
            BlockQuantityInputRPC
        ];

        // Simulate transaction
        const simulatedTx = await thorClient.transactions.simulateTransaction(
            [
                {
                    to: inputOptions.to ?? null,
                    value: inputOptions.value ?? '0x0',
                    data: inputOptions.data ?? '0x0'
                } satisfies SimulateTransactionClause
            ],
            {
                revision: getCorrectBlockNumberRPCToVechain(block),
                gas:
                    inputOptions.gas !== undefined
                        ? parseInt(inputOptions.gas, 16)
                        : undefined,
                gasPrice: inputOptions.gasPrice ?? inputOptions.gasPrice,
                caller: inputOptions.from
            } satisfies SimulateTransactionOptions
        );

        // Return simulated transaction data
        return simulatedTx[0].data;
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_call' failed: Error while simulating transaction\n
            Params: ${JSON.stringify(params)}\n
            URL: ${thorClient.httpClient.baseURL}`,
            {
                params,
                innerError: JSON.stringify(e)
            }
        );
    }
};

export { ethCall };
