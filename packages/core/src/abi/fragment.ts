import { type Fragment, ethers } from 'ethers';
import {
    type Interface,
    type FunctionFragment,
    type Result,
    type FormatType,
    type BytesLike
} from './types';
import { ABI, buildError } from '@vechainfoundation/vechain-sdk-errors';

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
 * @throws{InvalidAbiFormatTypeError}
 * @param fragment - Fragment to use.
 * @param formatType - Format type of the signature.
 * @returns The signature.
 */
function getSignature(fragment: Fragment, formatType: FormatType): string {
    if (!allowedSignatureFormats.includes(formatType))
        throw buildError(
            ABI.INVALID_FORMAT_TYPE,
            `Invalid format type. Allowed formats are: ${allowedSignatureFormats.join(
                ', '
            )}`
        );

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
     * @throws{InvalidAbiFunctionError}
     * @param source - ABI fragment to use.
     */
    constructor(source: ABIType) {
        try {
            this.fragment = ethers.FunctionFragment.from(source);
            this.iface = new ethers.Interface([this.fragment]);
        } catch (e) {
            throw buildError(
                ABI.INVALID_FUNCTION,
                'Invalid Function format. Cannot create Function fragment.',
                { source },
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
     * @throws{InvalidAbiDataToDecodeError}
     * @param data - Data to decode.
     * @returns Decoding results.
     */
    public decodeInput(data: BytesLike): Result {
        try {
            return this.iface.decodeFunctionData(this.fragment, data);
        } catch (e) {
            throw buildError(
                ABI.INVALID_DATA_TO_DECODE,
                'Cannot decode. Data should be a valid hex string that encodes a valid ABI type.',
                { data },
                e
            );
        }
    }

    /**
     * Encode data using the function's ABI.
     *
     * @throws{InvalidAbiDataToEncodeError}
     * @param dataToEncode - Data to encode.
     * @returns Encoded data.
     */
    public encodeInput<TValue>(dataToEncode?: TValue[]): string {
        try {
            return this.iface.encodeFunctionData(this.fragment, dataToEncode);
        } catch (e) {
            throw buildError(
                ABI.INVALID_DATA_TO_ENCODE,
                'Cannot encode. Incorrect Function format.',
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
     * @throws{InvalidAbiEventError}
     * @param source - ABI fragment to use.
     */
    constructor(source: ABIType) {
        try {
            this.fragment = ethers.EventFragment.from(source);
            this.iface = new ethers.Interface([this.fragment]);
        } catch {
            throw buildError(
                ABI.INVALID_EVENT,
                'Invalid Event format. Cannot create Event fragment.'
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
     * @throws{InvalidAbiDataToDecodeError}
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
            throw buildError(
                ABI.INVALID_DATA_TO_DECODE,
                'Cannot decode. Incorrect data or topics.'
            );
        }
    }

    /**
     * Encode event log data using the event's ABI.
     *
     * @throws{InvalidAbiDataToEncodeError}
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
            throw buildError(
                ABI.INVALID_DATA_TO_ENCODE,
                'Cannot encode. Incorrect Event format.'
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
