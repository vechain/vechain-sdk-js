```mermaid
C4Context
    title "vechain-SDK Architecture Overview - Errors Package"

    Boundary(b0, "vechain-SDK Errors Package") {
        Boundary(b1, "Core") {
            System(abi, "Abi", "Abi related errors")
            System(address, "Address", "Address related errors")
            System(bloom, "Bloom", "Bloom related errors")
            System(certificate, "Certificate", "Certificate related errors")
            System(data, "Data", "Data related errors")
            System(hdnode, "HDNode", "HDNode related errors")
            System(keystore, "Keystore", "Keystore related errors")
            System(rlp, "RLP", "RLP related errors")
            System(secp256k1, "Secp256k1", "Secp256k1 related errors")
            System(transaction, "Transaction", "Transaction related errors")
        }

        Boundary(b2, "Network") {
            System(http-client, "HTTPClient", "HTTPClient related errors")
            System(poll, "Poll", "Poll related errors")
        }
    }
```