import {
    Address,
    Clause,
    Secp256k1,
    Transaction,
    VET,
    networkInfo,
    type TransactionBody,
    type TransactionClause,
    HexUInt
} from '@vechain/sdk-core';
import { expect } from 'expect';

// START_SNIPPET: SignDecodeSnippet

// 1 - Define clauses

const clauses: TransactionClause[] = [
    Clause.transferVET(
        Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'),
        VET.of(10000)
    ) as TransactionClause
];

// 2 - Calculate intrinsic gas of clauses

const gas = HexUInt.of(Transaction.intrinsicGas(clauses).wei).toString();

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

const signedTransaction = Transaction.of(body).sign(privateKey);

// 5 - Encode transaction

const encodedRaw = signedTransaction.encoded;

// 6 - Decode transaction

const decodedTx = Transaction.decode(encodedRaw, true);

// END_SNIPPET: SignDecodeSnippet

expect(decodedTx.body.chainTag).toBe(body.chainTag);
expect(decodedTx.body.nonce).toBe(body.nonce);
