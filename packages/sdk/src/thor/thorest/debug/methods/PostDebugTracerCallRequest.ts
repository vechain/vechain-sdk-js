import { type TracerName } from '@thor/thorest/debug';
import { type PostDebugTracerCallRequestJSON } from '@thor/thorest/json';

import { Address, type Hex, HexUInt, Quantity, UInt } from '@common/vcdm';
import { IllegalArgumentError } from '@common/errors';

/**
 * Full-Qualified-Path
 */
const FQP =
    'packages/sdk/src/thor/thorest/debug/methods/PostDebugTracerCallRequest.ts!';

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
            this.name = this.parseOptionalString(
                json.name
            ) as TracerName | null;
            this.config = json.config ?? null;
            this.value = BigInt(json.value);
            this.data = HexUInt.of(json.data);
            this.to = this.parseOptionalAddress(json.to);
            this.gas = this.parseOptionalBigInt(json.gas);
            this.gasPrice = this.parseOptionalBigInt(json.gasPrice);
            this.caller = this.parseOptionalAddress(json.caller);
            this.provedWork = this.parseOptionalUInt(json.provedWork);
            this.gasPayer = this.parseOptionalAddress(json.gasPayer);
            this.expiration = this.parseOptionalUInt(json.expiration);
            this.blockRef = this.parseOptionalHexUInt(json.blockRef);
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

    private parseOptionalString(value: unknown): string | null {
        return value !== undefined && value !== null ? (value as string) : null;
    }

    private parseOptionalAddress(value: unknown): Address | null {
        return value !== undefined && value !== null
            ? Address.of(value as string)
            : null;
    }

    private parseOptionalBigInt(value: unknown): bigint | null {
        return value !== undefined && value !== null
            ? BigInt(value as string)
            : null;
    }

    private parseOptionalUInt(value: unknown): number | null {
        return value !== undefined && value !== null
            ? UInt.of(Number(value)).valueOf()
            : null;
    }

    private parseOptionalHexUInt(value: unknown): HexUInt | null {
        return value !== undefined && value !== null
            ? HexUInt.of(value as string)
            : null;
    }
}

export { PostDebugTracerCallRequest };
