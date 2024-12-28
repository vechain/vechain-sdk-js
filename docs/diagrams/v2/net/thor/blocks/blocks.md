```mermaid
classDiagram
    namespace http {
        class HttpPath {
            <<interface>>
            path: string
        }
    }
    namespace thor {
        class ThorRequest~RequestClass~ {
            <<interface>>
            askTo(httpClient: HttpClient Promise~ThorResponse~ResponseClass~~;
        }
        class ThorResponse~ResponseClass~ {
            <<interface>>
            request: ThorRequest~RequestClass~
            response: ResponseClass
        }
    }
    class RegularBlockResponse {
        number: UInt
        id: ThorId
        size: UInt
        parentID: ThorId
        timestamp: bigint
        gasLimit: VTHO
        beneficiary: Address
        gasUsed: VTHO
        totalScore: UInt
        txsRoot: ThorId
        txsFeatures: UInt
        stateRoot: ThorId
        receiptsRoot: ThorId
        com: boolean
        signer: Address
        isTrunk: boolean
        isFinalized: boolean
        transactions: ThorId[]
        constructor(json: RegularBlockResponseJSON) RegularBlockResponse
        toJSON() RegularBlockResponseJSON
    }
    class RegularBlockResponseJSON {
        <<interface>>
        number: number
        id: string
        size: number
        parentID: string
        timestamp: bigint
        gasLimit: number
        beneficiary: string
        gasUsed: number
        totalScore: number
        txsRoot: string
        txsFeatures: number
        stateRoot: string
        receiptsRoot: string
        com: boolean
        signer: string
        isTrunk: boolean
        isFinalized: boolean
        transactions: string[]
    }
    class RetrieveBlock {
        path: RetrieveBlockPath
        askTo(httpClient: HttpClient) Promise~ThorResponse~RegularBlockResponse~~
        of(revision: Revision) RetrieveBlock$
    }
    class RetrieveBlockPath {
        revision: Revision
    }
    HttpPath <|.. RetrieveBlockPath
    RegularBlockResponse --> "new - toJSON" RegularBlockResponseJSON
    ThorRequest <|.. RetrieveBlock
    ThorResponse <-- "askTo" RetrieveBlock
    RetrieveBlock --> "askTo" RegularBlockResponse
    RetrieveBlock *--> RetrieveBlockPath
```
