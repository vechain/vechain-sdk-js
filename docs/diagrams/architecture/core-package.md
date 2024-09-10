# Core Package C4 Architecture diagram
Main diagram for the `core package`.
It represents the architecture of the `core package` with its most important components.

```mermaid
C4Context
    title "Vechain SDK architecture overview: core package"

    Boundary(core, "core", "package") {
        Boundary(core_modules, "Core modules") {
            System(abi, "ABI module", "Handle all ABI related operations.")
            System(certificate, "Certificate module", "Handle all certificate related operations.")
            System(clause, "Clause", "Handles all clause related operations.")
            System(contract, "Smart contract module", "Handle all smart contract related operations.")
            System(encoding, "RLP encoding module", "Handle RLP encoding related operations.")
            Boundary(hdkey, "HDKey module") {
                System(KDKey, "HDKey class", "Handle all Hierarchical Deterministic Key related operations.")
            }
            System(keystore, "Keystore module", "Handle all keystore related operations.")
            Boundary(secp256k1, "Secp256k1 module") {
                System(Secp256k1, "Secp256k1 class", "Handle all SECP256K1 related operations.")
            }
            System(transaction, "Transaction module", "Handle all transaction related operations.")
            Boundary(vcdm, "VeChain Data Model module", "Provide types and methods to represent the data in Thor.") {
                Boundary(account, "Account module") {
                    System(Account, "Account class", "Handle all account related operations.")    
                }
                System(Address, "Address class", "Handle all address related operations.")
                System(BloomFilter, "BloomFilter class", "Handle all Bloom filter related operations.")
                Boundary(currency, "Currency module") {
                    System(Currency, "Currency", "Handle all currency related operations.")
                }
                System(FPN, "FPN class", "Handle all Fixed Point Number math.")
                Boundary(hash, "Hash module") {
                    System(Blake2b256, "Blake2b256 class")
                    System(Keccak, "Blake2b256 class")
                    System(Sha256, "Sha256 class")
                }
                System(Hex, "Hex class", "Handle data in hexadecimal representation.")
                System(HexInt, "HexInt class", "Handle the hexadecimal representation<br>for integer values.")
                System(HexUInt, "HexUInt class", "Handle the hexadecimal representation<br>for unsigned integer (natural number) values.")
                System(Mnemonic, "Mnemonic class", "Handle all BIP32 mnemonic related operations.")
                System(Quantity, "Quantity class", "Represent Thor quantities.")
                System(Revision, "Revision class", "Represents a revision for a Thor transaction or block.")
            }
        }
 }

    UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="1")
```
