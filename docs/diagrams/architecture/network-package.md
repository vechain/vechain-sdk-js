# Network Package C4 Architecture diagram
Main diagram for the network package.
It represents the architecture of the network package with its most important components.

```mermaid
C4Context
    title "vechain-sdk architecture overview - network package"

    Boundary(b0, "network", "package") {
        Boundary(b1, "Thor Client") {
            System(accounts_module, "Accounts Module", "Provides API methods for account management")
            System(blocks_module, "Blocks Module", "Enables querying and interacting with blockchain blocks")
            System(contracts_module, "Contracts Module", "Handles smart contract interactions including deployment and execution")
            System(logs_module, "Logs Module", "Facilitates retrieval and monitoring of transaction logs")
            System(nodes_module, "Nodes Module", "Manages node operations such as health checks and network status")
            System(transactions_module, "Transactions Module", "Handles creation, signing, and broadcasting of transactions")
            System(module_N, "Module N", "Represents additional modular functionality being developed for Thor Client")
        }

        Boundary(b3, "Utilities") {
            System(http_client, "HTTP Client", "Customized HTTP client for efficient network request handling")
            Boundary(b5, "Polling Utilities"){
                System(sync_poll, "Synchronous Polling", "Performs blocking polling operations for synchronous processes")
                System(async_poll, "Asynchronous Event Poll", "Implements event-driven polling for asynchronous workflows")
            }
        }
        
        Boundary(b4, "External Blockchain Interaction") {
            System_Ext(vechainthor, "Thor Blockchain", "Represents the blockchain platform with which the SDK interacts")
        }
    }

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```