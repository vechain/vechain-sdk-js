import {
    keccak256,
    secp256k1,
    address,
    type HashInput
} from '@vechain-sdk/core';
import { expect } from 'expect';

// Generate a private key
const privateKey = secp256k1.generate();
console.log('Private key:', privateKey.toString('hex'));
// Private key: ...SOME_PRIVATE_KEY...

// Public key and address from private key
const publicKey = secp256k1.derive(privateKey);
const userAddress = address.fromPublicKey(publicKey);
console.log('User address:', userAddress);
// User address: 0x...SOME_ADDRESS...

// Sign message
const messageToSign: HashInput = 'hello world';
const hash = keccak256(messageToSign).slice(2);
console.log(`Hash: ${hash.toString()}`);
const signature = secp256k1.sign(Buffer.from(hash, 'hex'), privateKey);
console.log('Signature:', signature.toString('hex'));
// Signature: ...SOME_SIGNATURE...

// Test recovery
const recoveredPubKey = secp256k1.recover(Buffer.from(hash, 'hex'), signature);
const equals = publicKey.equals(recoveredPubKey);
expect(equals).toBeTruthy();
// Recovered public key is correct: true
