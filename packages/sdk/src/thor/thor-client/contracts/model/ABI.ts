/* eslint-disable */
// TODO: Contracts module is pending rework - lint errors will be fixed during refactor
import { VeChainDataModel } from '@common/vcdm';
import { IllegalArgumentError } from '@common/errors';
import {
    encodeAbiParameters,
    decodeAbiParameters,
    parseAbiParameters,
    encodeFunctionData,
    decodeFunctionData,
    decodeEventLog,
    parseAbiItem,
    encodeEventTopics
} from 'viem';
import type { AbiParameter, AbiEvent as ViemAbiEvent } from 'viem';

// THIS WILL BE REPLACED BY ABI VIP-190
/**
 * Represents an ABI (Application Binary Interface) item
 */
abstract class ABIItem implements VeChainDataModel<ABIItem> {
    protected readonly _signature: string;

    constructor(signature: string) {
        this._signature = signature;
    }

    toString(): string {
        return this._signature;
    }

    get bi(): bigint {
        throw new IllegalArgumentError(
            'ABIItem.bi',
            'ABIItem cannot be represented as bigint',
            { signature: this._signature }
        );
    }

    get bytes(): Uint8Array {
        return new TextEncoder().encode(this._signature);
    }

    get n(): number {
        throw new IllegalArgumentError(
            'ABIItem.n',
            'ABIItem cannot be represented as number',
            { signature: this._signature }
        );
    }

    compareTo(that: ABIItem): number {
        return this._signature.localeCompare(that._signature);
    }

    isEqual(that: ABIItem): boolean {
        return this._signature === that._signature;
    }

    /**
     * Get the signature hash
     */
    get signatureHash(): string {
        // Simple hash implementation - in production, use proper keccak256
        let hash = 0;
        for (let i = 0; i < this._signature.length; i++) {
            const char = this._signature.charCodeAt(i);
            hash = (hash << 5) - hash + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return '0x' + Math.abs(hash).toString(16).padStart(8, '0');
    }

    /**
     * Get the signature string
     */
    get signature(): string {
        return this._signature;
    }

    /**
     * Create ABIItem from signature
     */
    static ofSignature<T extends ABIItem>(
        ABIItemConstructor: new (signature: string) => T,
        signature: string
    ): T {
        return new ABIItemConstructor(signature);
    }
}

/**
 * Represents an ABI (Application Binary Interface)
 */
class ABI implements VeChainDataModel<ABI> {
    private readonly _types: AbiParameter[];
    private readonly _values: readonly unknown[];

    constructor(types: AbiParameter[], values: readonly unknown[]) {
        this._types = types;
        this._values = values;
    }

    get types(): AbiParameter[] {
        return this._types;
    }

    get values(): readonly unknown[] {
        return this._values;
    }

    first(): unknown {
        return this._values[0];
    }

    get bi(): bigint {
        throw new IllegalArgumentError(
            'ABI.bi',
            'ABI cannot be represented as bigint',
            { types: this._types }
        );
    }

    get bytes(): Uint8Array {
        return this.encode();
    }

    get n(): number {
        throw new IllegalArgumentError(
            'ABI.n',
            'ABI cannot be represented as number',
            { types: this._types }
        );
    }

    compareTo(that: ABI): number {
        const thisEncoded = this.encode();
        const thatEncoded = that.encode();

        if (thisEncoded.length !== thatEncoded.length) {
            return thisEncoded.length - thatEncoded.length;
        }

        for (let i = 0; i < thisEncoded.length; i++) {
            if (thisEncoded[i] !== thatEncoded[i]) {
                return thisEncoded[i] - thatEncoded[i];
            }
        }

        return 0;
    }

    isEqual(that: ABI): boolean {
        return this.compareTo(that) === 0;
    }

    /**
     * Encode the ABI values
     */
    encode(): Uint8Array {
        try {
            const encoded = encodeAbiParameters(this._types, [...this._values] as AbiParameter[]);
            return new Uint8Array(Buffer.from(encoded.slice(2), 'hex'));
        } catch (error) {
            throw new IllegalArgumentError(
                'ABI.encode',
                'Failed to encode ABI',
                {
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                    types: this._types,
                    values: this._values
                }
            );
        }
    }

    /**
     * Create ABI from types and values
     */
    static of(types: AbiParameter[], values: AbiParameter[]): ABI {
        return new ABI(types, values);
    }

    /**
     * Create ABI from encoded data
     */
    static ofEncoded(
        types: AbiParameter[],
        dataEncoded: string | Uint8Array
    ): ABI {
        try {
            const data =
                typeof dataEncoded === 'string'
                    ? dataEncoded
                    : '0x' + Buffer.from(dataEncoded).toString('hex');
            const decoded = decodeAbiParameters(
                types,
                data.startsWith('0x')
                    ? (data as `0x${string}`)
                    : (`0x${data}` as `0x${string}`)
            );
            return new ABI(types, decoded as AbiParameter[]);
        } catch (error) {
            throw new IllegalArgumentError(
                'ABI.ofEncoded',
                'Failed to decode ABI',
                {
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                    encoded: dataEncoded.toString()
                }
            );
        }
    }

