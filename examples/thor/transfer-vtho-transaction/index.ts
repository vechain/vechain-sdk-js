import { Address, HexUInt, Revision } from '@vechain/sdk-temp/common';
import {
  ClauseBuilder,
  formatEther,
  PrivateKeySigner,
  ThorClient,
  ThorNetworks,
} from '@vechain/sdk-temp/thor';

// Create testnet thor client
const thorClient = ThorClient.at(ThorNetworks.TESTNET);

// Setup the signer of the transaction
const privateKey = HexUInt.of(
  'f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26'
).bytes;
const senderAddress = Address.ofPrivateKey(privateKey);
const signer = new PrivateKeySigner(privateKey);

// create the transaction details
const receiverAddress = senderAddress;
const amount = 0n;
const clauses = [];
// add a transfer VTHO clause to the transaction
clauses.push(ClauseBuilder.transferVTHO(receiverAddress, amount));

// execute the transaction
// note: the executeClauses method estimates the gas and signs and sends the transaction in one go
const transactionId = await thorClient.transactions.executeClauses(
  clauses,
  signer,
  { revision: Revision.BEST, gasPadding: 0.2 }
);

// wait for the receipt of the transaction
const transactionReceipt =
  await thorClient.transactions.waitForTransactionReceipt(transactionId);
console.log('Transaction receipt:', transactionReceipt);



