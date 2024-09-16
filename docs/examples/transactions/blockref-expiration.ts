import {
    Secp256k1,
    TransactionUtils,
    TransactionHandler,
    networkInfo,
    type TransactionClause,
    type TransactionBody,
    Units,
    clauseBuilder
} from '@vechain/sdk-core';
import { expect } from 'expect';

// START_SNIPPET: BlockrefExpirationSnippet

// 1 - Define clauses

const clauses: TransactionClause[] = [
    clauseBuilder.transferVET(
        '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        Units.parseEther('1000').bi
    )
];

// 2 - Define transaction body

const body: TransactionBody = {
    chainTag: networkInfo.mainnet.chainTag,
    blockRef: '0x00ffecb8ac3142c4', // first 8 bytes of block id from block #16772280
    expiration: 32, // tx will expire after block #16772280 + 32
    clauses,
    gasPriceCoef: 0,
    gas: TransactionUtils.intrinsicGas(clauses), // use thor.gas.estimateGas() for better estimation
    dependsOn: null,
    nonce: 1
};

// 3 - Create private key

const privateKey = await Secp256k1.generatePrivateKey();

// 4 - Sign transaction

const signedTransaction = TransactionHandler.sign(
    body,
    Buffer.from(privateKey)
);

// 5 - Encode transaction

const encodedRaw = signedTransaction.encoded;

// 6 - Decode transaction and check

const decodedTx = TransactionHandler.decode(encodedRaw, true);

// END_SNIPPET: BlockrefExpirationSnippet

expect(decodedTx.body.blockRef).toBe(body.blockRef);
expect(decodedTx.body.expiration).toBe(body.expiration);
