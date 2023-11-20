/**
 * Represents the body of a transaction for VeChainThor blockchain.
 * This interface provides additional details to customize a transaction overriding the default settings.
 *
 * @remarks
 * Use this interface when constructing a transaction to override specific parameters.
 *
 * @example
 * ```typescript
 * const transactionOverride: TransactionBodyOverride = {
 *   nonce: '0x' + dataUtils.toHexString(randomBytes(8)),
 *   chainTag: networkInfo.mainnet.chainTag,
 *   blockRef: '0xabcdef1234567890',
 *   expiration: 32,
 *   gasPriceCoef: 0,
 *   dependsOn: '0x0123456789abcdef',
 * };
 * ```
 */
interface TransactionBodyOverride {
    /**
     * A random number set by the wallet / user;
     */
    nonce?: number;

    /**
     * Last byte of the genesis block ID which is used to identify a blockchain
     * to prevent the cross-chain replay attack;
     */
    chainTag?: number;

    /**
     * reference to a specific block;
     */
    blockRef?: string;

    /**
     * How long, in terms of the number of blocks, the transaction will be allowed to be mined in VechainThor;
     * It helps prevent transactions from being included in blocks after a certain time.
     */
    expiration?: number;

    /**
     *  Coefficient used to calculate the gas price for the transaction.
     */
    gasPriceCoef?: number;

    /**
     * ID of the transaction on which the current transaction depends. If null, the transaction is independent.
     */
    dependsOn?: string | null;
}

export type { TransactionBodyOverride };