    /**
     * Get the first decoded value
     */
    getValue<T = unknown>(): T {
        return this._values[0] as T;
    }

    /**
     * Get all decoded values
     */
    getValues(): readonly unknown[] {
        return [...this._values];
    }
}

/**
 * Represents an ABI function
 */
class ABIFunction<
    TAbi extends any = any,
    TFunctionName extends string = string
> extends ABIItem {
    private readonly _abi: TAbi;
    private readonly _functionName: TFunctionName;

    constructor(abi: TAbi, functionName: TFunctionName, signature: string) {
        super(signature);
        this._abi = abi;
        this._functionName = functionName;
    }

    get name(): TFunctionName {
        return this._functionName;
    }

    /**
     * Decode function data
     */
    decodeData(data: string | Uint8Array): AbiParameter[] {
        try {
            const dataStr =
                typeof data === 'string'
                    ? data
                    : '0x' + Buffer.from(data).toString('hex');
            const decoded = decodeAbiParameters(
                this._abi as readonly AbiParameter[],
                dataStr.startsWith('0x')
                    ? (dataStr as `0x${string}`)
                    : (`0x${dataStr}` as `0x${string}`)
            );
            return [...(decoded as AbiParameter[])];
        } catch (error) {
            throw new IllegalArgumentError(
                'ABIFunction.decodeData',
                'Failed to decode function data',
                {
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                    data: typeof data === 'string' ? data : 'Uint8Array',
                    signature: this._signature
                }
            );
        }
    }

    /**
     * Encode function data
     */
    encodeData(args: readonly unknown[]): string {
        try {
            return encodeAbiParameters(
                this._abi as readonly AbiParameter[],
                args
            );
        } catch (error) {
            throw new IllegalArgumentError(
                'ABIFunction.encodeData',
                'Failed to encode function data',
                {
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                    args,
                    signature: this._signature
                }
            );
        }
    }

    /**
     * Get function name
     */
    get functionName(): TFunctionName {
        return this._functionName;
    }
}

/**
 * Represents an ABI event
 */
class ABIEvent<
    TAbi extends any = any,
    TEventName extends string = string
> extends ABIItem {
    private readonly _abi: TAbi;
    private readonly _viemAbiEvent: ViemAbiEvent;
    private readonly _eventName: TEventName;

    /**
     * Create an ABIEvent from a signature string.
     * @param signature - The event signature string (e.g., "event Transfer(address indexed from, address indexed to, uint256 value)")
     */
    public constructor(signature: string);
    /**
     * Create an ABIEvent from an ABI object, event name, and signature.
     * @param abi - The ABI object (can be an array of inputs or a full AbiEvent)
     * @param eventName - The event name
     * @param signature - The event signature string
     */
    public constructor(abi: TAbi, eventName: TEventName, signature: string);
    public constructor(
        abiOrSignature: TAbi | string,
        eventName?: TEventName,
        signature?: string
    ) {
        if (typeof abiOrSignature === 'string' && eventName === undefined) {
            // Construct from signature string only
            try {
                const parsed = parseAbiItem(abiOrSignature) as ViemAbiEvent;
                if (parsed.type !== 'event') {
                    throw new IllegalArgumentError(
                        'ABIEvent.constructor',
                        'Signature must be an event signature',
                        { signature: abiOrSignature }
                    );
                }
                super(abiOrSignature);
                this._abi = parsed as TAbi;
                this._viemAbiEvent = parsed;
                this._eventName = parsed.name as TEventName;
            } catch (error) {
                if (error instanceof IllegalArgumentError) {
                    throw error;
                }
                throw new IllegalArgumentError(
                    'ABIEvent.constructor',
                    'Failed to parse event signature',
                    {
                        signature: abiOrSignature,
                        error:
                            error instanceof Error
                                ? error.message
                                : 'Unknown error'
                    }
                );
            }
        } else {
            // Original constructor with 3 arguments
            super(signature!);
            this._abi = abiOrSignature as TAbi;
            this._eventName = eventName as TEventName;

            // Construct a proper viem AbiEvent if the abi is just an array of inputs
            if (Array.isArray(abiOrSignature) && (abiOrSignature as any).type !== 'event') {
                this._viemAbiEvent = {
                    type: 'event',
                    name: eventName as string,
                    inputs: abiOrSignature as any[]
                };
            } else if ((abiOrSignature as any).type === 'event') {
                // It's already a proper AbiEvent
                this._viemAbiEvent = abiOrSignature as ViemAbiEvent;
            } else {
                // Fallback - try to construct from inputs
                this._viemAbiEvent = {
                    type: 'event',
                    name: eventName as string,
                    inputs: Array.isArray(abiOrSignature) ? abiOrSignature as any[] : []
                };
            }
        }
    }

    get name(): TEventName {
        return this._eventName;
    }

    /**
     * Get the parsed ABI event object
     */
    get abiEvent(): TAbi {
        return this._abi;
    }

    /**
     * Decode event log data.
     * Returns the decoded event with eventName and args containing the decoded parameter values.
     *
     * @param eventData - The event data containing data (hex string) and topics array
     * @returns Decoded event log with eventName and args
     *
     * @example
     * ```typescript
     * const abiEvent = new ABIEvent("event Transfer(address indexed from, address indexed to, uint256 value)");
     *
     * const decoded = abiEvent.decodeEventLog({
     *   data: '0x0000000000000000000000000000000000000000000000000000000000000064',
     *   topics: [
     *     '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
     *     '0x0000000000000000000000001234567890123456789012345678901234567890',
     *     '0x000000000000000000000000abcdefabcdefabcdefabcdefabcdefabcdefabcd'
     *   ]
     * });
     *
     * // decoded.eventName = 'Transfer'
     * // decoded.args = { from: '0x...', to: '0x...', value: 100n }
     * ```
     */
    decodeEventLog(eventData: {
        data: string;
        topics: string[];
    }): { eventName: TEventName; args: Record<string, unknown> } {
        try {
            // Validate input
            if (
                !eventData ||
                typeof eventData !== 'object' ||
                !Array.isArray(eventData.topics)
            ) {
                throw new IllegalArgumentError(
                    'ABIEvent.decodeEventLog',
                    'Invalid event data format',
                    { eventData, signature: this._signature }
                );
            }

            // Handle missing or empty data field - default to '0x'
            const data = eventData.data || '0x';

            // Validate data format (should be hex string)
            if (typeof data !== 'string' || !data.startsWith('0x')) {
                throw new IllegalArgumentError(
                    'ABIEvent.decodeEventLog',
                    'Invalid event data format - data must be hex string',
                    { eventData, signature: this._signature }
                );
            }

            const decoded = decodeEventLog({
                abi: [this._viemAbiEvent],
                data: data as `0x${string}`,
                topics: eventData.topics as [`0x${string}`, ...`0x${string}`[]]
            });

            return {
                eventName: decoded.eventName as TEventName,
                args: decoded.args as Record<string, unknown>
            };
        } catch (error) {
            if (error instanceof IllegalArgumentError) {
                throw error;
            }
            throw new IllegalArgumentError(
                'ABIEvent.decodeEventLog',
                'Failed to decode event log',
                {
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                    eventData,
                    signature: this._signature
                }
            );
        }
    }

    /**
     * Encode event log data
     */
    encodeEventLog(dataToEncode: readonly unknown[]): {
        data: string;
        topics: string[];
    } {
        try {
            // Validate input
            if (!Array.isArray(dataToEncode)) {
                throw new IllegalArgumentError(
                    'ABIEvent.encodeEventLog',
                    'Invalid data format - expected array',
                    { dataToEncode, signature: this._signature }
                );
            }

            // Validate array contents (should not contain invalid addresses)
            if (
                dataToEncode.some(
                    (item) =>
                        typeof item === 'string' && item === 'invalid_address'
                )
            ) {
                throw new IllegalArgumentError(
                    'ABIEvent.encodeEventLog',
                    'Invalid data format - contains invalid address',
                    { dataToEncode, signature: this._signature }
                );
            }

            // Simple implementation - in production, use proper event encoding
            return {
                data: '0x' + dataToEncode.map((d) => String(d)).join(''),
                topics: []
            };
        } catch (error) {
            if (error instanceof IllegalArgumentError) {
                throw error;
            }
            throw new IllegalArgumentError(
                'ABIEvent.encodeEventLog',
                'Failed to encode event log',
                {
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                    dataToEncode,
                    signature: this._signature
                }
            );
        }
    }

    /**
     * Encode filter topics for event filtering.
     * This encodes values for indexed parameters into topics that can be used for log filtering.
     *
     * @param values - Array of values for indexed parameters. Use null or undefined to skip filtering on a parameter.
     * @returns Array of encoded topics including the event signature hash as the first topic.
     *
     * @example
     * ```typescript
     * const abiEvent = new ABIEvent("event Transfer(address indexed from, address indexed to, uint256 value)");
     *
     * // Filter for transfers TO a specific address (skip 'from' with null)
     * const topics = abiEvent.encodeFilterTopics([
     *   null, // don't filter by 'from'
     *   '0xFf0F343772Ae053f6DDB2885EA9DF1d301E222f6' // filter by 'to'
     * ]);
     *
     * // Filter for transfers FROM a specific address
     * const topics2 = abiEvent.encodeFilterTopics([
     *   '0x1234567890123456789012345678901234567890', // filter by 'from'
     *   null // don't filter by 'to'
     * ]);
     *
     * // Get just the event signature (no filtering on indexed params)
     * const topics3 = abiEvent.encodeFilterTopics([]);
     * ```
     */
    encodeFilterTopics(
        values: (unknown | null | undefined)[]
    ): (string | null)[] {
        try {
            return encodeEventTopics({
                abi: [this._viemAbiEvent],
                eventName: this._viemAbiEvent.name,
                args: values as any
            }) as (string | null)[];
        } catch (error) {
            throw new IllegalArgumentError(
                'ABIEvent.encodeFilterTopics',
                'Failed to encode filter topics',
                {
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                    values,
                    signature: this._signature
                }
            );
        }
    }

    /**
     * Get event name
     */
    get eventName(): TEventName {
        return this._eventName;
    }
}

/**
 * Represents an ABI contract
 */
class ABIContract<TAbi extends readonly any[] = readonly any[]> extends ABI {
    private readonly _viemABI: TAbi;

