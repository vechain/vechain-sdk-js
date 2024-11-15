import {
    Address,
    Clause,
    HexUInt,
    Transaction,
    VET,
    type TransactionClause
} from '@vechain/sdk-core';
import {
    ProviderInternalBaseWallet,
    signerUtils,
    THOR_SOLO_URL,
    ThorClient,
    VeChainProvider
} from '@vechain/sdk-network';
import { expect } from 'expect';

// START_SNIPPET: FullFlowNoDelegatorSnippet

// 1 - Create the thor client
const thorSoloClient = ThorClient.at(THOR_SOLO_URL, {
    isPollingEnabled: false
});

// Sender account with private key
const senderAccount: { privateKey: string; address: string } = {
    privateKey:
        'f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26',
    address: '0x7a28e7361fd10f4f058f9fefc77544349ecff5d6'
};

// Create the provider (used in this case to sign the transaction with getSigner() method)
const provider = new VeChainProvider(
    // Thor client used by the provider
    thorSoloClient,

    // Internal wallet used by the provider (needed to call the getSigner() method)
    new ProviderInternalBaseWallet([
        {
            privateKey: HexUInt.of(senderAccount.privateKey).bytes,
            address: senderAccount.address
        }
    ]),

    // Disable fee delegation (BY DEFAULT IT IS DISABLED)
    false
);

// 2 - Create the transaction clauses
const transaction = {
    clauses: [
        Clause.transferVET(
            Address.of('0xb717b660cd51109334bd10b2c168986055f58c1a'),
            VET.of(1)
        ) as TransactionClause
    ],
    simulateTransactionOptions: {
        caller: senderAccount.address
    }
};

// 3 - Estimate gas
const gasResult = await thorSoloClient.gas.estimateGas(
    transaction.clauses,
    transaction.simulateTransactionOptions.caller
);

// 4 - Build transaction body
const txBody = await thorSoloClient.transactions.buildTransactionBody(
    transaction.clauses,
    gasResult.totalGas
);

// 4 - Sign the transaction
const signer = await provider.getSigner(senderAccount.address);

const rawSignedTransaction = await signer.signTransaction(
    signerUtils.transactionBodyToTransactionRequestInput(
        txBody,
        senderAccount.address
    )
);

const signedTransaction = Transaction.decode(
    HexUInt.of(rawSignedTransaction.slice(2)).bytes,
    true
);

// 5 - Send the transaction
const sendTransactionResult =
    await thorSoloClient.transactions.sendTransaction(signedTransaction);

// 6 - Wait for transaction receipt
const txReceipt = await thorSoloClient.transactions.waitForTransaction(
    sendTransactionResult.id
);

// END_SNIPPET: FullFlowNoDelegatorSnippet

// Check the transaction receipt
expect(txReceipt).toBeDefined();
expect(txReceipt?.gasUsed).toBe(gasResult.totalGas);
expect(sendTransactionResult.id).toBe(txReceipt?.meta.txID);
