# Core Package C4 Architecture diagram
Main diagram for the `core package`.
It represents the architecture of the `core package` with its most important components.

```mermaid
C4Context
    title "Vechain SDK architecture overview: core package"

    Boundary(b0, "core", "package") {
        Boundary(b1, "Core components") {
            System(abi, "Abi module", "Handles all abi related operations")
            System(address, "Address module", "Handles all address related operations")
            System(assertions, "Assertions module", "Provides a set of functions and utilities for writing and handling assertions in the code")
            System(bloom, "Bloom module", "Handles all bloom related operations")
            System(certificate, "Certificate module", "Handles all certificate related operations")
            System(clause, "Clause", "Handles all clause related operations")
            System(contract, "Smart contract module", "Handles all smart contract related operations")
            System(encoding, "RLP encoding module", "Handles all RLP encoding related operations")
            System(hash, "Hash module", "Handles all hash related operations")
            System(hdkey, "HDKey module", "Handles all Hierarchical Deterministic Key related operations")
            System(keystore, "Keystore module", "Handles all keystore related operations")
            System(mnemonic, "Mnemonic module", "Handles all mnemonic related operations")
            System(secp256k1, "Secp256k1 module", "Handles all secp256k1 related operations")
            System(transaction, "Transaction module", "Handles all transaction related operations")
        }

        Boundary(b2, "Utils") {
            System(bloom, "Bloom utils", "Handles all utils constructs for bloom module")
            System(const, "Main constants utils", "Contains all core constants")
            System(data, "Data utils", "Handles all data utils")
            System(revision, "Revision utils", "Handles all revision-related utility operations")
            System(transaction, "Transaction utils", "Handles all utils constructs for transaction module")
            System(units, "Units utils", "Handles all units utils. Basic conversions.<br>e.g. Wei to VET")
        }
    }

    UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="1")
```
