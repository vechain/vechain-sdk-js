import { Address, Clause, TransactionClause, TransactionHandler, VET } from '@vechain/sdk-core';
import {
    ProviderInternalBaseWallet,
    signerUtils,
    TESTNET_URL,
    ThorClient,
    VeChainProvider
} from '@vechain/sdk-network'; // START_SNIPPET: FullFlowDelegatorUrlSnippet
import { expect } from 'expect';

// START_SNIPPET: FullFlowDelegatorUrlSnippet

// 1 - Create the thor client
const thorClient = ThorClient.fromUrl(TESTNET_URL, {
    isPollingEnabled: false
});

// Sender account with private key
const senderAccount: {
    mnemonic: string;
    privateKey: string;
    address: string;
} = {
    mnemonic:
        'fat draw position use tenant force south job notice soul time fruit',
    privateKey:
        '2153c1e49c14d92e8b558750e4ec3dc9b5a6ac4c13d24a71e0fa4f90f4a384b5',
    address: '0x571E3E1fBE342891778151f037967E107fb89bd0'
};

// Delegator account with private key
const delegatorAccount = {
    URL: 'https://sponsor-testnet.vechain.energy/by/269'
};

// Create the provider (used in this case to sign the transaction with getSigner() method)
const providerWithDelegationEnabled = new VeChainProvider(
    // Thor client used by the provider
    thorClient,

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
                delegatorUrl: delegatorAccount.URL
            }
        }
    ),

    // Enable fee delegation
    true
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
const gasResult = await thorClient.gas.estimateGas(
    transaction.clauses,
    senderAccount.address
);

// 4 - Build transaction body
const txBody = await thorClient.transactions.buildTransactionBody(
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
    await thorClient.transactions.sendTransaction(delegatedSigned);

// 6 - Wait for transaction receipt
const txReceipt = await thorClient.transactions.waitForTransaction(
    sendTransactionResult.id
);

// END_SNIPPET: FullFlowDelegatorUrlSnippet

// Check the signed transaction
expect(delegatedSigned.isSigned).toEqual(true);
expect(delegatedSigned.isDelegated).toEqual(true);
// expect(signedTx.delegator).toEqual(delegatorAccount.address); ---

// Check the transaction receipt
expect(txReceipt).toBeDefined();
expect(txReceipt?.gasUsed).toBe(gasResult.totalGas);
expect(sendTransactionResult.id).toBe(txReceipt?.meta.txID);
