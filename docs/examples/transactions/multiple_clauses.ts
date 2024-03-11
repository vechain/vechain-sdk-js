import {
    VTHO_ADDRESS,
    clauseBuilder,
    networkInfo
} from '@vechain/sdk-core';
import {
    secp256k1,
    TransactionUtils,
    TransactionHandler,
    type TransactionClause,
    type TransactionBody,
    unitsUtils
} from '@vechain/sdk-core';
import { expect } from 'expect';

// 1 - Define multiple clauses

const clauses: TransactionClause[] = [
    clauseBuilder.transferVET(
        '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        unitsUtils.parseVET('10000')
    ),
    clauseBuilder.transferToken(
        VTHO_ADDRESS,
        '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        unitsUtils.parseUnits('10000', 18) // 10000 VTHO
    )
];

// 2 - Calculate intrinsic gas of both clauses

const gas = TransactionUtils.intrinsicGas(clauses);

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
const privateKey = secp256k1.generatePrivateKey();

// 4 - Sign transaction

const signedTransaction = TransactionHandler.sign(body, privateKey);

// 5 - Encode transaction

const encodedRaw = signedTransaction.encoded;

// 6 - Decode transaction and check

const decodedTx = TransactionHandler.decode(encodedRaw, true);
expect(decodedTx.body.clauses.length).toBe(clauses.length);
