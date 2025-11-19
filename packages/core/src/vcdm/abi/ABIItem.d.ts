import { type AbiEvent, type AbiFunction } from 'viem';
import { ABI } from './ABI';
type SignatureType = string | AbiFunction | AbiEvent;
/**
 * Represents an ABI (Application Binary Interface) item.
 * @extends ABI
 */
declare abstract class ABIItem extends ABI {
    readonly signature: AbiFunction | AbiEvent;
    readonly stringSignature: string;
    /**
     * ABIItem constructor from item (Event, Function...) signature.
     *
     * @param {SignatureType} signature - The signature of the ABI item (Function, Event...).
     **/
    constructor(signature: SignatureType);
    static ofSignature<T extends ABIItem>(ABIItemConstructor: new (signature: string) => T, signature: string): T;
    static ofSignature<T extends ABIItem>(ABIItemConstructor: new (signature: AbiFunction) => T, signature: AbiFunction): T;
    static ofSignature<T extends ABIItem>(ABIItemConstructor: new (signature: AbiEvent) => T, signature: AbiEvent): T;
    /**
     * Returns a string representation of a JSON object or a string.
     * @param {'json' | 'string'} formatType Either JSON or String
     * @returns The string representation of the ABI item.
     */
    format(formatType?: 'json' | 'string'): string;
    /**
     * The signature hash of the ABIItem.
     * @returns {string} The signature hash of the ABIItem.
     * @remarks Wrapper for {@link toFunctionHash}.
     **/
    get signatureHash(): string;
    /**
     * Compares the current ABIItem instance with another ABIItem instance.
     * @param {ABIItem} that The item to compare with.
     * @returns {number} A non-zero number if the current ABIItem is different to the other ABI or zero if they are equal.
     * @override {@link VeChainDataModel#compareTo}
     **/
    compareTo(that: ABIItem): number;
}
export { ABIItem };
//# sourceMappingURL=ABIItem.d.ts.map