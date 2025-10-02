# 🏗️ VeChain SDK Contracts Module Architecture Diagram

## **3-Layer Architecture Overview**

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           🌐 VIEM LAYER (Top)                                  │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    Contract.ts                                          │   │
│  │  • viem-compatible getContract() function                              │   │
│  │  • Standard Ethereum patterns                                           │   │
│  │  • Cross-chain developer experience                                     │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                 ContractAdapter.ts                                      │   │
│  │  • Adapter implementation                                               │   │
│  │  • Method delegation to middle layer                                    │   │
│  │  • VeChain-specific feature exposure                                    │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      🔧 THOR CLIENT LAYER (Middle)                              │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                   ContractsModule                                       │   │
│  │  • Central contract management                                          │   │
│  │  • Client lifecycle management                                          │   │
│  │  • Factory pattern implementation                                       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                      Contract                                          │   │
│  │  • Individual contract instances                                       │   │
│  │  • Dynamic method generation from ABI                                  │   │
│  │  • read, transact, clause, filters, criteria                           │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                   ContractFactory                                      │   │
│  │  • Contract deployment                                                 │   │
│  │  • ABI and bytecode management                                         │   │
│  │  • Gas estimation and simulation                                       │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                      ⛓️ BLOCKCHAIN LAYER (Bottom)                               │
│                                                                                 │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    PublicClient                                        │   │
│  │  • Read operations                                                     │   │
│  │  • Contract calls                                                      │   │
│  │  • Event filtering                                                     │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                    WalletClient                                        │   │
│  │  • Write operations                                                    │   │
│  │  • Transaction execution                                               │   │
│  │  • Signing and broadcasting                                            │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                    │                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                  VeChain Thor Network                                  │   │
│  │  • Blockchain interaction                                              │   │
│  │  • Transaction processing                                              │   │
│  │  • Event emission and filtering                                        │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────┘
```

## **Data Flow Diagram**

```
Developer Code
       │
       ▼
┌─────────────┐    viem interface    ┌─────────────────┐
│ getContract │ ────────────────────► │ ContractAdapter │
└─────────────┘                       └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │ ContractsModule │
                                    └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │     Contract    │
                                    └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │ PublicClient    │
                                    │ WalletClient    │
                                    └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │ VeChain Network │
                                    └─────────────────┘
```

## **Method Generation Flow**

```
ABI Definition
       │
       ▼
┌─────────────┐    Dynamic Generation    ┌─────────────────┐
│     ABI     │ ───────────────────────► │ Contract Class  │
└─────────────┘                          └─────────────────┘
                                                │
                                                ▼
                                    ┌─────────────────┐
                                    │ Method Proxies  │
                                    │                 │
                                    │ • read.*        │
                                    │ • transact.*    │
                                    │ • clause.*      │
                                    │ • filters.*     │
                                    │ • criteria.*    │
                                    └─────────────────┘
```

## **Error Handling Architecture**

```
Error Occurrence
       │
       ▼
┌─────────────┐    Custom Errors    ┌─────────────────┐
│   Runtime   │ ──────────────────► │ VeChainSDKError │
└─────────────┘                     └─────────────────┘
                                              │
                                              ▼
                                    ┌─────────────────┐
                                    │ ContractCallError│
                                    │ InvalidTransaction│
                                    │ Field           │
                                    └─────────────────┘
```

## **Testing Architecture**

```
Test Suite
    │
    ├── Unit Tests (99 tests)
    │   ├── Error Classes (10)
    │   ├── ContractsModule (18)
    │   ├── Contract Class (26)
    │   ├── Contract Advanced (26)
    │   ├── ContractFactory (18)
    │   └── Viem Integration (19)
    │
    └── Solo Tests (1 test)
        └── VeChain Node Integration
```

## **Key Features Matrix**

| Feature | Viem Layer | Thor Client | Blockchain |
|---------|------------|-------------|------------|
| **Read Operations** | ✅ | ✅ | ✅ |
| **Write Operations** | ✅ | ✅ | ✅ |
| **Event Filtering** | ✅ | ✅ | ✅ |
| **Gas Estimation** | ✅ | ✅ | ✅ |
| **Transaction Simulation** | ✅ | ✅ | ✅ |
| **Clause Generation** | ❌ | ✅ | ❌ |
| **VeChain-specific** | ❌ | ✅ | ❌ |
| **Cross-chain Compatible** | ✅ | ❌ | ❌ |
| **Type Safety** | ✅ | ✅ | ✅ |
| **Error Handling** | ✅ | ✅ | ✅ |

