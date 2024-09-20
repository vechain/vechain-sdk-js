import {
    InvalidAbiDataToEncodeOrDecode,
    InvalidAbiFragment
} from '@vechain/sdk-errors';
import { ethers, type EventFragment, type Interface } from 'ethers';

/** DISCLAIMER: To be removed once this discussion is addressed {@link https://github.com/wevm/viem/discussions/2676} */
/**
 * Represents an event call in the Event ABI.
 *
 * @template ABIType - The ABI fragment type.
 */
class ABIEthersEvent<ABIType> {
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
                'ABIEthersEvent constructor',
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
                'ABIEthersEvent.encodeEventLog()',
                'Encoding failed: Data format is invalid. Event data does not match the expected format for ABI type encoding.',
                { dataToEncode },
                e
            );
        }
    }
}

export { ABIEthersEvent };
