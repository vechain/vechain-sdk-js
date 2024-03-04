# Errors Package C4 Architecture diagram
Main diagram for the `errors package`.
It represents the architecture of the `errors package` with its most important components.

```mermaid
C4Context
    "Vechain SDK architecture overview: errors package"

    Boundary(b0, "errors", "package") {
        Boundary(b1, "Model") {
            Boundary(b2, "Core") {
                System(abi, "Abi", "Abi related errors")
                System(address, "Address", "Address related errors")
                System(bloom, "Bloom", "Bloom related errors")
                System(certificate, "Certificate", "Certificate related errors")
                System(contract, "Contract", "Contract related errors")
                System(data, "Data", "Data related errors")
                System(hdnode, "HDNode", "HDNode related errors")
                System(keystore, "Keystore", "Keystore related errors")
                System(rlp, "RLP", "RLP related errors")
                System(secp256k1, "Secp256k1", "Secp256k1 related errors")
                System(transaction, "Transaction", "Transaction related errors")
            }

            Boundary(b3, "EIP1193") {
                System(eip1193, "EIP1193", "EIP1193 related errors")
            }

            Boundary(b4, "Generic") {
                System(function, "Function", "Function related errors")
            }

            Boundary(b5, "Json-RPC") {
                System(json-rpc, "Json-RPC", "Json-RPC related errors")
            }

            Boundary(b6, "Network") {
                System(http-client, "HTTPClient", "HTTPClient related errors")
                System(poll, "Poll", "Poll related errors")
            }
        }

        Boundary(b7, "Types") {
            System(error-types, "ErrorTypes", "The error types from the error code")
        }

        Boundary(b8, "Utils") {
            System(assert, "Assert", "Assert that the condition is true, otherwise throw an error")
            System(error-builder, "ErrorBuilder", "Build error object according to the error code provided")
            System(error-message-builder, "ErrorMessageBuilder", "Build an error message")
            System(hardhat, "Hardhat", "Build a hardhat error")
        }
    }
```