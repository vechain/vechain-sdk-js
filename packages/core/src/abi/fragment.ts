import { ethers, type Fragment } from 'ethers';
import {
    type BytesLike,
    type EventFragment,
    type FormatType,
    type FunctionFragment,
    type Interface,
    type Result
} from './types';
import {
    InvalidAbiDataToEncodeOrDecode,
    InvalidAbiFragment,
    InvalidAbiSignatureFormat
} from '@vechain/sdk-errors';
import { sanitizeValuesToEncode } from './helpers/fragment';

/**
 * Allowed formats for the signature.
 *
 * @private
 */
const allowedSignatureFormats = ['sighash', 'minimal', 'full', 'json'];

/**
 * Generic implementation of a function that returns a signature.
 * Used to avoid code duplication.
 *
 * @param fragment - Fragment to use.
 * @param formatType - Format type of the signature.
 * @returns The signature.
 * @throws {InvalidAbiSignatureFormat}
 */
function getSignature(fragment: Fragment, formatType: FormatType): string {
    // If the formatType is not included in the allowed formats, throw an error.
    if (!allowedSignatureFormats.includes(formatType)) {
        throw new InvalidAbiSignatureFormat(
            'getSignature()',
            'Initialization failed: Cannot create Function fragment. Function format is invalid.',
            {
                signatureFormat: formatType
            }
        );
    }

    return fragment.format(formatType);
}

/**
 * Represents a function call in the Event/Function ABI.
 *
 * @template ABIType - The ABI fragment type.
 */
class Function<ABIType> {
    /**
     * The main fragment handled by ethers.js.
     *
     */
    public fragment: FunctionFragment;

    /**
     * The main interface handled by ethers.js.
     */
    public iface: Interface;

    /**
     * Creates a new Function instance from an ABI fragment.
     *
     * @param source - ABI fragment to use.
     * @throws {InvalidAbiFragment}
     */
    constructor(source: ABIType) {
        try {
            this.fragment = ethers.FunctionFragment.from(source);
            this.iface = new ethers.Interface([this.fragment]);
        } catch (e) {
            throw new InvalidAbiFragment(
                'abi.Function constructor',
                'Initialization failed: Cannot create Function fragment. Function format is invalid.',
                {
                    type: 'function',
                    fragment: source
                },
                e
            );
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
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public decodeInput(data: BytesLike): Result {
        try {
            return this.iface.decodeFunctionData(this.fragment, data);
        } catch (e) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'abi.Function.decodeInput()',
                'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.',
                { data },
                e
            );
        }
    }

    /**
     * Decodes the output data from a transaction based on ABI (Application Binary Interface) specifications.
     * This method attempts to decode the given byte-like data into a readable format using the contract's interface.
     *
     * @param data - The `BytesLike` data to be decoded, typically representing the output of a contract function call.
     * @returns A `Result` object containing the decoded data.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     *
     * @example
     * ```typescript
     *   const decoded = contractInstance.decodeOutput(rawTransactionOutput);
     *   console.log('Decoded Output:', decoded);
     * ```
     */
    public decodeOutput(data: BytesLike): Result {
        try {
            return this.iface.decodeFunctionResult(this.fragment, data);
        } catch (e) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'abi.Function.decodeOutput()',
                'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.',
                { data },
                e
            );
        }
    }

    /**
     * Encode data using the function's ABI.
     *
     * @param dataToEncode - Data to encode.
     * @returns Encoded data.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public encodeInput<TValue>(dataToEncode?: TValue[]): string {
        try {
            return this.iface.encodeFunctionData(this.fragment, dataToEncode);
        } catch (e) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'abi.Function.encodeInput()',
                'Encoding failed: Data format is invalid. Function data does not match the expected format for ABI type encoding.',
                { dataToEncode },
                e
            );
        }
    }
}

/**
 * Represents an event call in the Event/Function ABI.
 *
 * @template ABIType - The ABI fragment type.
 */
class Event<ABIType> {
    /**
     * The main fragment handled by ethers.js.
     */
    public fragment: EventFragment;

    /**
     * The main interface handled by ethers.js.
     */
    public iface: Interface;

    /**
     * Creates a new Event instance from an ABI fragment.
     *
     * @param source - ABI fragment to use.
     * @throws {InvalidAbiFragment}
     */
    constructor(source: ABIType) {
        try {
            this.fragment = ethers.EventFragment.from(source);
            this.iface = new ethers.Interface([this.fragment]);
        } catch (e) {
            throw new InvalidAbiFragment(
                'abi.Event constructor',
                'Initialization failed: Cannot create Event fragment. Event format is invalid.',
                {
                    type: 'event',
                    fragment: source
                },
                e
            );
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
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public decodeEventLog(data: { data: string; topics: string[] }): Result {
        try {
            return this.iface.decodeEventLog(
                this.fragment,
                data.data,
                data.topics
            );
        } catch (e) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'abi.Event.decodeEventLog()',
                'Decoding failed: Data must be a valid hex string encoding a compliant ABI type.',
                { data },
                e
            );
        }
    }

    /**
     * Encode event log data using the event's ABI.
     *
     * @param dataToEncode - Data to encode.
     * @returns Encoded data along with topics.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public encodeEventLog<TValue>(dataToEncode: TValue[]): {
        data: string;
        topics: string[];
    } {
        try {
            return this.iface.encodeEventLog(this.fragment, dataToEncode);
        } catch (e) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'abi.Event.encodeEventLog()',
                'Encoding failed: Data format is invalid. Event data does not match the expected format for ABI type encoding.',
                { dataToEncode },
                e
            );
        }
    }

    /**
     * Encode event log topics using the event's ABI.
     *
     * @param valuesToEncode - values to encode as topics. Non-indexed values are ignored.
     *                         Only the values of the indexed parameters are needed.
     * @returns Encoded topics array.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    public encodeFilterTopics<TValue>(
        valuesToEncode: TValue[]
    ): Array<string | undefined> {
        try {
            // Sanitize the values to encode
            const sanitizedValuesToEncode = sanitizeValuesToEncode(
                valuesToEncode,
                this.fragment
            );

            return this.iface
                .encodeFilterTopics(this.fragment, sanitizedValuesToEncode)
                .map((topic) => topic ?? undefined) as Array<
                string | undefined
            >;
        } catch (e) {
            throw new InvalidAbiDataToEncodeOrDecode(
                'abi.Event.encodeEventLog()',
                'Encoding failed: Data format is invalid. Event topics values must be correctly formatted for ABI-compliant encoding.',
                { valuesToEncode },
                e
            );
        }
    }
}

/**
 * Object containing ABI representations.
 */
const fragment = {
    Function,
    Event
};

export { fragment };
