---
description: Main cryptography related functions.
---

# Cryptography

## Hash functions

Hash functions are algorithms that take input data of differing size as an input, and it produces a fixed-size output.
The output of a hash function is typically represented as a sequence of numbers and letters. Hash functions are commonly used in computer science for various purposes, such as ensuring data integrity, securing storing passwords, and creating unique identifiers for data.

vechain sdk supports _blake2b256 and _keccak256 hash functions.

### Blake2b256

Blake2b256 is a specific type of hash function known for its speed and security. It takes any input data and generates a 256-bit (32-byte) hash value. The _blake2b256 part refers to the specific design of the algorithm, and the 256 indicates the length of the resulting hash code. Blake2b256 is widely used in cryptographic applications, blockchain technologies, and secure data storage.

```typescript { name=blake2b256, category=example }
// Input of hash function must be an expression representable as an array of bytes.
// The class Txt assures a consistent byte encoding for textual strings.
const toHash = Txt.of('hello world');

const hash = Blake2b256.of(toHash.bytes);
```

### Keccak256

Keccak256 is another type of hash function, and it's particularly well-known for its use in the blockchain world, specifically in cryptocurrencies like Ethereum. Similar to Blake2b256, Keccak256 also takes input data and generates a 256-bit (32-byte) hash value. The Keccak part refers to the family of algorithms, and again, 256 denotes the length of the output hash code.

```typescript { name=keccak256, category=example }
// Input of hash function must be an expression representable as an array of bytes.
// The class Txt assures a consistent byte encoding for textual strings.
const toHash = Txt.of('hello world');

//
const hash = Keccak256.of(toHash.bytes);
```

## Public key cryptography

vechain sdk uses Secp256k1 to handle public key cryptography.

Secp256k1 is a specific elliptic curve used in public key cryptography. It is defined by the standard organization "Standards for Efficient Cryptography Group" (SECG) and is particularly well-known for its use in cryptocurrencies, most notably Bitcoin.

Secp256k1 is mainly used for generating public and private key pairs in cryptographic systems. It is a critical component in securing blockchain networks and other applications where digital signatures and secure transactions are required. The security of Secp256k1 is based on the difficulty of solving certain mathematical problems related to elliptic curves, making it highly resistant to attacks.

* **Key Generation**: In Secp256k1, the public and private keys are mathematically related. The private key is a randomly generated 256-bit (32-byte) integer, while the public key is derived from the private key using the elliptic curve multiplication operation defined by the Secp256k1 curve. This process ensures that the public key can be calculated from the private key, but it is computationally infeasible to deduce the private key from the public key.
* **Digital Signatures**: An essential feature of Secp256k1 is generating and verifying digital signatures, public key cryptography. To sign a message, the private key holder performs a mathematical operation involving the message and the private key to produce a signature. The signature, along with the original message, can be publicly verified using the corresponding public key. This process ensures the authenticity and integrity of the message without revealing the private key.
* **Security Considerations**: The security of Secp256k1 relies on the difficulty of the elliptic curve discrete logarithm problem. Breaking this problem requires an impractical amount of computational power, making Secp256k1 a secure choice for cryptographic applications, including blockchain networks.

```typescript { name=secp256k1, category=example }
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
```

