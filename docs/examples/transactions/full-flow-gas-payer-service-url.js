import { Address, Clause, HexUInt, Transaction, VET } from '@vechain/sdk-core';
import { ProviderInternalBaseWallet, signerUtils, TESTNET_URL, ThorClient, VeChainProvider } from '@vechain/sdk-network';
import { expect } from 'expect';
// START_SNIPPET: FullFlowGasPayerServiceUrlSnippet
// 1 - Create the thor client
const thorClient = ThorClient.at(TESTNET_URL, {
    isPollingEnabled: false
});
// Sender account with private key
const senderAccount = {
    mnemonic: 'fat draw position use tenant force south job notice soul time fruit',
    privateKey: '2153c1e49c14d92e8b558750e4ec3dc9b5a6ac4c13d24a71e0fa4f90f4a384b5',
    address: '0x571E3E1fBE342891778151f037967E107fb89bd0'
};
// Gas-payer account with private key
const gasPayerAccount = {
    URL: 'https://sponsor-testnet.vechain.energy/by/883'
};
// Create the provider (used in this case to sign the transaction with getSigner() method)
const providerWithDelegationEnabled = new VeChainProvider(
// Thor client used by the provider
thorClient, 
// Internal wallet used by the provider (needed to call the getSigner() method)
new ProviderInternalBaseWallet([
    {
        privateKey: HexUInt.of(senderAccount.privateKey).bytes,
        address: senderAccount.address
    }
], {
    gasPayer: {
        gasPayerServiceUrl: gasPayerAccount.URL
    }
}), 
// Enable fee delegation
true);
// 2 - Create the transaction clauses
const transaction = {
    clauses: [
        Clause.transferVET(Address.of('0xb717b660cd51109334bd10b2c168986055f58c1a'), VET.of(1))
    ],
    simulateTransactionOptions: {
        caller: senderAccount.address
    }
};
// 3 - Estimate gas
const gasResult = await thorClient.transactions.estimateGas(transaction.clauses, senderAccount.address);
// 4 - Build transaction body
const txBody = await thorClient.transactions.buildTransactionBody(transaction.clauses, gasResult.totalGas, {
    isDelegated: true
});
// 4 - Sign the transaction
const signer = await providerWithDelegationEnabled.getSigner(senderAccount.address);
const rawDelegateSigned = await signer.signTransaction(signerUtils.transactionBodyToTransactionRequestInput(txBody, senderAccount.address));
const delegatedSigned = Transaction.decode(HexUInt.of(rawDelegateSigned.slice(2)).bytes, true);
// 5 - Send the transaction
const sendTransactionResult = await thorClient.transactions.sendTransaction(delegatedSigned);
// 6 - Wait for transaction receipt
const txReceipt = await thorClient.transactions.waitForTransaction(sendTransactionResult.id);
// END_SNIPPET: FullFlowGasPayerServiceUrlSnippet
// Check the signed transaction
expect(delegatedSigned.isSigned).toEqual(true);
expect(delegatedSigned.isDelegated).toEqual(true);
// expect(signedTx.gasPayer).toEqual(gasPayerAccount.address); ---
// Check the transaction receipt
expect(txReceipt).toBeDefined();
expect(txReceipt?.gasUsed).toBe(gasResult.totalGas);
expect(sendTransactionResult.id).toBe(txReceipt?.meta.txID);
