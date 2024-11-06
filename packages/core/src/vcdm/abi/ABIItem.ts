import {
    parseAbiItem,
    toFunctionHash,
    toFunctionSignature,
    type AbiEvent,
    type AbiFunction
} from 'viem';
import { ABI } from './ABI';

type SignatureType = string | AbiFunction | AbiEvent;

/**
 * Represents an ABI (Application Binary Interface) item.
 * @extends ABI
 */
abstract class ABIItem extends ABI {
    public readonly signature: AbiFunction | AbiEvent;
    public readonly stringSignature: string;

    /**
     * ABIItem constructor from item (Event, Function...) signature.
     *
     * @param {SignatureType} signature - The signature of the ABI item (Function, Event...).
     **/
    public constructor(signature: SignatureType) {
        super();
        switch (typeof signature) {
            case 'string':
                this.stringSignature = signature;
                break;
            case 'object':
                this.stringSignature = toFunctionSignature(signature);
                break;
            default:
                this.stringSignature = '';
        }
        this.signature =
            typeof signature === 'string'
                ? parseAbiItem([signature])
                : signature;
    }

    public static ofSignature<T extends ABIItem>(
        ABIItemConstructor: new (signature: string) => T,
        signature: string
    ): T;

    public static ofSignature<T extends ABIItem>(
        ABIItemConstructor: new (signature: AbiFunction) => T,
        signature: AbiFunction
    ): T;

    public static ofSignature<T extends ABIItem>(
        ABIItemConstructor: new (signature: AbiEvent) => T,
        signature: AbiEvent
    ): T;

    /**
     * Returns and instance of an ABIItem from a signature.
     * @param ABIItemConstructor ABIItem constructor.
     * @param {SignatureType} signature Signature of the ABIIItem.
     * @returns {T} An instance of the ABIItem.
     */
    public static ofSignature<T extends ABIItem>(
        ABIItemConstructor: new (signature: SignatureType) => T,
        signature: SignatureType
    ): T {
        return new ABIItemConstructor(signature);
    }

    /**
     * Returns a string representation of a JSON object or a string.
     * @param {'json' | 'string'} formatType Either JSON or String
     * @returns The string representation of the ABI item.
     */
    public format(formatType: 'json' | 'string' = 'string'): string {
        return formatType === 'json'
            ? JSON.stringify(this.signature)
            : this.stringSignature;
    }

    /**
     * The signature hash of the ABIItem.
     * @returns {string} The signature hash of the ABIItem.
     * @remarks Wrapper for {@link toFunctionHash}.
     **/
    public get signatureHash(): string {
        return toFunctionHash(this.stringSignature);
    }

    /**
     * Compares the current ABIItem instance with another ABIItem instance.
     * @param {ABIItem} that The item to compare with.
     * @returns {number} A non-zero number if the current ABIItem is different to the other ABI or zero if they are equal.
     * @override {@link VeChainDataModel#compareTo}
     **/
    public override compareTo(that: ABIItem): number {
        if (super.compareTo(that) !== 0) {
            return -1;
        }
        return this.stringSignature.localeCompare(that.stringSignature);
    }
}

export { ABIItem };
