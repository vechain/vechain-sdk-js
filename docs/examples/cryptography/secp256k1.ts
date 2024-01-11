import {
    keccak256,
    secp256k1,
    addressUtils,
    type HashInput
} from '@vechain/vechain-sdk-core';
import { expect } from 'expect';

// 1 - Generate a private key

const privateKey = secp256k1.generatePrivateKey();
console.log('Private key:', privateKey.toString('hex'));
// Private key: ...SOME_PRIVATE_KEY...

// 2 - Derive public key and address from private key

const publicKey = secp256k1.derivePublicKey(privateKey);
const userAddress = addressUtils.fromPublicKey(publicKey);
console.log('User address:', userAddress);
// User address: 0x...SOME_ADDRESS...

// 3 - Sign message

const messageToSign: HashInput = 'hello world';
const hash = keccak256(messageToSign);
console.log(`Hash: ${hash.toString()}`);

const signature = secp256k1.sign(hash, privateKey);
console.log('Signature:', signature.toString('hex'));
// Signature: ...SOME_SIGNATURE...

// 4 - Test recovery of public key

const recoveredPublicKey = secp256k1.recover(hash, signature);
expect(publicKey.equals(recoveredPublicKey)).toBeTruthy();
// Recovered public key is correct: true
