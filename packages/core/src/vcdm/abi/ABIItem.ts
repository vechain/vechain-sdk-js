import {
    parseAbiItem,
    toFunctionHash,
    toFunctionSignature,
    type AbiEvent,
    type AbiFunction,
    type Abi as ViemABI
} from 'viem';
import { ABI } from './ABI';

/**
 * Represents an ABI (Application Binary Interface) item.
 * @extends VeChainDataModel
 */
abstract class ABIItem extends ABI {
    protected readonly signature: ViemABI;
    public readonly stringSignature: string;
    /**
     * ABI constructor from types, values or signature.
     *
     * @param {string | ViemABI} signature - The signature of the ABI item (Function, Event).
     **/
    public constructor(signature: string | ViemABI) {
        super();
        switch (typeof signature) {
            case 'string':
                this.stringSignature = signature;
                break;
            case 'object':
                this.stringSignature = toFunctionSignature(
                    signature as unknown as AbiFunction | AbiEvent
                );
                break;
            default:
                this.stringSignature = '';
        }
        this.signature =
            typeof signature === 'string' && signature !== ''
                ? parseAbiItem([signature])
                : (signature as ViemABI);
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

export { ABIItem };
