import {
    Address,
    Clause,
    Transaction,
    VET,
    HexUInt,
    HDKey
} from '@vechain/sdk-core';
import { THOR_SOLO_URL, ThorClient } from '@vechain/sdk-network';

// START_SNIPPET: DynamicFeeTxSnippet

// 1 - Create thor client for solo network
const thorClient = ThorClient.at(THOR_SOLO_URL);

// 2 - Derive account from mnemonic
const mnemonic = 'denial kitchen pet squirrel other broom bar gas better priority spoil cross';
const child = HDKey.fromMnemonic(mnemonic.split(' ')).deriveChild(0);
if (!child.privateKey || !child.publicKey) throw new Error('Key derivation failed');
const privateKey = HexUInt.of(Array.from(child.privateKey).map(b => b.toString(16).padStart(2, '0')).join('')).bytes;
const address = Address.ofPublicKey(child.publicKey as Uint8Array).toString();

// 3 - Check if network supports dynamic fee transactions
if (!(await thorClient.forkDetector.isGalacticaForked('best'))) throw new Error('Network does not support dynamic fee tx');

// 4 - Create transaction clauses
const clauses = [Clause.transferVET(Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'), VET.of(10000))];

// 5 - Estimate gas and get default body options
const gas = (await thorClient.gas.estimateGas(clauses, address)).totalGas;
const defaults = await thorClient.transactions.fillDefaultBodyOptions();

// 6 - Build and sign transaction
const txBody = await thorClient.transactions.buildTransactionBody(clauses, gas, defaults);
const tx = Transaction.of(txBody).sign(privateKey);

// 7 - Send transaction and wait for receipt
const txId = (await thorClient.transactions.sendRawTransaction('0x' + Buffer.from(tx.encoded).toString('hex'))).id;
const receipt = await thorClient.transactions.waitForTransaction(txId);
console.log('Receipt:', receipt);

// END_SNIPPET: DynamicFeeTxSnippet
