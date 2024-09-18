import {
    parseAbiItem,
    toFunctionHash,
    toFunctionSignature,
    type AbiEvent,
    type AbiFunction
} from 'viem';
import { ABI } from './ABI';

type ABIItemType = AbiFunction | AbiEvent;

/**
 * Represents an ABI (Application Binary Interface) item.
 * @extends ABI
 */
abstract class ABIItem extends ABI {
    protected readonly signature: ABIItemType;
    public readonly stringSignature: string;
    /**
     * ABIItem constructor from item (Event, Function...) signature.
     *
     * @param {string | ViemABI} signature - The signature of the ABI item (Function, Event...).
     **/
    public constructor(signature: string | ABIItemType) {
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

    /**
     * The signature hash of the ABI.
     * @returns {string} The signature hash of the ABI.
     * @remarks Wrapper for {@link toFunctionHash}.
     **/
    public get signatureHash(): string {
        return toFunctionHash(this.stringSignature);
    }

    /**
     * Compares the current ABI instance with another ABI instance.
     * @param that The ABI to compare with.
     * @returns {number} A non-zero number if the current ABI is different to the other ABI or zero if they are equal.
     * @override {@link VeChainDataModel#compareTo}
     * @remark The comparison is done by comparing the types and values of the ABI instances.
     **/
    public compareTo(that: ABIItem): number {
        if (super.compareTo(that) !== 0) {
            return -1;
        }
        return this.stringSignature.localeCompare(that.stringSignature);
    }
}

export { ABIItem, type ABIItemType };
