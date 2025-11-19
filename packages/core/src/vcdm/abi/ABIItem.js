"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ABIItem = void 0;
const viem_1 = require("viem");
const ABI_1 = require("./ABI");
/**
 * Represents an ABI (Application Binary Interface) item.
 * @extends ABI
 */
class ABIItem extends ABI_1.ABI {
    signature;
    stringSignature;
    /**
     * ABIItem constructor from item (Event, Function...) signature.
     *
     * @param {SignatureType} signature - The signature of the ABI item (Function, Event...).
     **/
    constructor(signature) {
        super();
        switch (typeof signature) {
            case 'string':
                this.stringSignature = signature;
                break;
            case 'object':
                this.stringSignature = (0, viem_1.toFunctionSignature)(signature);
                break;
            default:
                this.stringSignature = '';
        }
        this.signature =
            typeof signature === 'string'
                ? (0, viem_1.parseAbiItem)([signature])
                : signature;
    }
    /**
     * Returns and instance of an ABIItem from a signature.
     * @param ABIItemConstructor ABIItem constructor.
     * @param {SignatureType} signature Signature of the ABIIItem.
     * @returns {T} An instance of the ABIItem.
     */
    static ofSignature(ABIItemConstructor, signature) {
        return new ABIItemConstructor(signature);
    }
    /**
     * Returns a string representation of a JSON object or a string.
     * @param {'json' | 'string'} formatType Either JSON or String
     * @returns The string representation of the ABI item.
     */
    format(formatType = 'string') {
        return formatType === 'json'
            ? JSON.stringify(this.signature)
            : this.stringSignature;
    }
    /**
     * The signature hash of the ABIItem.
     * @returns {string} The signature hash of the ABIItem.
     * @remarks Wrapper for {@link toFunctionHash}.
     **/
    get signatureHash() {
        return (0, viem_1.toFunctionHash)(this.stringSignature);
    }
    /**
     * Compares the current ABIItem instance with another ABIItem instance.
     * @param {ABIItem} that The item to compare with.
     * @returns {number} A non-zero number if the current ABIItem is different to the other ABI or zero if they are equal.
     * @override {@link VeChainDataModel#compareTo}
     **/
    compareTo(that) {
        if (super.compareTo(that) !== 0) {
            return -1;
        }
        return this.stringSignature.localeCompare(that.stringSignature);
    }
}
exports.ABIItem = ABIItem;
