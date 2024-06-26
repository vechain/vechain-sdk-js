# Network Package C4 Architecture diagram
Main diagram for the `network package`.
It represents the architecture of the `network package` with its most important components.

```mermaid
C4Context
    title "Vechain SDK architecture overview: network package"

    Boundary(b0, "network", "package") {
        Boundary(b1, "Assertions") {
            System(transactions, "Transactions", "Transaction related assertions")
        }

        Boundary(b2, "Thor Client") {
            System(accounts_module, "Accounts Module", "Provides API methods for account management")
            System(blocks_module, "Blocks Module", "Enables querying and interacting with blockchain blocks")
            System(contracts_module, "Contracts Module", "Handles smart contract interactions including deployment and execution")
            System(debug_module, "Debug Module", "Encapsulates functionality to handle Debug on the VeChainThor blockchain")
            System(gas_module, "Gas Module", "Handles gas related operations and provides convenient methods for estimating the gas cost of a transaction")
            System(logs_module, "Logs Module", "Facilitates retrieval and monitoring of transaction logs")
            System(nodes_module, "Nodes Module", "Manages node operations such as health checks and network status")
            System(transactions_module, "Transactions Module", "Handles creation, signing, and broadcasting of transactions")
        }

        Boundary(b3, "Utils") {
            System(const, "Const", "Constants about default timout, regex and healthcheck timing")
            System(helpers, "Helpers", "Conversion helpers")
            System(http, "HTTP", "Customized HTTP client for efficient network request handling")
            System(poll, "Poll", "Synchronous and Asynchronous Event Polling")
            System(subscriptions, "Subscriptions", "Contains functions for obtaining URLs for subscribing to events through a websocket connection")
            System(thorest, "Thorest", "Endpoints for the REST API")
        }
       
        Boundary(b4, "Provider") {
            Boundary(b41, "EIP-1193") {
                System(types, "Types", "Interface for EIP-1193 provider request arguments")
            }
    
            Boundary(b42, "Providers") {
                System(hardhat-provider, "Hardhat Provider", "It exposes the interface that Hardhat expects, and uses the VeChainProvider as wrapped provider")
                System(vechain-provider, "Vechain Provider", "Core provider class for vechain")
            }
    
            Boundary(b43, "Utils") {
                System(const, "Const", "Commonly used constants")
                System(formatter, "Formatter", "Functions used for formatting")
                System(helper, "Helper", "Helpers functions")
                System(rpc-mapper, "RPC Mapper", "Map of RPC methods to their implementations with the SDK")
            }
            
            Boundary(b44, "Provider Internal Wallets") {
                System(provider-internal-base-wallet, "BaseProviderInternalWallet", "Basical wallet a provider can use internally")
                System(provider-internal-hd-wallet, "HDProviderInternalWallet", "HD wallet a provider can use internally")
            }        
        }
        
        Boundary(b5, "Signer") {
            Boundary(b51, "Signers") {
                System(signers, "Signers", "List of available signers")
            }        
        }
        
        Boundary(b6, "External Blockchain Interaction") {
            System_Ext(VeChainThor, "Thor Blockchain", "Represents the blockchain platform with which the SDK interacts")
        }
       
    }

    UpdateLayoutConfig($c4ShapeInRow="3", $c4BoundaryInRow="1")
```