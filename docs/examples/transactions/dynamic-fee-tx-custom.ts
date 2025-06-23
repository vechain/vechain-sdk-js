import {
    Address,
    Clause,
    Transaction,
    VET,
    HDKey,
    Hex
} from '@vechain/sdk-core';
import { THOR_SOLO_URL, ThorClient } from '@vechain/sdk-network';

// Common setup code
const thorClient = ThorClient.at(THOR_SOLO_URL);
const mnemonic =
    'denial kitchen pet squirrel other broom bar gas better priority spoil cross';
const hdKey = HDKey.fromMnemonic(mnemonic.split(' '));
const privateKey = hdKey.privateKey;
const address = Address.ofPublicKey(hdKey.publicKey).toString();
const clauses = [
    Clause.transferVET(
        Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'),
        VET.of(10000)
    )
];
const gasResult = await thorClient.gas.estimateGas(clauses, address);
const defaultBodyOptions =
    await thorClient.transactions.fillDefaultBodyOptions();

// START_SNIPPET: DynamicFeeTxPriorityOnlySnippet
console.log('\nCase 1: Only maxPriorityFeePerGas');
const priorityOnlyOptions = {
    ...defaultBodyOptions,
    maxPriorityFeePerGas: '0x746a528800'
};
const txBody1 = await thorClient.transactions.buildTransactionBody(
    clauses,
    gasResult.totalGas,
    priorityOnlyOptions
);
const txClass1 = Transaction.of(txBody1);
const txSigned1 = txClass1.sign(privateKey);
const encodedTx1 = Hex.of(txSigned1.encoded).toString();
const txId1 = (await thorClient.transactions.sendRawTransaction(encodedTx1)).id;
const receipt1 = await thorClient.transactions.waitForTransaction(txId1);
console.log('Receipt:', receipt1);
// END_SNIPPET: DynamicFeeTxPriorityOnlySnippet

// START_SNIPPET: DynamicFeeTxMaxOnlySnippet
console.log('\nCase 2: Only maxFeePerGas');
const maxOnlyOptions = {
    ...defaultBodyOptions,
    maxFeePerGas: '0x098cb8c52800'
};
const txBody2 = await thorClient.transactions.buildTransactionBody(
    clauses,
    gasResult.totalGas,
    maxOnlyOptions
);
const txClass2 = Transaction.of(txBody2);
const txSigned2 = txClass2.sign(privateKey);
const encodedTx2 = Hex.of(txSigned2.encoded).toString();
const txId2 = (await thorClient.transactions.sendRawTransaction(encodedTx2)).id;
const receipt2 = await thorClient.transactions.waitForTransaction(txId2);
console.log('Receipt:', receipt2);
// END_SNIPPET: DynamicFeeTxMaxOnlySnippet

// START_SNIPPET: DynamicFeeTxBothSnippet
console.log('\nCase 3: Both maxPriorityFeePerGas and maxFeePerGas');
const bothOptions = {
    ...defaultBodyOptions,
    maxPriorityFeePerGas: '0x746a528800',
    maxFeePerGas: '0x098cb8c52800'
};
const txBody3 = await thorClient.transactions.buildTransactionBody(
    clauses,
    gasResult.totalGas,
    bothOptions
);
const txClass3 = Transaction.of(txBody3);
const txSigned3 = txClass3.sign(privateKey);
const encodedTx3 = '0x' + Buffer.from(txSigned3.encoded).toString('hex');
const txId3 = (await thorClient.transactions.sendRawTransaction(encodedTx3)).id;
const receipt3 = await thorClient.transactions.waitForTransaction(txId3);
console.log('Receipt:', receipt3);
// END_SNIPPET: DynamicFeeTxBothSnippet
