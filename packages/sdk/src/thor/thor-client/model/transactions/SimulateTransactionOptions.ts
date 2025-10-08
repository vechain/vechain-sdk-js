import { type Address, type BlockRef, type Revision } from '@common/vcdm';

/**
 * Simulate transaction options
 */
interface SimulateTransactionOptions {
    /**
     * The block number or block ID of which the transaction simulation is based on
     * @default 'best'
     */
    revision?: Revision;
    /**
     * The maximum gas for the transaction simulation
     */
    gas?: bigint;
    /**
     * The price of gas for the transaction simulation
     */
    gasPrice?: bigint;
    /**
     * The caller of the transaction simulation. (i.e., the address that performs the transaction)
     */
    caller?: Address;

    /**
     * The VeChainThor blockchain allows for transaction-level proof of work (PoW) and converts the proved work into extra gas price that will be used by
     * the system to generate more reward to the block generator, the Authority Master node, that validates the transaction.
     * In other words, users can utilize their local computational power to make their transactions more likely to be included in a new block.
     *
     * @link [VeChainThor Proof of Work](https://docs.vechain.org/core-concepts/transactions/transaction-calculation#proof-of-work)
     */
    provedWork?: string;
    /**
     * The address that pays for the gas fee of the transaction simulation.
     * If different from the caller, then a delegated transaction is simulated.
     */
    gasPayer?: Address;
    /**
     * The expiration of the transaction simulation.
     * Represents how long, in terms of the number of blocks, the transaction will be allowed to be mined in VeChainThor
     */
    expiration?: number;
    /**
     * BlockRef stores the reference to a particular block whose next block is the earliest block the current transaction can be included.
     */
    blockRef?: BlockRef;
}

export type { SimulateTransactionOptions };
