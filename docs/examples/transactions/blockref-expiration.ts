import {
    Address,
    Clause,
    HexUInt,
    networkInfo,
    Secp256k1,
    Transaction,
    VET,
    type TransactionClause,
    type TransactionBody
} from '@vechain/sdk-core';
import { expect } from 'expect';

// START_SNIPPET: BlockrefExpirationSnippet

// 1 - Define clauses

const clauses: TransactionClause[] = [
    Clause.transferVET(
        Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'),
        VET.of(1000)
    ) as TransactionClause
];

// 2 - Define transaction body

const body: TransactionBody = {
    chainTag: networkInfo.mainnet.chainTag,
    blockRef: '0x00ffecb8ac3142c4', // first 8 bytes of block id from block #16772280
    expiration: 32, // tx will expire after block #16772280 + 32
    clauses,
    gasPriceCoef: 0,
    gas: HexUInt.of(Transaction.intrinsicGas(clauses).wei).toString(), // use thor.gas.estimateGas() for better estimation
    dependsOn: null,
    nonce: 1
};

// 3 - Create private key

const privateKey = await Secp256k1.generatePrivateKey();

// 4 - Sign transaction

const signedTransaction = Transaction.of(body).sign(privateKey);

// 5 - Encode transaction

const encodedRaw = signedTransaction.encode;

// 6 - Decode transaction and check

const decodedTx = Transaction.decode(encodedRaw, true);

// END_SNIPPET: BlockrefExpirationSnippet

expect(decodedTx.body.blockRef).toBe(body.blockRef);
expect(decodedTx.body.expiration).toBe(body.expiration);
