# Core Package C4 Architecture diagram
Main diagram for the core package.
It represents the architecture of the core package with its most important components.

```mermaid
C4Context
    title "vechain-sdk Architecture Overview - core package"

    Boundary(b0, "core", "package") {
        Boundary(b1, "Core components") {
            System(abi, "Abi module", "Handles all abi related operations")
            System(address, "Address module", "Handles all address related operations")
            System(bloom, "Bloom module", "Handles all bloom related operations")
            System(certificate, "Certificate module", "Handles all certificate related operations")
            System(contract, "Smart contract module", "Handles all smsrt contract related operations")
            System(encoding, "RLP cncoding module", "Handles all RLP encoding related operations")
            System(hash, "Hash module", "Handles all hash related operations")
            System(hdnode, "HDnode module", "Handles all hdnode related operations")
            System(keystore, "Keystore module", "Handles all keystore related operations")
            System(mnemonic, "Mnemonic module", "Handles all mnemonic related operations")
            System(secp256k1, "Secp256k1 module", "Handles all secp256k1 related operations")
            System(transaction, "Transaction module", "Handles all transaction related operations")
        }

        Boundary(b3, "Utilities") {

            Boundary(b4, "Components utils") {
                System(bloom, "Bloom utils", "Handles all utils constructs for bloom module")
                System(hdnode, "Hdnode utils", "Handles all utils constructs for hdnode module")
                System(transaction, "Transaction utils", "Handles all utils constructs for transaction module")
            }

            Boundary(b5, "Generic utils") {
                System(const, "Main constants utils", "Contains all core constants")
                System(data, "Data utils", "Handles all data utils")
                System(units, "Units utils", "Handles all units utils. Basic conversions.<br>e.g. Wei to Vet")
            }

        }
    }

    UpdateLayoutConfig($c4ShapeInRow="2", $c4BoundaryInRow="1")
```