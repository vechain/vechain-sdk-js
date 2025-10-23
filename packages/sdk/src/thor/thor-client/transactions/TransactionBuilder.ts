import { IllegalArgumentError } from '@common';
import { type Address, BlockRef, Hex, Revision } from '@common/vcdm';
import { type EstimateGasOptions, type ThorClient } from '@thor/thor-client';
import {
    type Clause,
    TransactionRequest,
    type TransactionRequestParam
} from '@thor/thor-client/model/transactions';
import { RetrieveRegularBlock } from '@thor/thorest/blocks';

class TransactionBuilder {
    private params: TransactionRequestParam;
    private buildTasks: Array<() => Promise<void>>;

    private readonly thorClient: ThorClient;
    public static readonly DEFAULT_EXPIRATION = 32;
    public static readonly DEFAULT_GAS_PRICE_COEF = 0n;

    // starting values for the builder
    private readonly startingParams: TransactionRequestParam = {
        beggar: undefined,
        blockRef: Hex.of('0x0'),
        chainTag: 0,
        clauses: [],
        dependsOn: null,
        expiration: TransactionBuilder.DEFAULT_EXPIRATION,
        gas: 0n,
        gasPriceCoef: undefined,
        nonce: 0,
        maxFeePerGas: undefined,
        maxPriorityFeePerGas: undefined
    } satisfies TransactionRequestParam;

    // constructor from thor client
    private constructor(thorClient: ThorClient) {
        this.thorClient = thorClient;
        this.params = this.startingParams;
        this.buildTasks = [];
    }

    /**
     * Creates a new instance of the TransactionBuilder.
     * @param thorClient - The ThorClient instance.
     * @returns The TransactionBuilder instance.
     */
    public static create(thorClient: ThorClient): TransactionBuilder {
        return new TransactionBuilder(thorClient);
    }

    /**
     * Sets the requester for a gas sponsored transaction.
     * @param requester - The address of the requester.
     * @returns The builder instance.
     */
    public withSponsorReq(requester: Address): this {
        this.params.beggar = requester;
        return this;
    }

    /**
     * Sets the block reference for the transaction.
     * @param blockRef - The block reference to set.
     * @returns The builder instance.
     */
    public withBlockRef(blockRef: Hex): this {
        this.params.blockRef = blockRef;
        return this;
    }

    /**
     * Sets the chain tag for the transaction.
     * @param chainTag - The chain tag to set.
     * @returns The builder instance.
     */
    public withChainTag(chainTag: number): this {
        this.params.chainTag = chainTag;
        return this;
    }

    /**
     * Sets the clauses for the transaction.
     * @param clauses - The clauses to set.
     * @returns The builder instance.
     */
    public withClauses(clauses: Clause[]): this {
        this.params.clauses = clauses;
        return this;
    }

    /**
     * Sets the depends on for the transaction.
     * @param dependsOn - The transaction ID that this transaction depends on.
     * @returns The builder instance.
     */
    public withDependsOn(dependsOn: Hex): this {
        this.params.dependsOn = dependsOn;
        return this;
    }

    /**
     * Sets the expiration for the transaction.
     * @param expiration - The expiration to set.
     * @returns The builder instance.
     */
    public withExpiration(expiration: number): this {
        this.params.expiration = expiration;
        return this;
    }

    /**
     * Sets the max gas for the transaction.
     * @param gas - The max gas to set.
     * @returns The builder instance.
     */
    public withGas(gas: bigint): this {
        this.params.gas = gas;
        return this;
    }

    /**
     * Sets the gas price coef for the transaction (legacy transaction)
     * @param coef - The gas price coef to set. (0 <= coef <= 256)
     * @returns The builder instance.
     */
    public withGasPriceCoef(coef: bigint): this {
        // sets gasPriceCoef and clears maxFeePerGas and maxPriorityFeePerGas
        this.params.gasPriceCoef = coef;
        this.params.maxFeePerGas = undefined;
        this.params.maxPriorityFeePerGas = undefined;
        return this;
    }

    /**
     * Sets the nonce for the transaction.
     * @param nonce - The nonce to set.
     * @returns The builder instance.
     */
    public withNonce(nonce: number): this {
        this.params.nonce = nonce;
        return this;
    }

