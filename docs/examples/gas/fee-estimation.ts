import { ThorClient, THOR_SOLO_URL } from '@vechain/sdk-network';
import { Transaction, Address, VET, Clause, HexUInt, HDKey, networkInfo } from '@vechain/sdk-core';

// START_SNIPPET: FeeEstimationSnippet

// 1 - Create thor client for solo network
const thor = ThorClient.at(THOR_SOLO_URL);

// 2 - Derive account from mnemonic
const mnemonic = 'denial kitchen pet squirrel other broom bar gas better priority spoil cross';
const child = HDKey.fromMnemonic(mnemonic.split(' ')).deriveChild(0);
if (!child.privateKey || !child.publicKey) throw new Error('Key derivation failed');
const privateKey = HexUInt.of(Array.from(child.privateKey).map(b => b.toString(16).padStart(2, '0')).join('')).bytes;
const address = Address.ofPublicKey(child.publicKey as Uint8Array).toString();

// 3 - Check if network supports dynamic fee transactions
if (!(await thor.forkDetector.isGalacticaForked('best'))) throw new Error('Network does not support dynamic fee tx');

// 4 - Create transaction clauses
const clauses = [Clause.transferVET(Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'), VET.of(10000))];

// 5 - Estimate gas and get default body options
const gasResult = await thor.gas.estimateGas(clauses, address);
const defaultBodyOptions = await thor.transactions.fillDefaultBodyOptions();

// 6 - Build transaction body with explicit values
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

// 7 - Sign transaction
const txClass = Transaction.of(txBody);
const txSigned = txClass.sign(privateKey);
const encodedTx = '0x' + Buffer.from(txSigned.encoded).toString('hex');

// 8 - Send transaction and wait for receipt
const txId = (await thor.transactions.sendRawTransaction(encodedTx)).id;
const receipt = await thor.transactions.waitForTransaction(txId);
console.log('Receipt:', receipt);

// END_SNIPPET: FeeEstimationSnippet 