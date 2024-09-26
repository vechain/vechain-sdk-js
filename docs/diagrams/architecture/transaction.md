```mermaid
classDiagram
    class Clause {
        +FixedPointNumber amount()
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
    class DeployParams {
        <<interface>>
        ParamType[]|string[] types
        string[] values
    }
    class Reserved {
        <<interface>>
        +number features?
        +Uint8Array[] unused?
    }
    class Transaction {
        +TransactionBody body
        +Uint8Array signature?
        +Address delegator
        +Uint8Array encoded
        +Blake2b256 id
        +VTHO intrisicGas
        +boolean isDelegated
        +boolean isSigned
        +Address origin
        +Transaction decode(Uint8Array rawTransaction, boolean isSigned)$
        +Blake2b256 getSignatureHash(Address delegator?)
        +VTHO intrinsicGas(TransactionClause[] clauses)$
        +boolean isValidBody(TransactionBody body)$
        +Transaction of(TransactionBody: body, Uint8Array signature?)$
        +Transaction sign(Uint8Array signerPrivateKey)
        +Transaction signWithDelegator(Uint8Array signerPrivateKey, Uint8Array delegatorPrivateKey)
    }
    class TransactionBody {
        <<interface>>
        +string blockRef
        +number chainTag
        +TransactionClause[] clauses
        +null|string dependsOn
        +number expiration
        +numer|string gas
        +number gasPriceCoef
        +number|string nonce
        Reserved reserved?
    }
    class TransactionClause {
        <<interface>>
        +string abi?
        +string comment?
        +string data
        +null|string to
        +number|string value
    }
    Clause --> ClauseOption
    Clause --> DeployParams
    TransactionBody *-- Transaction
    TransactionClause *-- TransactionBody
    Reserved *-- TransactionBody
    TransactionClause <|.. Clause
```
