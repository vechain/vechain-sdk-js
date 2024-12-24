```mermaid
classDiagram
    class HttpClient {
        <<interface>>
    }
    class ThorRequest~Request~ {
        <<interface>>
        askTo(httpClient: HttpClient) ThorResponse~Request~
    }
    class ThorResponse~Response~ {
        <<abstract>>
        request: ThorRequest~Request~
        response: Response
    }
    namespace Request {
        class SubscribeBeats {
            query: SubscribeBeats_Query
        }
        class SubscribeBeats_Query {
            pos: BlockID
        }
        class SubscribeBlocksCreation {
            query: SubscribeBlocksCreation_Query
        }
        class SubscribeBlocksCreation_Query {
            pos: TXID
        }
        class SubscribeContractEvents {
            query: SubscribeContractEvents_Query
        }
        class SubscribeContractEvents_Query {
            addr: Address
            pos: BlockID
            t0: HexUInt
            t1: HexUInt
            t2: HexUInt
            t3: HexUIn
        }
        class SubscribeBlockchainBeats {
            query: SubscribeBlockchainBeats_Query
        }
        class SubscribeBlockchainBeats_Query {
            pos: BlockID
        }
        class SubscribeTransactionsEvents {
            body: SubscribeTransactionsEvents_Body
        }
        class SubscribeVETTransfers {
            query: SubscribeVETTransfer_Query
        }
        class SubscribeVETTransfer_Query {
            pos: BlockID
            recipient: Address
            sender: Address
            txOrigin: Address
        }
    }
    namespace Response {
        class SubscriptionBeatResponse {
            obsolete: boolean
            number: UInt
            id: BlockID
            parentID: BlockID
            timestamp: bigint
            txsFeature: UInt
            bloom: BloomFilter
        }
        class SubscriptionBeat2Response {
            gasLimit: VTHO
            obsolete: boolean
            number: UInt
            id: BlockID
            parentId: BlockID
            timestamp: bigint
            txsFeatures: UInt
            bloom: BloomFilter
        }
        class SubscriptionBlockResponse {
            number: UInt
            id: TXID
            size: UInt
            parentID: BlockID
            timestamp: bigint
            gasLimit: VTHO
            beneficiary: Address
            gasUsed: VTHO
            totalScore: UInt
            txsRoot: HexUInt
            txsFeature: UInt
            stateRoot: HexUInt
            receiptsRoot: HexUInt
            com: boolean
            signer: Address
        }
        class SubscriptionEventResponse {
            address: Address
            topics: HexUInt
            data: HexUInt
            obsolete: boolean
            meta: LogMeta
        }
        class SubscriptionTransferResponse {
            sender: Address
            recipient: Address
            amount: VET
            obsolete: boolean
            meta: LogMeta
        }
    }
    class LogMeta {
        blockID: blockID
        blockNumber: UInt
        blockTimestamp: bigint
        txID: TXID
        txOrigin: TXID
        clauseIndex: UInt
    }

    HttpClient o-- ThorRequest
    ThorRequest <|.. SubscribeBeats
    ThorRequest <|.. SubscribeBlocksCreation
    ThorRequest <|.. SubscribeContractEvents
    ThorRequest <|.. SubscribeBlockchainBeats
    ThorRequest <|.. SubscribeTransactionsEvents
    ThorRequest <|.. SubscribeVETTransfers
    ThorResponse <|.. SubscriptionBeatResponse
    ThorResponse <|.. SubscriptionBeat2Response
    ThorResponse <|.. SubscriptionBlockResponse
    ThorResponse <|.. SubscriptionEventResponse
    ThorResponse <|.. SubscriptionTransferResponse
    ThorRequest --* ThorResponse
    SubscribeBeats --* SubscribeBeats_Query
    SubscribeBlockchainBeats --* SubscribeBlockchainBeats_Query
    SubscribeBlocksCreation --* SubscribeBlocksCreation_Query
    SubscribeContractEvents --* SubscribeContractEvents_Query
    SubscriptionEventResponse --* LogMeta
    SubscriptionTransferResponse --* LogMeta
    SubscribeVETTransfers --* SubscribeVETTransfer_Query
    SubscribeBeats <..> SubscriptionBeat2Response
    SubscribeBlockchainBeats <..> SubscriptionBeatResponse
    SubscribeBlocksCreation <..> SubscriptionBlockResponse
    SubscribeContractEvents <..> SubscriptionEventResponse
    SubscribeVETTransfers <..> SubscriptionTransferResponse
```
