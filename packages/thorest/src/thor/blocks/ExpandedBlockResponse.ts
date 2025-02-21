import { Address, BlockId, ThorId, UInt, Units, VTHO } from '@vechain/sdk-core';
import {
    GetTxResponse,
    type GetTxResponseJSON,
    Receipt,
    type ReceiptJSON
} from '../transactions';
import { type CommmonBlockResponseJSON } from './RegularBlockResponse';

class TransactionWithOutputs {
    readonly transaction: Omit<GetTxResponse, 'meta'>;
    readonly receipt: Receipt;

    constructor(json: TransactionWithOutputsJSON) {
        const transactionWithoutMeta = new GetTxResponse({
            ...json,
            meta: {
                blockID: BlockId.of(0).fit(64).toString(),
                blockNumber: 0,
                blockTimestamp: 0n
            }
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { meta, ...transactionWithoutMetaNoMeta } =
            transactionWithoutMeta;
        this.transaction = {
            ...transactionWithoutMetaNoMeta,
            toJSON: () => transactionWithoutMeta.toJSON()
        } satisfies Omit<GetTxResponse, 'meta'>;
        this.receipt = new Receipt(json);
    }

    toJSON(): TransactionWithOutputsJSON {
        return {
            ...this.transaction.toJSON(),
            ...this.receipt.toJSON()
        } satisfies TransactionWithOutputsJSON;
    }
}

type TransactionWithOutputsJSON = Omit<GetTxResponseJSON, 'meta'> & ReceiptJSON;

class ExpandedBlockResponse {
    readonly number: UInt;
    readonly id: BlockId;
    readonly size: UInt;
    readonly parentID: BlockId;
    readonly timestamp: UInt;
    readonly gasLimit: VTHO;
    readonly beneficiary: Address;
    readonly gasUsed: VTHO;
    readonly totalScore: UInt;
    readonly txsRoot: ThorId;
    readonly txsFeatures: UInt;
    readonly stateRoot: ThorId;
    readonly receiptsRoot: ThorId;
    readonly com: boolean;
    readonly signer: Address;
    readonly isTrunk: boolean;
    readonly isFinalized: boolean;
    readonly transactions: TransactionWithOutputs[];

    constructor(json: ExpandedBlockResponseJSON) {
        this.number = UInt.of(json.number);
        this.id = BlockId.of(json.id);
        this.size = UInt.of(json.size);
        this.parentID = BlockId.of(json.parentID);
        this.timestamp = UInt.of(json.timestamp);
        this.gasLimit = VTHO.of(json.gasLimit, Units.wei);
        this.beneficiary = Address.of(json.beneficiary);
        this.gasUsed = VTHO.of(json.gasUsed, Units.wei);
        this.totalScore = UInt.of(json.totalScore);
        this.txsRoot = ThorId.of(json.txsRoot);
        this.txsFeatures = UInt.of(json.txsFeatures);
        this.stateRoot = ThorId.of(json.stateRoot);
        this.receiptsRoot = Address.of(json.receiptsRoot);
        this.com = json.com;
        this.signer = Address.of(json.signer);
        this.isTrunk = json.isTrunk;
        this.isFinalized = json.isFinalized;
        this.transactions = json.transactions.map(
            (txId: TransactionWithOutputsJSON): TransactionWithOutputs =>
                new TransactionWithOutputs(txId)
        );
    }

    toJSON(): ExpandedBlockResponseJSON {
        return {
            number: this.number.valueOf(),
            id: this.id.toString(),
            size: this.size.valueOf(),
            parentID: this.parentID.toString(),
            timestamp: this.timestamp.valueOf(),
            gasLimit: Number(this.gasLimit.wei),
            beneficiary: this.beneficiary.toString(),
            gasUsed: Number(this.gasUsed.wei),
            totalScore: this.totalScore.valueOf(),
            txsRoot: this.txsRoot.toString(),
            txsFeatures: this.txsFeatures.valueOf(),
            stateRoot: this.stateRoot.toString(),
            receiptsRoot: this.receiptsRoot.toString(),
            com: this.com,
            signer: this.signer.toString(),
            isTrunk: this.isTrunk,
            isFinalized: this.isFinalized,
            transactions: this.transactions.map((tx: TransactionWithOutputs) =>
                tx.toJSON()
            )
        } satisfies ExpandedBlockResponseJSON;
    }
}

interface ExpandedBlockResponseJSON extends CommmonBlockResponseJSON {
    transactions: TransactionWithOutputsJSON[];
}

export { ExpandedBlockResponse, type ExpandedBlockResponseJSON };
