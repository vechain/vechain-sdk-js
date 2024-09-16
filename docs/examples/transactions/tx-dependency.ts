import {
    networkInfo,
    Secp256k1,
    TransactionUtils,
    TransactionHandler,
    type TransactionClause,
    type TransactionBody,
    Units,
    clauseBuilder
} from '@vechain/sdk-core';
import { expect } from 'expect';

// START_SNIPPET: TxDependencySnippet

// 1 - Define transaction clauses

const txAClauses: TransactionClause[] = [
    clauseBuilder.transferVET(
        '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        Units.parseEther('1000').bi
    )
];
const txBClauses: TransactionClause[] = [
    clauseBuilder.transferVET(
        '0x7ccadeea14dd6727845b58f8aa7aad0f41a002a2',
        Units.parseEther('1').bi
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
    gas: TransactionUtils.intrinsicGas(txAClauses), // use thor.gas.estimateGas() for better estimation
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
    gas: TransactionUtils.intrinsicGas(txBClauses), // use thor.gas.estimateGas() for better estimation
    dependsOn: null,
    nonce: 2
};

// Define the senders private key
const senderPrivateKey = await Secp256k1.generatePrivateKey();

// To define transaction B as dependant on transaction A
// We need to sign transaction A, and then get its Id
// and set that Id into transaction B's dependsOn field

// 4 - Get Tx A id

const txASigned = TransactionHandler.sign(
    txABody,
    Buffer.from(senderPrivateKey)
);

// 5 - Set it inside tx B

txBBody.dependsOn = txASigned.id;

// 6 - Sign Tx B

const txBSigned = TransactionHandler.sign(
    txBBody,
    Buffer.from(senderPrivateKey)
);

// 7 - encode Tx B

const rawTxB = txBSigned.encoded;

// Check (we can decode Tx B)
const decodedTx = TransactionHandler.decode(rawTxB, true);

// END_SNIPPET: TxDependencySnippet

expect(decodedTx.body.dependsOn).toBe(txASigned.id);
