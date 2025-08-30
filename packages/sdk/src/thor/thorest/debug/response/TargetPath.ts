import { Hex } from '@common/vcdm';
import { IllegalArgumentError } from '@common/errors';

/**
 * Full Qualified Path
 */
const FQP = 'packages/sdk/src/thor/thorest/debug/response/TargetPath.ts!';

/**
 * Represents a target path for transaction clauses
 * Format: 0x[txID]/[blockRef]/[clauseIndex] or 0x[txID]/[clauseIndex]
 */
class TargetPath {
    // Regex to validate the target path format
    private static readonly REGEX =
        /^0x[0-9a-fA-F]{64}(\/(0x[0-9a-fA-F]{64}|\d+))?\/\d+$/;

    // The full path string
    private readonly path: string;

    /**
     * Creates a new TargetPath instance
     *
     * @param targetPath The target path string
     * @throws {IllegalArgumentError} If the string is not a valid target path
     */
    private constructor(targetPath: string) {
        if (targetPath === '' || !TargetPath.isValid(targetPath)) {
            throw new IllegalArgumentError(
                `${FQP}TargetPath(targetPath: string)`,
                'Invalid target path format',
                { targetPath }
            );
        }
        this.path = targetPath;
    }

    /**
     * Validates that a string meets the target path format requirements
     *
     * @param value The string to validate
     * @returns {boolean} True if the string is a valid target path, false otherwise
     */
    public static isValid(value: string): boolean {
        // First check if value is defined and is a string
        if (typeof value !== 'string') {
            return false;
        }
        return TargetPath.REGEX.test(value);
    }

    /**
     * Factory method to create a TargetPath instance
     *
     * @param value The target path string or existing TargetPath instance
     * @returns {TargetPath} A new TargetPath instance
     * @throws {IllegalArgumentError} If the string is not a valid target path
     */
    static of(value: string | TargetPath): TargetPath {
        if (value instanceof TargetPath) {
            return value;
        }

        if (typeof value === 'string' && TargetPath.isValid(value)) {
            return new TargetPath(value);
        }

        throw new IllegalArgumentError(
            `${FQP}TargetPath.of(value: string | TargetPath)`,
            'Invalid target path format',
            { value }
        );
    }

    /**
     * Creates a TargetPath from transaction ID and clause index
     *
     * @param txId Transaction ID (64-char hex)
     * @param clauseIndex Clause index (number)
     * @returns {TargetPath} A new TargetPath instance
     * @throws {IllegalArgumentError} If txId or clauseIndex is invalid
     */
    static fromTxIdAndClause(txId: string, clauseIndex: number): TargetPath {
        // Validate txId is a valid 64-char hex string
        if (!/^0x[0-9a-fA-F]{64}$/.test(txId)) {
            throw new IllegalArgumentError(
                `${FQP}TargetPath.fromTxIdAndClause(txId: string, clauseIndex: number)`,
                'Invalid transaction ID format',
                { txId }
            );
        }

        if (clauseIndex < 0 || !Number.isInteger(clauseIndex)) {
            throw new IllegalArgumentError(
                `${FQP}TargetPath.fromTxIdAndClause(txId: string, clauseIndex: number)`,
                'Invalid clause index, must be a non-negative integer',
                { clauseIndex }
            );
        }

        const path = `${txId}/${clauseIndex}`;
        return new TargetPath(path);
    }

    /**
     * Creates a TargetPath from transaction ID, block reference, and clause index
     *
     * @param txId Transaction ID (64-char hex)
     * @param blockRef Block reference (64-char hex or block number)
     * @param clauseIndex Clause index (number)
     * @returns {TargetPath} A new TargetPath instance
     * @throws {IllegalArgumentError} If any parameter is invalid
     */
    static fromTxIdBlockRefAndClause(
        txId: string,
        blockRef: string | number,
        clauseIndex: number
    ): TargetPath {
        // Validate txId is a valid 64-char hex string
        if (!/^0x[0-9a-fA-F]{64}$/.test(txId)) {
            throw new IllegalArgumentError(
                `${FQP}TargetPath.fromTxIdBlockRefAndClause(txId: string, blockRef: string | number, clauseIndex: number)`,
                'Invalid transaction ID format',
                { txId }
            );
        }

        // Validate blockRef is either a valid 64-char hex string or a positive number
        if (
            typeof blockRef === 'string' &&
            !/^0x[0-9a-fA-F]{64}$/.test(blockRef)
        ) {
            throw new IllegalArgumentError(
                `${FQP}TargetPath.fromTxIdBlockRefAndClause(txId: string, blockRef: string | number, clauseIndex: number)`,
                'Invalid block reference format',
                { blockRef }
            );
        } else if (
            typeof blockRef === 'number' &&
            (blockRef < 0 || !Number.isInteger(blockRef))
        ) {
            throw new IllegalArgumentError(
                `${FQP}TargetPath.fromTxIdBlockRefAndClause(txId: string, blockRef: string | number, clauseIndex: number)`,
                'Invalid block number, must be a non-negative integer',
                { blockRef }
            );
        }

        if (clauseIndex < 0 || !Number.isInteger(clauseIndex)) {
            throw new IllegalArgumentError(
                `${FQP}TargetPath.fromTxIdBlockRefAndClause(txId: string, blockRef: string | number, clauseIndex: number)`,
                'Invalid clause index, must be a non-negative integer',
                { clauseIndex }
            );
        }

        const path = `${txId}/${blockRef}/${clauseIndex}`;
        return new TargetPath(path);
    }

    /**
     * Returns the transaction ID part of the target path
     *
     * @returns {string} The transaction ID
     */
    get txId(): string {
        return this.path.split('/')[0];
    }

    /**
     * Returns the transaction ID as a Hex instance
     *
     * @returns {Hex} The transaction ID as a Hex instance
     */
    get txIdAsHex(): Hex {
        return Hex.of(this.txId);
    }

    /**
     * Returns the block reference part of the target path, if present
     *
     * @returns {string | undefined} The block reference or undefined if not present
     */
    get blockRef(): string | undefined {
        const parts = this.path.split('/');
        return parts.length === 3 ? parts[1] : undefined;
    }

    /**
     * Returns the clause index part of the target path
     *
     * @returns {number} The clause index
     */
    get clauseIndex(): number {
        const parts = this.path.split('/');
        return parseInt(parts[parts.length - 1], 10);
    }

    /**
     * Returns the full path as a string
     *
     * @returns {string} The full path
     */
    toString(): string {
        return this.path;
    }

    /**
     * Creates a JSON representation of the target path
     *
     * @returns {string} The JSON representation
     */
    toJSON(): string {
        return this.toString();
    }
}

export { TargetPath };
