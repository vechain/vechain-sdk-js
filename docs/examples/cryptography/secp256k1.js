import { Address, Hex, Keccak256, Txt, Secp256k1 } from '@vechain/sdk-core';
import { expect } from 'expect';
// START_SNIPPET: Secp256k1Snippet
// 1 - Generate a private key.
const privateKey = await Secp256k1.generatePrivateKey();
console.log('Private key:', Hex.of(privateKey).toString());
// Private key: ...SOME_PRIVATE_KEY...
// 2 - Derive the public key and address from private key.
//     By default, the key is returned in compressed form.
const publicKey = Secp256k1.derivePublicKey(privateKey);
const userAddress = Address.ofPublicKey(publicKey).toString();
console.log('User address:', userAddress);
// User address: 0x...SOME_ADDRESS...
// 3 - Sign message
const messageToSign = Txt.of('hello world');
const hash = Keccak256.of(messageToSign.bytes);
console.log(`Hash: ${hash.toString()}`);
const signature = Secp256k1.sign(hash.bytes, privateKey);
console.log('Signature:', Hex.of(signature).toString());
// Signature: ...SOME_SIGNATURE...
// END_SNIPPET: Secp256k1Snippet
// 4 - Test recovery of public key.
//     By default, the recovered key is returned in compressed form.
//     The methods `Secp256k1.inflatePublicKey` and `Secp256k1.compressPublicKey`
//     convert public keys among compressed and uncompressed form.
const recoveredPublicKey = Secp256k1.recover(hash.bytes, signature);
expect(publicKey).toStrictEqual(Secp256k1.compressPublicKey(recoveredPublicKey));
expect(Secp256k1.inflatePublicKey(publicKey)).toStrictEqual(recoveredPublicKey);
// Recovered public key is correct: true
