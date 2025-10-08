import { VeChainDataModel } from '@common/vcdm';
import { IllegalArgumentError } from '@common/errors';
import {
    encodeAbiParameters,
    decodeAbiParameters,
    parseAbiParameters
} from 'viem';
import type { AbiParameter } from 'viem';

/**
 * Represents an ABI (Application Binary Interface) item
 */
abstract class ABIItem implements VeChainDataModel<ABIItem> {
    protected readonly _signature: string;

    constructor(signature: string) {
        this._signature = signature;
    }

    get bi(): bigint {
        throw new Error('ABIItem cannot be represented as bigint');
    }

    get bytes(): Uint8Array {
        return new TextEncoder().encode(this._signature);
    }

    get n(): number {
        throw new Error('ABIItem cannot be represented as number');
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
    private readonly _values: unknown[];

    constructor(types: AbiParameter[], values: unknown[]) {
        this._types = types;
        this._values = values;
    }

    get bi(): bigint {
        throw new Error('ABI cannot be represented as bigint');
    }

    get bytes(): Uint8Array {
        return this.encode();
    }

    get n(): number {
        throw new Error('ABI cannot be represented as number');
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
            const encoded = encodeAbiParameters(this._types, this._values);
            return new Uint8Array(Buffer.from(encoded.slice(2), 'hex'));
        } catch (error) {
            throw new Error(
                `Failed to encode ABI: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    /**
     * Create ABI from types and values
     */
    static of(types: AbiParameter[], values: unknown[]): ABI {
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
            return new ABI(types, decoded);
        } catch (error) {
            throw new Error(
                `Failed to decode ABI: ${error instanceof Error ? error.message : 'Unknown error'}`
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
    getValues(): unknown[] {
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

    /**
     * Decode function data
     */
    decodeData(data: string | Uint8Array): unknown[] {
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
            return [...decoded];
        } catch (error) {
            throw new Error(
                `Failed to decode function data: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    /**
     * Encode function data
     */
    encodeData(args: unknown[]): string {
        try {
            return encodeAbiParameters(
                this._abi as readonly AbiParameter[],
                args
            );
        } catch (error) {
            throw new Error(
                `Failed to encode function data: ${error instanceof Error ? error.message : 'Unknown error'}`
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
    private readonly _eventName: TEventName;

    constructor(abi: TAbi, eventName: TEventName, signature: string) {
        super(signature);
        this._abi = abi;
        this._eventName = eventName;
    }

    /**
     * Decode event log data
     */
    decodeEventLog(eventData: { data: string; topics: string[] }): unknown[] {
        try {
            // Simple implementation - in production, use proper event decoding
            return [eventData.data, ...eventData.topics];
        } catch (error) {
            throw new Error(
                `Failed to decode event log: ${error instanceof Error ? error.message : 'Unknown error'}`
            );
        }
    }

    /**
     * Encode event log data
     */
    encodeEventLog(dataToEncode: unknown[]): {
        data: string;
        topics: string[];
    } {
        try {
            // Simple implementation - in production, use proper event encoding
            return {
                data: '0x' + dataToEncode.map((d) => String(d)).join(''),
                topics: []
            };
        } catch (error) {
            throw new Error(
                `Failed to encode event log: ${error instanceof Error ? error.message : 'Unknown error'}`
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

    /**
     * Create ABIContract from viem ABI
     */
    static ofAbi<TAbi extends readonly any[]>(abi: TAbi): ABIContract<TAbi> {
        return new ABIContract(abi);
    }

    /**
     * Get function by name
     */
    getFunction<TFunctionName extends string>(
        name: TFunctionName
    ): ABIFunction<TAbi, TFunctionName> {
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

        const signature = `${name}(${functionAbi.inputs?.map((input: any) => input.type).join(',') || ''})`;
        return new ABIFunction(this._viemABI, name, signature);
    }

    /**
     * Get event by name
     */
    getEvent<TEventName extends string>(
        name: TEventName
    ): ABIEvent<TAbi, TEventName> {
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

        const signature = `${name}(${eventAbi.inputs?.map((input: any) => input.type).join(',') || ''})`;
        return new ABIEvent(this._viemABI, name, signature);
    }

    /**
     * Encode function data
     */
    encodeFunctionData<TFunctionName extends string>(
        functionName: TFunctionName,
        args: unknown[]
    ): string {
        const func = this.getFunction(functionName);
        return func.encodeData(args);
    }

    /**
     * Decode function data
     */
    decodeFunctionData<TFunctionName extends string>(
        functionName: TFunctionName,
        data: string | Uint8Array
    ): unknown[] {
        const func = this.getFunction(functionName);
        return func.decodeData(data);
    }

    /**
     * Encode event log
     */
    encodeEventLog<TEventName extends string>(
        eventName: TEventName,
        eventArgs: unknown[]
    ): { data: string; topics: string[] } {
        const event = this.getEvent(eventName);
        return event.encodeEventLog(eventArgs);
    }

    /**
     * Decode event log
     */
    decodeEventLog<TEventName extends string>(
        eventName: TEventName,
        eventToDecode: { data: string; topics: string[] }
    ): unknown[] {
        const event = this.getEvent(eventName);
        return event.decodeEventLog(eventToDecode);
    }
}

export { ABI, ABIItem, ABIFunction, ABIEvent, ABIContract };
