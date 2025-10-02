import { IllegalArgumentError } from '@common';
import { type Address, BlockRef, Hex, Revision } from '@common/vcdm';
import { type EstimateGasOptions, type ThorClient } from '@thor/thor-client';
import {
    TransactionRequest,
    type Clause,
    type TransactionRequestParam
} from '@thor/thor-client/model/transactions';
import { RetrieveRegularBlock } from '@thor/thorest/blocks';

class TransactionBuilder {
    private readonly params: TransactionRequestParam;
    private readonly thorClient: ThorClient;

    public static readonly DEFAULT_EXPIRATION = 32;

    private constructor(thorClient: ThorClient) {
        this.thorClient = thorClient;
        this.params = {
            blockRef: Hex.of('0x0'),
            chainTag: 0,
            clauses: [],
            dependsOn: null,
            expiration: TransactionBuilder.DEFAULT_EXPIRATION,
            gas: 0n,
            gasPriceCoef: undefined,
            nonce: 0,
            isIntendedToBeSponsored: false,
            maxFeePerGas: undefined,
            maxPriorityFeePerGas: undefined
        } satisfies TransactionRequestParam;
    }

    public static create(thorClient: ThorClient): TransactionBuilder {
        return new TransactionBuilder(thorClient);
    }

    // with methods for each parameter

    public withBlockRef(v: Hex): this {
        this.params.blockRef = v;
        return this;
    }

    public withChainTag(v: number): this {
        this.params.chainTag = v;
        return this;
    }

    public withClauses(v: Clause[]): this {
        this.params.clauses = v;
        return this;
    }

    public withDependsOn(v: Hex): this {
        this.params.dependsOn = v;
        return this;
    }

    public withExpiration(v: number): this {
        this.params.expiration = v;
        return this;
    }

    public withGas(v: bigint): this {
        this.params.gas = v;
        return this;
    }

    public withGasPriceCoef(v: bigint): this {
        // sets gasPriceCoef and clears maxFeePerGas and maxPriorityFeePerGas
        this.params.gasPriceCoef = v;
        this.params.maxFeePerGas = undefined;
        this.params.maxPriorityFeePerGas = undefined;
        return this;
    }

    public withNonce(v: number): this {
        this.params.nonce = v;
        return this;
    }

    public withIsIntendedToBeSponsored(v: boolean): this {
        this.params.isIntendedToBeSponsored = v;
        return this;
    }

    public withMaxFeePerGas(v: bigint): this {
        this.params.maxFeePerGas = v;
        this.params.gasPriceCoef = undefined;
        return this;
    }

    public withMaxPriorityFeePerGas(v: bigint): this {
        this.params.maxPriorityFeePerGas = v;
        this.params.gasPriceCoef = undefined;
        return this;
    }

    // with default values for each parameter

    public async withDefaultBlockRef(): Promise<this> {
        // best block block ref
        const blockResponse = await RetrieveRegularBlock.of(
            Revision.of('best')
        ).askTo(this.thorClient.httpClient);
        if (blockResponse.response === null) {
            throw new IllegalArgumentError(
                'TransactionBuilder.withDefaultBlockRef',
                'Best block not found.'
            );
        }
        this.params.blockRef = BlockRef.of(blockResponse.response.id);
        return this;
    }

    public async withDefaultChainTag(): Promise<this> {
        // best block chain tag
        const chainTag = await this.thorClient.nodes.getChainTag();
        this.params.chainTag = chainTag;
        return this;
    }

    public withDefaultExpiration(): this {
        this.params.expiration = TransactionBuilder.DEFAULT_EXPIRATION;
        return this;
    }

    public withRandomNonce(): this {
        this.params.nonce = Number(Hex.random(8).toString());
        return this;
    }

    public async withDefaultMaxFeePerGas(): Promise<this> {
        const { maxFeePerGas, maxPriorityFeePerGas } =
            await this.thorClient.gas.computeMaxFeePrices();
        this.params.maxFeePerGas = maxFeePerGas;
        this.params.maxPriorityFeePerGas = maxPriorityFeePerGas;
        this.params.gasPriceCoef = undefined;
        return this;
    }

    public async withEstimatedGas(
        caller: Address,
        options: EstimateGasOptions
    ): Promise<this> {
        const estimate = await this.thorClient.gas.estimateGas(
            this.params.clauses,
            caller,
            options
        );
        this.params.gas = estimate.totalGas;
        return this;
    }

    public async withDefaults(): Promise<this> {
        await this.withDefaultBlockRef();
        await this.withDefaultChainTag();
        this.withDefaultExpiration();
        this.withRandomNonce();
        await this.withDefaultMaxFeePerGas();
        return this;
    }

    public build(): TransactionRequest {
        return new TransactionRequest(this.params);
    }
}

export { TransactionBuilder };
