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
import { expect } from 'expect'; // START_SNIPPET: FullFlowDelegatorPrivateKeySnippet

// START_SNIPPET: FullFlowDelegatorPrivateKeySnippet

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

// Delegator account with private key
const delegatorAccount = {
    privateKey:
        '521b7793c6eb27d137b617627c6b85d57c0aa303380e9ca4e30a30302fbc6676',
    address: '0x062F167A905C1484DE7e75B88EDC7439f82117DE'
};

// Create the provider (used in this case to sign the transaction with getSigner() method)
const providerWithDelegationEnabled = new VechainProvider(
    // Thor client used by the provider
    thorSoloClient,

    // Internal wallet used by the provider (needed to call the getSigner() method)
    new ProviderInternalBaseWallet(
        [
            {
                privateKey: Buffer.from(senderAccount.privateKey, 'hex'),
                address: senderAccount.address
            }
        ],
        {
            delegator: {
                delegatorPrivateKey: delegatorAccount.privateKey
            }
        }
    ),

    // Enable fee delegation
    true
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
    gasResult.totalGas,
    {
        isDelegated: true
    }
);

// 4 - Sign the transaction
const signer = await providerWithDelegationEnabled.getSigner(
    senderAccount.address
);

const rawDelegateSigned = await signer.signTransaction(
    signerUtils.transactionBodyToTransactionRequestInput(
        txBody,
        senderAccount.address
    )
);

const delegatedSigned = TransactionHandler.decode(
    Buffer.from(rawDelegateSigned.slice(2), 'hex'),
    true
);

// 5 - Send the transaction
const sendTransactionResult =
    await thorSoloClient.transactions.sendTransaction(delegatedSigned);

// 6 - Wait for transaction receipt
const txReceipt = await thorSoloClient.transactions.waitForTransaction(
    sendTransactionResult.id
);

// END_SNIPPET: FullFlowDelegatorPrivateKeySnippet

// Check the signed transaction
expect(delegatedSigned.isSigned).toEqual(true);
expect(delegatedSigned.isDelegated).toEqual(true);
expect(delegatedSigned.delegator).toEqual(delegatorAccount.address);

// Check the transaction receipt
expect(txReceipt).toBeDefined();
expect(txReceipt?.gasUsed).toBe(gasResult.totalGas);
expect(sendTransactionResult.id).toBe(txReceipt?.meta.txID);