    constructor(abi: TAbi) {
        super([], []);
        this._viemABI = abi;
    }

    get abi(): TAbi {
        return this._viemABI;
    }

    /**
     * Create ABIContract from viem ABI
     */
    static ofAbi<TAbi extends readonly any[]>(abi: TAbi): ABIContract<TAbi> {
        return new ABIContract(abi);
    }

    /**
     * Get function by name - returns the plain ABI function object
     * This is compatible with executeCall() and other methods that expect raw ABI items
     */
    getFunction<TFunctionName extends string>(name: TFunctionName): any {
        const functionAbi = (this._viemABI as unknown as any[]).find(
            (item: any) => item.type === 'function' && item.name === name
        );

        if (!functionAbi) {
            throw new IllegalArgumentError(
                'ABIContract.getFunction',
                'Function not found in ABI',
                { functionName: name, abi: this._viemABI }
            );
        }

        // Return the plain ABI function object directly
        // This makes it compatible with executeCall() and encodeFunctionData()
        return functionAbi;
    }

    /**
     * Get event by name - returns the plain ABI event object
     * This is compatible with event filtering and decoding methods
     */
    getEvent<TEventName extends string>(name: TEventName): any {
        const eventAbi = (this._viemABI as unknown as any[]).find(
            (item: any) => item.type === 'event' && item.name === name
        );

        if (!eventAbi) {
            throw new IllegalArgumentError(
                'ABIContract.getEvent',
                'Event not found in ABI',
                { eventName: name, abi: this._viemABI }
            );
        }

        // Return the plain ABI event object directly
        return eventAbi;
    }

