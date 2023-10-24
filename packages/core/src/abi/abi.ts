import { type Fragment, ethers } from 'ethers';
import {
    type Interface,
    type FunctionFragment,
    type Result,
    type FormatType,
    type ParamType,
    type BytesLike
} from './types';
import { ERRORS } from '../utils';

/**
 * Default AbiCoder instance from ethers.js.
 */
const ethersCoder = new ethers.AbiCoder();

/**
 * Encodes a parameter value.
 *
 * @note `ValueType` is used to explicitly specify the type of the value to encode.
 *
 * @param type - Type of the parameter.
 * @param value - Value to encode.
 * @returns Encoded parameter as a hexadecimal string.
 */
function encode<ValueType>(type: string | ParamType, value: ValueType): string {
    try {
        const encoded = ethersCoder.encode([type], [value]);
        return encoded;
    } catch {
        throw new Error(ERRORS.ABI.INVALID_DATA_TO_ENCODE);
    }
}

/**
 * Decodes a parameter value.
 *
 * @note `ReturnType` is used to explicitly specify the return type (the decoded value) of the function.
 *
 * @param types - Types of parameters.
 * @param data - Data to decode.
 * @returns Decoded parameter value.
 */
function decode<ReturnType>(
    types: string | ParamType,
    data: BytesLike
): ReturnType {
    try {
        const decoded = ethersCoder.decode([types], data).toArray();
        return decoded[0] as ReturnType;
    } catch {
        throw new Error(ERRORS.ABI.INVALID_DATA_TO_DECODE);
    }
}

/**
 * Allowed formats for the signature.
 *
 * @private
 */
const allowedSignatureFormats = ['sighash', 'minimal', 'full', 'json'];

/**
 * Generic implementation of a function that returns a signature.
 * Used to avoid code dupliaction.
 *
 * @param fragment - Fragment to use.
 * @param formatType - Format type of the signature.
 * @returns The signature.
 */
function getSignature(fragment: Fragment, formatType: FormatType): string {
    if (!allowedSignatureFormats.includes(formatType))
        throw new Error(ERRORS.ABI.INVALID_FORMAT_TYPE);

    return fragment.format(formatType);
}

/**
 * Represents a function call in the high-level ABI.
 *
 * @template ABIType - The ABI fragment type.
 */
class Function<ABIType> {
    /**
     * The main fragment handled by ethers.js.
     *
     * @public
     */
    public fragment: FunctionFragment;

    /**
     * The main interface handled by ethers.js.
     *
     * @public
     */
    public iface: Interface;

    /**
     * Creates a new Function instance from an ABI fragment.
     *
     * @param source - ABI fragment to use.
     */
    constructor(source: ABIType) {
        try {
            this.fragment = ethers.FunctionFragment.from(source);
            this.iface = new ethers.Interface([this.fragment]);
        } catch {
            throw new Error(ERRORS.ABI.INVALID_FUNCTION);
        }
    }

    /**
     * Get the signature hash of the function.
     *
     * @returns The signature hash of the function.
     */
    public signatureHash(): string {
        return this.fragment.selector;
    }

    /**
     * Get the signature of the function.
     *
     * @param formatType - The format type of the signature: 'sighash', 'minimal', 'full', or 'json'.
     * @returns The signature of the function.
     */
    public signature(formatType: FormatType): string {
        return getSignature(this.fragment, formatType);
    }

    /**
     * Decode data using the function's ABI.
     *
     * @param data - Data to decode.
     * @returns Decoding results.
     */
    public decodeOutput(data: string): Result {
        try {
            return this.iface.decodeFunctionData(this.fragment, data);
        } catch {
            throw new Error(ERRORS.ABI.INVALID_DATA_TO_DECODE);
        }
    }

    /**
     * Encode data using the function's ABI.
     *
     * @param dataToEncode - Data to encode.
     * @returns Encoded data.
     */
    public encodeInput<TValue>(dataToEncode: TValue[]): string {
        try {
            return this.iface.encodeFunctionData(this.fragment, dataToEncode);
        } catch {
            throw new Error(ERRORS.ABI.INVALID_DATA_TO_ENCODE);
        }
    }
}

/**
 * Represents an event call in the high-level ABI.
 *
 * @template ABIType - The ABI fragment type.
 */
class Event<ABIType> {
    /**
     * The main fragment handled by ethers.js.
     *
     * @public
     */
    public fragment: ethers.EventFragment;

    /**
     * The main interface handled by ethers.js.
     *
     * @public
     */
    public iface: Interface;

    /**
     * Creates a new Event instance from an ABI fragment.
     *
     * @param source - ABI fragment to use.
     */
    constructor(source: ABIType) {
        try {
            this.fragment = ethers.EventFragment.from(source);
            this.iface = new ethers.Interface([this.fragment]);
        } catch {
            throw new Error(ERRORS.ABI.INVALID_EVENT);
        }
    }

    /**
     * Get the signature hash of the event.
     *
     * @returns The signature hash of the event.
     */
    public signatureHash(): string {
        return this.fragment.topicHash;
    }

    /**
     * Get the signature of the event.
     *
     * @param formatType - The format type of the signature: 'sighash', 'minimal', 'full', or 'json'.
     * @returns The signature of the event.
     */
    public signature(formatType: FormatType): string {
        return getSignature(this.fragment, formatType);
    }

    /**
     * Decode event log data using the event's ABI.
     *
     * @param data - Data to decode.
     * @returns Decoding results.
     */
    public decodeEventLog(data: { data: string; topics: string[] }): Result {
        try {
            return this.iface.decodeEventLog(
                this.fragment,
                data.data,
                data.topics
            );
        } catch {
            throw new Error(ERRORS.ABI.INVALID_DATA_TO_DECODE);
        }
    }

    /**
     * Encode event log data using the event's ABI.
     *
     * @param dataToEncode - Data to encode.
     * @returns Encoded data along with topics.
     */
    public encodeEventLog<TValue>(dataToEncode: TValue[]): {
        data: string;
        topics: string[];
    } {
        try {
            return this.iface.encodeEventLog(this.fragment, dataToEncode);
        } catch {
            throw new Error(ERRORS.ABI.INVALID_DATA_TO_ENCODE);
        }
    }
}

/**
 * Object containing high-level ABI representations.
 */
const abi = {
    Function,
    Event,
    encode,
    decode
};

export { abi };
