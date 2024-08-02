import {
    Hex,
    keccak256,
    secp256k1,
    addressUtils,
    type HashInput
} from '@vechain/sdk-core';
import { expect } from 'expect';

// START_SNIPPET: Secp256k1Snippet

// 1 - Generate a private key.

const privateKey = await secp256k1.generatePrivateKey();
console.log('Private key:', Hex.of(privateKey));
// Private key: ...SOME_PRIVATE_KEY...

// 2 - Derive the public key and address from private key.
//     By default, the key is returned in compressed form.

const publicKey = secp256k1.derivePublicKey(privateKey);
const userAddress = addressUtils.fromPublicKey(Buffer.from(publicKey));
console.log('User address:', userAddress);
// User address: 0x...SOME_ADDRESS...

// 3 - Sign message

const messageToSign: HashInput = 'hello world';
const hash = keccak256(messageToSign);
console.log(`Hash: ${hash.toString()}`);

const signature = secp256k1.sign(hash, privateKey);
console.log('Signature:', Hex.of(signature));
// Signature: ...SOME_SIGNATURE...

// END_SNIPPET: Secp256k1Snippet

// 4 - Test recovery of public key.
//     By default, the recovered key is returned in compressed form.
//     The methods `secp256k1.inflatePublicKey` and `secp256k1.compressPublicKey`
//     convert public keys among compressed and uncompressed form.

const recoveredPublicKey = secp256k1.recover(hash, signature);
expect(publicKey).toStrictEqual(secp256k1.compressPublicKey(recoveredPublicKey));
expect(secp256k1.inflatePublicKey(publicKey)).toStrictEqual(recoveredPublicKey);
// Recovered public key is correct: true
