import {
    type SignTransactionOptions,
    type ThorClient
} from '@vechain/vechain-sdk-network';
import {
    assert,
    buildProviderError,
    DATA,
    JSONRPC
} from '@vechain/vechain-sdk-errors';
import { type VechainProvider } from '../../../../../providers';
import { ethSendRawTransaction } from '../eth_sendRawTransaction/eth_sendRawTransaction';
import {
    clauseBuilder,
    dataUtils,
    type TransactionClause
} from '@vechain/vechain-sdk-core';
import { type Wallet, type WalletAccount } from '@vechain/vechain-sdk-wallet';
import { type TransactionObjectInput } from './types';
import { randomBytes } from 'crypto';

/**
 * RPC Method eth_sendTransaction implementation
 *
 * @link [eth_sendTransaction](https://docs.metamask.io/wallet/reference/eth_sendtransaction/)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *               * params[0]: transaction - object - This describes the transaction info with following properties:
 *                   * to: 20 bytes - Address the transaction is directed to.
 *                   * from: 20 bytes [Required] - Address the transaction is sent from.
 *                   * gas: Hexadecimal value of the gas provided for the transaction execution as hex string.
 *                   * gasPrice: Hexadecimal value of the gasPrice used for each paid gas.
 *                   * value: Hexadecimal of the value sent with this transaction.
 *                   * data: Hash of the method signature and encoded parameters.
 *                   * maxPriorityFeePerGas: Maximum fee per gas the sender is willing to pay to miners in wei. Used in 1559 transactions.
 *                   * maxFeePerGas: The maximum total fee per gas the sender is willing to pay (includes the network / base fee and miner / priority fee) in wei. Used in 1559 transactions.
 * @provider - The provider instance to use.
 *
 * @NOTE: If 'to' address is not provided.
 * It will be assumed that the transaction is a contract creation transaction.
 * The 'data' field of the transaction will be used as the contract initialization code.
 *
 * @NOTE: 'gasPrice' cannot be used together with 'maxPriorityFeePerGas' and 'maxFeePerGas'.
 * 'maxPriorityFeePerGas' and 'maxFeePerGas' are not supported in the current version.
 *
 * @throws {ProviderRpcError} - Will throw an error if the transaction fails.
 * @throws {InvalidDataTypeError} - Will throw an error if the params are invalid.ù
 */
const ethSendTransaction = async (
    thorClient: ThorClient,
    params: unknown[],
    provider?: VechainProvider
): Promise<string> => {
    // Input validation
    assert(
        params.length === 1 && typeof params[0] === 'object',
        DATA.INVALID_DATA_TYPE,
        `Invalid params, expected one transaction object containing following properties: \n {` +
            `\n\tto: 20 bytes - Address the transaction is directed to.` +
            `\n\tfrom: 20 bytes [Required] - Address the transaction is sent from.` +
            `\n\tgas: Hexadecimal value of the gas provided for the transaction execution as hex string.` +
            `\n\tgasPrice: Hexadecimal value of the gasPrice used for each paid gas.` +
            `\n\tvalue: Hexadecimal of the value sent with this transaction.` +
            `\n\tdata: Hash of the method signature and encoded parameters.` +
            `\n\tmaxPriorityFeePerGas: Maximum fee per gas the sender is willing to pay to miners in wei. Used in 1559 transactions.` +
            `\n\tmaxFeePerGas: The maximum total fee per gas the sender is willing to pay (includes the network / base fee and miner / priority fee) in wei. Used in 1559 transactions.` +
            `\n}.`
    );

    // Provider must be defined
    assert(
        provider?.wallet !== undefined,
        JSONRPC.INVALID_PARAMS,
        'Provider must be defined with a wallet. Ensure that the provider is defined and connected to the network.'
    );

    // From field is required
    assert(
        (params[0] as TransactionObjectInput).from !== undefined,
        JSONRPC.INVALID_PARAMS,
        'From field is required in the transaction object.'
    );

    // Input params
    const [transaction] = params as [TransactionObjectInput];

    try {
        // 1 - Initiate the transaction clauses
        const transactionClauses: TransactionClause[] =
            transaction.to !== undefined
                ? // Normal transaction
                  [
                      {
                          to: transaction.to,
                          data: transaction.data ?? '0x',
                          value: transaction.value ?? '0x0'
                      } satisfies TransactionClause
                  ]
                : // If 'to' address is not provided, it will be assumed that the transaction is a contract creation transaction.
                  [clauseBuilder.deployContract(transaction.data ?? '0x')];

        // 2 - Estimate gas
        const gasResult = await thorClient.gas.estimateGas(
            transactionClauses,
            transaction.from
        );

        // 3 - Get the signed transaction (we already know wallet is defined, thanks to the input validation)
        const walletTouse: Wallet = provider?.wallet as Wallet;

        const delegatorIntoWallet: SignTransactionOptions | null =
            await walletTouse.getDelegator();

        const signerIntoWallet: WalletAccount | null =
            await walletTouse.getAccount(transaction.from);

        // 4 - Create transaction body
        const transactionBody =
            await thorClient.transactions.buildTransactionBody(
                transactionClauses,
                gasResult.totalGas,
                {
                    isDelegated: delegatorIntoWallet !== null
                }
            );

        // NOTE: To be compliant with the standard and to avoid nonce overflow, we generate a random nonce of 6 bytes

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { nonce, ...transactionBodyWithoutNonce } = transactionBody;
        const newNonce = `0x${dataUtils.toHexString(randomBytes(6))}`;

        // At least, a signer private key is required
        if (
            signerIntoWallet?.privateKey === null ||
            signerIntoWallet?.privateKey === undefined
        ) {
            throw buildProviderError(
                JSONRPC.INTERNAL_ERROR,
                `Method 'eth_sendTransaction' failed: Wallet has not the private key of signer.\n
                Params: ${JSON.stringify(params)}\n
                URL: ${thorClient.httpClient.baseURL}`
            );
        }
        // Sign the transaction
        const signedTransaction = await thorClient.transactions.signTransaction(
            { nonce: newNonce, ...transactionBodyWithoutNonce },
            signerIntoWallet.privateKey.toString('hex'),
            {
                delegatorPrivatekey: delegatorIntoWallet?.delegatorPrivatekey,
                delegatorUrl: delegatorIntoWallet?.delegatorUrl
            }
        );

        // Return the result
        return await ethSendRawTransaction(thorClient, [
            `0x${signedTransaction.encoded.toString('hex')}`
        ]);
    } catch (e) {
        throw buildProviderError(
            JSONRPC.INTERNAL_ERROR,
            `Method 'eth_sendTransaction' failed: Error sending the transaction\n
            Params: ${JSON.stringify(params)}\n
            URL: ${thorClient.httpClient.baseURL}`,
            {
                params,
                innerError: JSON.stringify(e)
            }
        );
    }
};

export { ethSendTransaction };
