---
description: Overview of vechain-sdk-core Address class.
---

# Address class

This class handles all address related operations:

* Address derivation (from the private and public key)
* Address checking
* Address ERC55 Checksum

# Diagram

```mermaid
graph TD
;
    A[vechain-sdk-core] --> B[Address class];
    B -->|Derivation| C[From Private Key];
    C --- D[From Public Key];
    B -->|Checksum| E[ERC55];
    B -->|Validation| F[Is valid address];
```

# Example

## Address Derivation

Here we have a simple example of address derivation:
[AddressDerivationSnippet](examples/address/address-derivation.ts)

## Address Validation

Here we have a simple example of address validation:
[AddressValidationSnippet](examples/address/address-validation.ts)

## Address Checksum

Here we have a simple example of address ERC55 checksum:
[AddressERC55ChecksumSnippet](examples/address/address-erc55-checksum.ts)
