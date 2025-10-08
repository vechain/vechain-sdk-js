import { type Address, type Hex } from '@common/vcdm';
import { Clause } from '../../transactions/Clause';
import { Event } from '../../events/Event';
import { Transfer } from '../../events/Transfer';
import type {
    ClauseData,
    EventResponse,
    Output as ThorestOutput,
    TransferResponse
} from '@thor/thorest/common';
import type { TxWithReceipt } from '@thor/thorest/transactions/model';

/**
 * SDK-facing mirror of the `@thor/thorest` {@link TxWithReceipt} model.
 *
 * We materialize a dedicated type in the domain layer to keep the thor-client
 * API free from thorest DTOs while preserving a 1:1 mapping of fields.
 */
interface BlockTransactionReceiptOutput {
    readonly contractAddress?: Address;
    readonly events: Event[];
    readonly transfers: Transfer[];
}

/**
 * Runtime representation of an expanded-transaction receipt attached to a block.
 */
interface BlockTransactionReceipt {
    readonly gasUsed: bigint;
    readonly gasPayer: Address;
    readonly paid: bigint;
    readonly reward: bigint;
    readonly reverted: boolean;
    readonly outputs: BlockTransactionReceiptOutput[];
}

/**
 * Represents a transaction contained in an expanded block.
 *
 * Instances are created through {@link BlockTransaction.fromThorest}, which
 * performs a lossless conversion from the corresponding thorest DTO.
 */
class BlockTransaction {
    readonly id: Hex;
    readonly type: number | null;
    readonly origin: Address;
    readonly delegator: Address | null;
    readonly size: number;
    readonly chainTag: number;
    readonly blockRef: Hex;
    readonly expiration: number;
    readonly clauses: Clause[];
    readonly gasPriceCoef: bigint | null;
    readonly maxFeePerGas: bigint | null;
    readonly maxPriorityFeePerGas: bigint | null;
    readonly gas: bigint;
    readonly dependsOn: Hex | null;
    readonly nonce: bigint;
    readonly receipt: BlockTransactionReceipt;

    private constructor(tx: TxWithReceipt) {
        this.id = tx.id;
        this.type = tx.type;
        this.origin = tx.origin;
        this.delegator = tx.delegator;
        this.size = tx.size;
        this.chainTag = tx.chainTag;
        this.blockRef = tx.blockRef;
        this.expiration = tx.expiration;
        this.clauses = tx.clauses.map((clause: ClauseData) =>
            Clause.of(clause)
        );
        this.gasPriceCoef = tx.gasPriceCoef;
        this.maxFeePerGas = tx.maxFeePerGas;
        this.maxPriorityFeePerGas = tx.maxPriorityFeePerGas;
        this.gas = tx.gas;
        this.dependsOn = tx.dependsOn;
        this.nonce = tx.nonce;
        this.receipt = BlockTransaction.mapReceipt(tx);
    }

    static fromThorest(tx: TxWithReceipt): BlockTransaction {
        return new BlockTransaction(tx);
    }

    private static mapReceipt(tx: TxWithReceipt): BlockTransactionReceipt {
        return {
            gasUsed: tx.gasUsed,
            gasPayer: tx.gasPayer,
            paid: tx.paid,
            reward: tx.reward,
            reverted: tx.reverted,
            outputs: tx.outputs.map((output: ThorestOutput) =>
                BlockTransaction.mapOutput(output)
            )
        };
    }

    private static mapOutput(
        output: ThorestOutput
    ): BlockTransactionReceiptOutput {
        return {
            contractAddress: output.contractAddress,
            events: output.events.map((event: EventResponse) =>
                Event.of(event)
            ),
            transfers: output.transfers.map((transfer: TransferResponse) =>
                Transfer.of(transfer)
            )
        };
    }
}

export {
    BlockTransaction,
    type BlockTransactionReceipt,
    type BlockTransactionReceiptOutput
};
