import {
    clauseBuilder,
    networkInfo,
    Secp256k1,
    type TransactionBody,
    type TransactionClause,
    TransactionHandler,
    TransactionUtils,
    Units
} from '@vechain/sdk-core';
import { expect } from 'expect';

// START_SNIPPET: SignDecodeSnippet

// 1 - Define clauses

const clauses: TransactionClause[] = [
    clauseBuilder.transferVET(
        '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        Units.parseEther('10000').bi
    )
];

// 2 - Calculate intrinsic gas of clauses

const gas = TransactionUtils.intrinsicGas(clauses);

// 3 - Body of transaction

const body: TransactionBody = {
    chainTag: networkInfo.mainnet.chainTag,
    blockRef: '0x0000000000000000',
    expiration: 0,
    clauses,
    gasPriceCoef: 128,
    gas,
    dependsOn: null,
    nonce: 12345678
};

// Create private key
const privateKey = await Secp256k1.generatePrivateKey();

// 4 - Sign transaction

const signedTransaction = TransactionHandler.sign(
    body,
    Buffer.from(privateKey)
);

// 5 - Encode transaction

const encodedRaw = signedTransaction.encoded;

// 6 - Decode transaction

const decodedTx = TransactionHandler.decode(encodedRaw, true);

// END_SNIPPET: SignDecodeSnippet

expect(decodedTx.body.chainTag).toBe(body.chainTag);
expect(decodedTx.body.nonce).toBe(body.nonce);
