import { contract, networkInfo } from '@vechain/vechain-sdk-core';
import {
    Transaction,
    TransactionHandler,
    HDNode,
    type TransactionClause,
    type TransactionBody,
    mnemonic,
    unitsUtils
} from '@vechain/vechain-sdk-core';
import { expect } from 'expect';
import { HttpClient, ThorClient } from '@vechain/vechain-sdk-network';

// Sender account with private key
const senderAccount = {
    privateKey:
        'f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26',
    address: '0x7a28e7361fd10f4f058f9fefc77544349ecff5d6'
};

// 1 - Create thor client for solo network
const _soloUrl = 'http://localhost:8669/';
const soloNetwork = new HttpClient(_soloUrl);
const thorSoloClient = new ThorClient(soloNetwork, {
    isPollingEnabled: false
});

// 2 - Define clause and estimate gas

const clauses: TransactionClause[] = [
    contract.clauseBuilder.transferVET(
        '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
        unitsUtils.parseVET('10000')
    )
];

// Get gas estimate
const gasResult = await thorSoloClient.gas.estimateGas(
    clauses,
    senderAccount.address
);

// 3 - Define transaction body

const body: TransactionBody = {
    chainTag: networkInfo.mainnet.chainTag,
    blockRef: '0x0000000000000000',
    expiration: 0,
    clauses,
    gasPriceCoef: 0,
    gas: gasResult.totalGas,
    dependsOn: null,
    nonce: 1,
    reserved: {
        features: 1 // set the transaction to be delegated
    }
};

// 4 - Create private keys of sender and delegate

const nodeDelegate = HDNode.fromMnemonic(mnemonic.generate());
const delegatorPrivateKey = nodeDelegate.privateKey;

// 5 - Get address of delegate

const delegatorAddress = nodeDelegate.address;

// 6 - Sign transaction as sender and delegate

const unsignedTx = new Transaction(body);
const signedTransaction = TransactionHandler.signWithDelegator(
    unsignedTx,
    Buffer.from(senderAccount.privateKey, 'hex'),
    delegatorPrivateKey
);

// 7 - Encode transaction

const encodedRaw = signedTransaction.encoded;

// 8 - Decode transaction and check

const decodedTx = TransactionHandler.decode(encodedRaw, true);
expect(decodedTx.isDelegated).toBeTruthy();
expect(decodedTx.delegator).toBe(delegatorAddress);
