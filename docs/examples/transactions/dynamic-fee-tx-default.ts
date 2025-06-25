import { Address, Clause, Transaction, VET, HDKey } from '@vechain/sdk-core';
import { THOR_SOLO_URL, ThorClient } from '@vechain/sdk-network';

// START_SNIPPET: DynamicFeeTxDefaultSnippet

// 1 - Create thor client for solo network
const thorClient = ThorClient.at(THOR_SOLO_URL);

// 2 - Derive account from mnemonic
const mnemonic =
    'denial kitchen pet squirrel other broom bar gas better priority spoil cross';
const child = HDKey.fromMnemonic(mnemonic.split(' ')).deriveChild(0);
const privateKey = child.privateKey;
const address = Address.ofPublicKey(child.publicKey).toString();

// 3 - Create transaction clauses
const clauses = [
    Clause.transferVET(
        Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'),
        VET.of(10000)
    )
];

// 4 - Estimate gas and get default body options
const gasResult = await thorClient.gas.estimateGas(clauses, address);
const defaultBodyOptions =
    await thorClient.transactions.fillDefaultBodyOptions();

// 5 - Build transaction body with default fees
const txBody = await thorClient.transactions.buildTransactionBody(
    clauses,
    gasResult.totalGas,
    defaultBodyOptions
);

// 6 - Sign transaction
const txClass = Transaction.of(txBody);
const txSigned = txClass.sign(privateKey);
const encodedTx = '0x' + Buffer.from(txSigned.encoded).toString('hex');

// 7 - Send transaction and wait for receipt
const txId = (await thorClient.transactions.sendRawTransaction(encodedTx)).id;
const receipt = await thorClient.transactions.waitForTransaction(txId);
console.log('Receipt:', receipt);

// END_SNIPPET: DynamicFeeTxDefaultSnippet
