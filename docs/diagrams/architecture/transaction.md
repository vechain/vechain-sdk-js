```mermaid
classDiagram
    class Clause {
        +FPN amount()
        +Clause callFunction(Address contractAddress, ABIFunction, functionABI, unknown[] args, VET amount, ClauseOptions: clauseOptions)
        +Clause deployContract(HexUInt contractBytecode, DeployParams deployParams?, ClauseOptions clauseOptions?)
        +Clause transferNFT(Address contractAddress, Address senderAddress, Address recipientAddress, HexUInt tokenId, ClauseOptions clauseOptions?)
        +Clause transferToken(Address tokenAddress, Address: senderAddress, VTHO amount, ClauseOptions clauseOptions?)
        +Cluase transferVET(Address recipientAddress, VET amount, ClauseOptions clauseOptions?)
    }
    class ClauseOption{
        <<interface>>
        +string comment?
        +boolean includeABI?
    }
    class DeployParameters {
        <<interface>>
        ParamType[]|string[] types
        string[] values
    }
    class TransactionClause {
        <<interface>>
        +null|string to
        +number|string value
        +string data
        +string comment?
        +string abi?
    }
    TransactionClause <|.. Clause
```
