import {
    Address,
    Clause,
    networkInfo,
    Secp256k1,
    Transaction,
    VET,
    VTHO,
    VTHO_ADDRESS,
    type TransactionBody,
    type TransactionClause
} from '@vechain/sdk-core';
import { expect } from 'expect';

// START_SNIPPET: MultipleClausesSnippet

// 1 - Define multiple clauses

const clauses: TransactionClause[] = [
    Clause.transferVET(
        Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'),
        VET.of(10000)
    ) as TransactionClause,
    Clause.transferVTHOToken(
        Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'),
        VTHO.of(10000)
    ).clause as TransactionClause
];

// 2 - Calculate intrinsic gas of both clauses

const gas = Number(Transaction.intrinsicGas(clauses).wei);

// 3 - Body of transaction

const body: TransactionBody = {
    chainTag: networkInfo.mainnet.chainTag,
    blockRef: '0x0000000000000000',
    expiration: 32,
    clauses,
    gasPriceCoef: 0,
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

// END_SNIPPET: MultipleClausesSnippet

expect(decodedTx.body.clauses.length).toBe(clauses.length);
