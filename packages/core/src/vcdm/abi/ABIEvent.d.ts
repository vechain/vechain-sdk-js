import { type AbiEvent, type ContractEventName, type DecodeEventLogReturnType, type EncodeEventTopicsReturnType, type Abi as ViemABI } from 'viem';
import { Hex } from '../Hex';
import { ABIItem } from './ABIItem';
interface ABIEventData {
    data: Hex;
    topics: Array<null | Hex | Hex[]>;
}
/**
 * Represents a function call in the Event ABI.
 * @extends ABIItem
 */
declare class ABIEvent<TAbi extends ViemABI = ViemABI, TEventName extends ContractEventName<TAbi> = ContractEventName<TAbi>> extends ABIItem {
    private readonly abiEvent;
    constructor(signature: string);
    constructor(signature: AbiEvent);
    /**
     * Decode event log data using the event's ABI.
     *
     * @param abi - Event to decode.
     * @returns Decoding results.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    static parseLog<TAbi extends ViemABI, TEventName extends ContractEventName<TAbi>>(abi: TAbi, eventData: ABIEventData): DecodeEventLogReturnType<TAbi, TEventName>;
    /**
     * Decode event log data using the event's ABI.
     *
     * @param event - Event to decode.
     * @returns Decoding results.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    decodeEventLog(event: ABIEventData): DecodeEventLogReturnType<TAbi, TEventName>;
    /**
     * Decode event log data as an array of values
     * @param {ABIEvent} event The data to decode.
     * @returns {unknown[]} The decoded data as array of values.
     */
    decodeEventLogAsArray(event: ABIEventData): unknown[];
    /**
     * Encode event log data returning the encoded data and topics.
     * @param dataToEncode - Data to encode.
     * @returns {ABIEventData} Encoded data along with topics.
     * @remarks There is no equivalent to encodeEventLog in viem {@link https://viem.sh/docs/ethers-migration}. Discussion started here {@link https://github.com/wevm/viem/discussions/2676}.
     */
    encodeEventLog(dataToEncode: unknown[]): ABIEventData;
    /**
     * Encode event log topics using the event's ABI.
     *
     * @param valuesToEncode - values to encode as topics. Non-indexed values are ignored.
     *                         Only the values of the indexed parameters are needed.
     * @returns Encoded topics array.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    encodeFilterTopics(valuesToEncode: Record<string, unknown> | unknown[] | undefined): EncodeEventTopicsReturnType;
    /**
     * Encode event log topics using the event's ABI, replacing null values with undefined.
     * @param valuesToEncode - values to encode as topics. Non-indexed values are ignored.
     *                         Only the values of the indexed parameters are needed.
     * @returns Encoded topics array.
     * @throws {InvalidAbiDataToEncodeOrDecode}
     */
    encodeFilterTopicsNoNull(valuesToEncode: Record<string, unknown> | unknown[] | undefined): Array<string | undefined>;
}
export { ABIEvent, type ABIEventData };
//# sourceMappingURL=ABIEvent.d.ts.map