    /**
     * Sets the max fee per gas for the transaction (dynamic fee transaction).
     * @param maxFeePerGas - The max fee per gas to set.
     * @returns The builder instance.
     */
    public withMaxFeePerGas(maxFeePerGas: bigint): this {
        this.params.maxFeePerGas = maxFeePerGas;
        this.params.gasPriceCoef = undefined;
        return this;
    }

    /**
     * Sets the max priority fee per gas for the transaction (dynamic fee transaction).
     * @param maxPriorityFeePerGas - The max priority fee per gas to set.
     * @returns The builder instance.
     */
    public withMaxPriorityFeePerGas(maxPriorityFeePerGas: bigint): this {
        this.params.maxPriorityFeePerGas = maxPriorityFeePerGas;
        this.params.gasPriceCoef = undefined;
        return this;
    }

    // with default values for each parameter

    /**
     * Sets the default block ref for the transaction to the current best block.
     * @returns The builder instance.
     */
    public withDefaultBlockRef(): this {
        const task: () => Promise<void> = async () => {
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
        };
        this.buildTasks.push(task);
        return this;
    }

    /**
     * Sets the default chain tag for the transaction to the current thor client chain tag.
     * @returns The builder instance.
     */
    public withDefaultChainTag(): this {
        const task: () => Promise<void> = async () => {
            // best block chain tag
            const chainTag = await this.thorClient.nodes.getChainTag();
            this.params.chainTag = chainTag;
        };
        this.buildTasks.push(task);
        return this;
    }

    /**
     * Sets the default expiration for the transaction to the default expiration.
     * @returns The builder instance.
     */
    public withDefaultExpiration(): this {
        this.params.expiration = TransactionBuilder.DEFAULT_EXPIRATION;
        return this;
    }

    /**
     * Sets the default nonce for the transaction to a random nonce.
     * @returns The builder instance.
     */
    public withRandomNonce(): this {
        this.params.nonce = Number(Hex.random(4).toString());
        return this;
    }

    /**
     * Sets the calculated max fee per gas for the transaction (dynamic fee transaction).
     * @returns The builder instance.
     */
    public withDefaultMaxFeePerGas(): this {
        const task: () => Promise<void> = async () => {
            const { maxFeePerGas, maxPriorityFeePerGas } =
                await this.thorClient.gas.computeMaxFeePrices();
            this.params.maxFeePerGas = maxFeePerGas;
            this.params.maxPriorityFeePerGas = maxPriorityFeePerGas;
            this.params.gasPriceCoef = undefined;
        };
        this.buildTasks.push(task);
        return this;
    }

    /**
     * Sets the gas limit for the transaction by estimating the gas.
     * @param caller - The address of the caller.
     * @param options - The options for the estimated gas.
     * @returns The builder instance.
     */
    public withEstimatedGas(
        caller: Address,
        options: EstimateGasOptions
    ): this {
        const task: () => Promise<void> = async () => {
            const estimate = await this.thorClient.gas.estimateGas(
                this.params.clauses,
                caller,
                options
            );
            this.params.gas = estimate.totalGas;
        };
        this.buildTasks.push(task);
        return this;
    }

    /**
     * Sets all the default values needed for a dynamic fee transaction.
     * @returns The builder instance.
     */
    public withDynFeeTxDefaults(): this {
        this.withDefaultBlockRef();
        this.withDefaultChainTag();
        this.withDefaultExpiration();
        this.withRandomNonce();
        this.withDefaultMaxFeePerGas();
        return this;
    }

    /**
     * Sets all the default values neededfor a legacy transaction.
     * @returns The builder instance.
     */
    public withLegacyTxDefaults(): this {
        this.withDefaultBlockRef();
        this.withDefaultChainTag();
        this.withDefaultExpiration();
        this.withRandomNonce();
        if (this.params.gasPriceCoef === undefined) {
            this.withGasPriceCoef(TransactionBuilder.DEFAULT_GAS_PRICE_COEF);
        }
        return this;
    }

    /**
     * Resets the builder, erasing all the set parameters.
     * @returns The builder instance.
     */
    public reset(): this {
        this.params = this.startingParams;
        this.buildTasks = [];
        return this;
    }

    /**
     * Builds the transaction request and resets the builder.
     * @returns The transaction request.
     */
    public async build(): Promise<TransactionRequest> {
        for (const task of this.buildTasks) {
            await task();
        }
        const txRequest = new TransactionRequest(this.params);
        this.reset();
        return txRequest;
    }
}

export { TransactionBuilder };
