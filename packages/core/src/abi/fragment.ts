import {
    InvalidAbiDataToEncodeOrDecode,
    InvalidAbiFragment
} from '@vechain/sdk-errors';
import { ethers } from 'ethers';
import { type EventFragment, type Interface } from './types';

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
}

export { Event };