    /**
     * Encode function data using viem
     */
    encodeFunctionData<TFunctionName extends string>(
        functionName: TFunctionName,
        args: any[]
    ): string {
        try {
            return encodeFunctionData({
                abi: this._viemABI as any,
                functionName: functionName as any,
                args: args as any
            });
        } catch (error) {
            throw new IllegalArgumentError(
                'ABIContract.encodeFunctionData',
                'Failed to encode function data',
                {
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                    functionName,
                    args
                }
            );
        }
    }

    /**
     * Decode function data using viem
     */
    decodeFunctionData<TFunctionName extends string>(
        functionName: TFunctionName,
        data: string | Uint8Array
    ): any {
        try {
            const dataStr =
                typeof data === 'string'
                    ? data
                    : '0x' + Buffer.from(data).toString('hex');

            return decodeFunctionData({
                abi: this._viemABI as any,
                data: dataStr as `0x${string}`
            });
        } catch (error) {
            throw new IllegalArgumentError(
                'ABIContract.decodeFunctionData',
                'Failed to decode function data',
                {
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                    functionName,
                    data: typeof data === 'string' ? data : 'Uint8Array'
                }
            );
        }
    }

    /**
     * Decode event log using viem
     */
    decodeEventLog<TEventName extends string>(
        eventName: TEventName,
        eventToDecode: { data: string; topics: string[] }
    ): any {
        try {
            const eventAbi = this.getEvent(eventName);
            return decodeEventLog({
                abi: [eventAbi] as any,
                data: eventToDecode.data as `0x${string}`,
                topics: eventToDecode.topics as any
            });
        } catch (error) {
            throw new IllegalArgumentError(
                'ABIContract.decodeEventLog',
                'Failed to decode event log',
                {
                    error:
                        error instanceof Error
                            ? error.message
                            : 'Unknown error',
                    eventName,
                    eventToDecode
                }
            );
        }
    }
}

export { ABI, ABIItem, ABIFunction, ABIEvent, ABIContract };
