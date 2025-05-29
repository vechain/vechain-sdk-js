import { ThorClient, THOR_SOLO_URL } from '@vechain/sdk-network';
import { Transaction, Address, VET, Clause, HDKey, networkInfo } from '@vechain/sdk-core';

// START_SNIPPET: FeeEstimationSnippet

// 1 - Create thor client for solo network
const thor = ThorClient.at(THOR_SOLO_URL);

// 2 - Derive account from mnemonic
const mnemonic = 'denial kitchen pet squirrel other broom bar gas better priority spoil cross';
const child = HDKey.fromMnemonic(mnemonic.split(' ')).deriveChild(0);
const privateKey = child.privateKey;
const address = Address.ofPublicKey(child.publicKey).toString();

// 3 - Create transaction clauses
const clauses = [Clause.transferVET(Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'), VET.of(10000))];

// 4 - Estimate gas and get default body options
const gasResult = await thor.gas.estimateGas(clauses, address);
const defaultBodyOptions = await thor.transactions.fillDefaultBodyOptions();

// 5 - Build transaction body with explicit values
const txBody = await thor.transactions.buildTransactionBody(
  clauses,
  gasResult.totalGas,
  {
    chainTag: networkInfo.solo.chainTag,
    blockRef: '0x0000000000000000',
    expiration: 32,
    gasPriceCoef: 128,
    dependsOn: null,
    nonce: 12345678,
    ...defaultBodyOptions
  }
);

// 6 - Sign transaction
const txClass = Transaction.of(txBody);
const txSigned = txClass.sign(privateKey);
const encodedTx = '0x' + Buffer.from(txSigned.encoded).toString('hex');

// 7 - Send transaction and wait for receipt
const txId = (await thor.transactions.sendRawTransaction(encodedTx)).id;
const receipt = await thor.transactions.waitForTransaction(txId);
console.log('Receipt:', receipt);

// END_SNIPPET: FeeEstimationSnippet 