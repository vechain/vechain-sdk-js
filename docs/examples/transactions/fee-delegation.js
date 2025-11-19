import { Address, Clause, HDKey, HexUInt, Mnemonic, Transaction, VET, networkInfo } from '@vechain/sdk-core';
import { THOR_SOLO_URL, ThorClient } from '@vechain/sdk-network';
import { expect } from 'expect';
// START_SNIPPET: FeeDelegationSnippet
// Sender account with private key
const senderAccount = {
    privateKey: 'f9fc826b63a35413541d92d2bfb6661128cd5075fcdca583446d20c59994ba26',
    address: '0x7a28e7361fd10f4f058f9fefc77544349ecff5d6'
};
// 1 - Create thor client for solo network
const thorSoloClient = ThorClient.at(THOR_SOLO_URL, {
    isPollingEnabled: false
});
// 2 - Define clause and estimate gas
const clauses = [
    Clause.transferVET(Address.of('0x7567d83b7b8d80addcb281a71d54fc7b3364ffed'), VET.of(10000))
];
// Get gas estimate
const gasResult = await thorSoloClient.transactions.estimateGas(clauses, senderAccount.address);
// 3 - Define transaction body
const body = {
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
const nodeDelegate = HDKey.fromMnemonic(Mnemonic.of());
const gasPayerPrivateKey = nodeDelegate.privateKey;
// 5 - Get address of delegate
const gasPayerAddress = Address.ofPublicKey(nodeDelegate.publicKey).toString();
// 6 - Sign transaction as sender and delegate
const signedTransaction = Transaction.of(body).signAsSenderAndGasPayer(HexUInt.of(senderAccount.privateKey).bytes, HexUInt.of(gasPayerPrivateKey).bytes);
// 7 - Encode transaction
const encodedRaw = signedTransaction.encoded;
// 8 - Decode transaction and check
const decodedTx = Transaction.decode(encodedRaw, true);
// END_SNIPPET: FeeDelegationSnippet
expect(decodedTx.isDelegated).toBeTruthy();
expect(decodedTx.gasPayer.toString()).toBe(gasPayerAddress);
