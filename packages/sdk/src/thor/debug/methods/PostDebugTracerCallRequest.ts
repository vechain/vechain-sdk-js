import {
    type PostDebugTracerCallRequestJSON,
    type TracerName
} from '@thor/debug';
import {
    Address,
    type Hex,
    HexUInt,
    IllegalArgumentError,
    Quantity,
    UInt
} from '@vechain/sdk-core';

/**
 * Full-Qualified-Path
 */
const FQP = 'packages/core/src/thor/debug/PostDebugTracerCallRequest.ts!';

/**
 * [PostDebugTracerCallRe](http://localhost:8669/doc/stoplight-ui/#/schemas/PostDebugTracerCallRequest)
 */
class PostDebugTracerCallRequest {
    /**
     * The name of the tracer. An empty name stands for the default struct logger tracer.
     */
    readonly name: TracerName | null;

    /**
     * The configuration of the tracer. It is specific to the name
     */
    readonly config: unknown;

    /**
     * The amount of token to be transferred.
     */
    readonly value: bigint;

    /**
     * The input data for the contract call.
     */
    readonly data: Hex;

    /**
     * The recipient of the call. Null indicates contract deployment.
     */
    readonly to: Address | null;

    /**
     * The maximum allowed gas for execution.
     */
    readonly gas: bigint | null;

    /**
     * The absolute gas price.
     */
    readonly gasPrice: bigint | null;

    /**
     * The caller's address (msg.sender).
     */
    readonly caller: Address | null;

    /**
     * The transaction's proved work (for extension contract).
     */
    readonly provedWork: number | null;

    /**
     * The address of the gas payer (for extension contract).
     */
    readonly gasPayer: Address | null;

    /**
     * The transaction expiration (for extension contract).
     */
    readonly expiration: number | null;

    /**
     * The block reference (for extension contract).
     */
    readonly blockRef: Hex | null;

    /**
     * Constructs an instance of the class using the provided JSON object.
     *
     * @param {PostDebugTracerCallRequestJSON} json - The JSON object used to initialize the instance. Contains the following fields:
     * @throws {IllegalArgumentError} If the JSON object cannot be parsed or contains invalid fields.
     */
    constructor(json: PostDebugTracerCallRequestJSON) {
        try {
            this.name =
                json.name !== undefined && json.name !== null
                    ? (json.name as TracerName)
                    : null;
            this.config = json.config ?? null;
            this.value = BigInt(json.value);
            this.data = HexUInt.of(json.data);
            this.to =
                json.to !== undefined && json.to !== null
                    ? Address.of(json.to)
                    : null;
            this.gas =
                json.gas !== undefined && json.gas !== null
                    ? BigInt(json.gas)
                    : null;
            this.gasPrice =
                json.gasPrice !== undefined && json.gasPrice !== null
                    ? BigInt(json.gasPrice)
                    : null;
            this.caller =
                json.caller !== undefined && json.caller !== null
                    ? Address.of(json.caller)
                    : null;
            this.provedWork =
                json.provedWork !== undefined && json.provedWork !== null
                    ? UInt.of(Number(json.provedWork)).valueOf()
                    : null;
            this.gasPayer =
                json.gasPayer !== undefined && json.provedWork !== null
                    ? Address.of(json.gasPayer)
                    : null;
            this.expiration =
                json.expiration !== undefined && json.expiration !== null
                    ? UInt.of(Number(json.expiration)).valueOf()
                    : null;
            this.blockRef =
                json.blockRef !== undefined && json.blockRef !== null
                    ? HexUInt.of(json.blockRef)
                    : null;
        } catch (error) {
            throw new IllegalArgumentError(
                `${FQP}constructor(json: PostDebugTracerCallRequestJSON)`,
                'Bad parse',
                { json },
                error instanceof Error ? error : undefined
            );
        }
    }

    /**
     * Converts the current object instance into a JSON representation.
     *
     * @return {PostDebugTracerCallRequestJSON} A JSON object representing the state and data of the current instance.
     */
    toJSON(): PostDebugTracerCallRequestJSON {
        return {
            name: this.name?.toString(),
            config: this.config,
            value: Quantity.of(this.value).toString(),
            data: this.data.toString(),
            to: this.to?.toString(),
            gas: this.gas !== null ? Number(this.gas) : undefined,
            gasPrice:
                this.gasPrice !== null ? this.gasPrice.toString() : undefined,
            caller: this.caller !== null ? this.caller.toString() : undefined,
            provedWork:
                this.provedWork !== null
                    ? this.provedWork.toString()
                    : undefined,
            gasPayer:
                this.gasPayer !== null ? this.gasPayer.toString() : undefined,
            expiration: this.expiration ?? undefined,
            blockRef:
                this.blockRef !== null ? this.blockRef.toString() : undefined
        };
    }
}

export { PostDebugTracerCallRequest };
