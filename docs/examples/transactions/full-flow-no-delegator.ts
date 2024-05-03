import {
    clauseBuilder,
    TransactionHandler,
    unitsUtils
} from '@vechain/sdk-core';
import {
    ProviderInternalBaseWallet,
    signerUtils,
    ThorClient,
    VechainProvider
} from '@vechain/sdk-network';
import { expect } from 'expect'; // START_SNIPPET: FullFlowNoDelegatorSnippet

// START_SNIPPET: FullFlowNoDelegatorSnippet

// 1 - Create the thor client
const _soloUrl = 'http://localhost:8669/';
const thorSoloClient = ThorClient.fromUrl(_soloUrl, {
    isPollingEnabled: false
});

// Sender account with private key
const senderAccount = {
    privateKey:
        'f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26',
    address: '0x7a28e7361fd10f4f058f9fefc77544349ecff5d6'
};

// Create the provider (used in this case to sign the transaction with getSigner() method)
const provider = new VechainProvider(
    // Thor client used by the provider
    thorSoloClient,

    // Internal wallet used by the provider (needed to call the getSigner() method)
    new ProviderInternalBaseWallet([
        {
            privateKey: Buffer.from(senderAccount.privateKey, 'hex'),
            address: senderAccount.address
        }
    ]),

    // Disable fee delegation (BY DEFAULT IT IS DISABLED)
    false
);

// 2 - Create the transaction clauses
const transaction = {
    clauses: [
        clauseBuilder.transferVET(
            '0xb717b660cd51109334bd10b2c168986055f58c1a',
            unitsUtils.parseVET('1')
        )
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

const signedTransaction = TransactionHandler.decode(
    Buffer.from(rawSignedTransaction.slice(2), 'hex'),
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
