import {
    clauseBuilder,
    Hex0x,
    secp256k1,
    type TransactionBody,
    type TransactionClause
} from '../../../../../../core';
import { type TransactionRequestInput } from '../../types';
import {
    DelegationHandler,
    type SignTransactionOptions,
    type ThorClient
} from '../../../../thor-client';

/**
 * -- START: TEMPORARY COMMENT --
 * Signature handler will be removed in the future.
 * This will happen when we will implement all signer methods in the signer classes.
 * -- END: TEMPORARY COMMENT --
 *
 * Signs a transaction internal method
 *
 * @param transaction - The transaction to sign
 * @param delegator - The delegator to use
 * @param thorClient - The ThorClient instance
 * @param privateKey - The private key of the signer
 * @returns The fully signed transaction
 */
async function signTransactionWithPrivateKey(
    transaction: TransactionRequestInput,
    delegator: SignTransactionOptions | null,
    thorClient: ThorClient,
    privateKey: Buffer
): Promise<string> {
    // 1 - Initiate the transaction clauses
    // @NOTE: implement multiple clauses support here
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

    // 3 - Create transaction body
    const transactionBody = await thorClient.transactions.buildTransactionBody(
        transactionClauses,
        gasResult.totalGas,
        {
            isDelegated: DelegationHandler(delegator).isDelegated()
        }
    );

    // 5 - Generate nonce.
    // @NOTE: To be compliant with the standard and to avoid nonce overflow, we generate a random nonce of 6 bytes

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { nonce, ...transactionBodyWithoutNonce } = transactionBody;
    const newNonce = Hex0x.of(secp256k1.randomBytes(6));

    const finalTransactionBody: TransactionBody = {
        nonce: newNonce,
        ...transactionBodyWithoutNonce
    };

    // 6 - Sign the transaction

    const signedTransaction = await thorClient.transactions.signTransaction(
        finalTransactionBody,
        privateKey.toString('hex'),
        DelegationHandler(delegator).delegatorOrUndefined()
    );

    return Hex0x.of(signedTransaction.encoded);
}

export { signTransactionWithPrivateKey };
