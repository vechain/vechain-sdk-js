import { ThorClient, THOR_SOLO_URL } from '@vechain/sdk-network';
import { Transaction, Address, VET, Clause, HDKey, networkInfo } from '@vechain/sdk-core';

// Shared client instance for all examples
const thor = ThorClient.at(THOR_SOLO_URL);

// START_SNIPPET: PriorityFeeSnippet
// Query the current max priority fee per gas
const maxPriorityFee = await thor.gas.getMaxPriorityFeePerGas();
// END_SNIPPET: PriorityFeeSnippet

// START_SNIPPET: FeeHistorySnippet
// Query the recent fee history
const feeHistory = await thor.gas.getFeeHistory({ blockCount: 10, newestBlock: 'best' });
// END_SNIPPET: FeeHistorySnippet

// START_SNIPPET: BaseFeeSnippet
// Query the current base fee per gas
const baseFee = await thor.blocks.getBestBlockBaseFeePerGas();
// END_SNIPPET: BaseFeeSnippet

// Full transaction fee estimation and sending example
// 1. Derive account from mnemonic
const mnemonic = 'denial kitchen pet squirrel other broom bar gas better priority spoil cross';
const child = HDKey.fromMnemonic(mnemonic.split(' ')).deriveChild(0);
const privateKey = child.privateKey;
const address = Address.ofPublicKey(child.publicKey).toString();

// 2. Create transaction clauses
const clauses = [
  Clause.transferVET(Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'), VET.of(10000))
];

// START_SNIPPET: FeeEstimationSnippet
// 3. Estimate gas and get default body options
const gasResult = await thor.gas.estimateGas(clauses, address);
const defaultBodyOptions = await thor.transactions.fillDefaultBodyOptions();

// 4. Build transaction body with explicit values
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

// 5. Sign transaction
const txClass = Transaction.of(txBody);
const txSigned = txClass.sign(privateKey);
const encodedTx = '0x' + Buffer.from(txSigned.encoded).toString('hex');

// 6. Send transaction and wait for receipt
const txId = (await thor.transactions.sendRawTransaction(encodedTx)).id;
const receipt = await thor.transactions.waitForTransaction(txId);
// END_SNIPPET: FeeEstimationSnippet 