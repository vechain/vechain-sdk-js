import {
    Address,
    Clause,
    HexUInt,
    Secp256k1,
    VET,
    Transaction,
    networkInfo,
    type TransactionClause,
    type TransactionBody
} from '@vechain/sdk-core';
import { expect } from 'expect';

// START_SNIPPET: TxDependencySnippet

// 1 - Define transaction clauses

const txAClauses: TransactionClause[] = [
    Clause.transferVET(
        Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'),
        VET.of(1000)
    ) as TransactionClause
];
const txBClauses: TransactionClause[] = [
    Clause.transferVET(
        Address.of('0x7ccadeea14dd6727845b58f8aa7aad0f41a002a2'),
        VET.of(1)
    )
];

// 2 - Define transaction A with no dependencies

// @NOTE: This transaction has nonce = 1
const txABody: TransactionBody = {
    chainTag: networkInfo.mainnet.chainTag,
    blockRef: '0x0000000000000000',
    expiration: 0,
    clauses: txAClauses,
    gasPriceCoef: 0,
    gas: HexUInt.of(Transaction.intrinsicGas(txAClauses).wei).toString(), // use thor.gas.estimateGas() for better estimation
    dependsOn: null,
    nonce: 1
};

// 3 - Define transaction B with nonce = 2

// @NOTE: at the moment dependsOn is null
const txBBody: TransactionBody = {
    chainTag: networkInfo.mainnet.chainTag,
    blockRef: '0x0000000000000000',
    expiration: 0,
    clauses: txBClauses,
    gasPriceCoef: 0,
    gas: HexUInt.of(Transaction.intrinsicGas(txBClauses).wei).toString(), // use thor.gas.estimateGas() for better estimation
    dependsOn: null,
    nonce: 2
};

// Define the senders private key
const senderPrivateKey = await Secp256k1.generatePrivateKey();

// To define transaction B as dependent on transaction
// it's necessary to sign transaction A, and then get its Id
// and set that Id into transaction B's dependsOn field

// 4 - Get Tx A id

const txASigned = Transaction.of(txABody).sign(senderPrivateKey);

// 5 - Set it inside tx B

txBBody.dependsOn = txASigned.id.toString();

// 6 - Sign Tx B

const txBSigned = Transaction.of(txBBody).sign(senderPrivateKey);

// 7 - encode Tx B

const rawTxB = txBSigned.encode;

// Check (we can decode Tx B)
const decodedTx = Transaction.decode(rawTxB, true);

// END_SNIPPET: TxDependencySnippet

expect(decodedTx.body.dependsOn).toBe(txASigned.id.toString());
