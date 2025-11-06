import { IllegalArgumentError, InvalidTransactionField } from '@common';
import { type Address, BlockRef, Hex, Revision } from '@common/vcdm';
import { type EstimateGasOptions, type ThorClient } from '@thor/thor-client';
import {
    type Clause,
    TransactionRequest,
    type TransactionRequestParam
} from '@thor/thor-client/model/transactions';
import { RetrieveRegularBlock } from '@thor/thorest/blocks';
import { log } from '@common/logging';

/**
 * The name of the build task.
 */
enum BuildTaskName {
    WITH_DEFAULT_BLOCK_REF = 'withDefaultBlockRef',
    WITH_DEFAULT_CHAIN_TAG = 'withDefaultChainTag',
    WITH_DEFAULT_MAX_FEE_PER_GAS = 'withDefaultMaxFeePerGas',
    WITH_ESTIMATED_GAS = 'withEstimatedGas'
}

/**
 * A build task that is executed asynchronously to build the transaction request.
 */
interface AsyncBuildTask {
    name: BuildTaskName;
    task: () => Promise<void>;
}

/**
 * The TransactionBuilder class is used to build a transaction request.
 */
class TransactionBuilder {
    private params: TransactionRequestParam;
    private buildTasks: AsyncBuildTask[];

    private readonly thorClient: ThorClient;
    public static readonly DEFAULT_EXPIRATION = 32;
    public static readonly DEFAULT_GAS_PRICE_COEF = 0n;
    private static readonly STARTING_BLOCK_REF = Hex.of('0x0');
    private static readonly STARTING_CHAIN_TAG = 0;
    private static readonly STARTING_NONCE = 0;
    private static readonly STARTING_GAS = 0n;

    // starting values for the builder
    private readonly startingParams: TransactionRequestParam = {
        beggar: undefined,
        blockRef: TransactionBuilder.STARTING_BLOCK_REF,
        chainTag: TransactionBuilder.STARTING_CHAIN_TAG,
        clauses: [],
        dependsOn: null,
        expiration: TransactionBuilder.DEFAULT_EXPIRATION,
        gas: TransactionBuilder.STARTING_GAS,
        gasPriceCoef: undefined,
        nonce: TransactionBuilder.STARTING_NONCE,
        maxFeePerGas: undefined,
        maxPriorityFeePerGas: undefined
    } satisfies TransactionRequestParam;

    // constructor from thor client
    private constructor(thorClient: ThorClient) {
        this.thorClient = thorClient;
        this.params = { ...this.startingParams, clauses: [] };
        this.buildTasks = [];
        log.debug({
            message: 'TransactionBuilder created',
            context: { thorClient: this.thorClient.httpClient.baseURL }
        });
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
     * Adds a build task to the builder.
     * @param task - The build task to add.
     */
    private addTask(task: AsyncBuildTask): void {
        // remove any existing task with the same name
        this.buildTasks = this.buildTasks.filter((t) => t.name !== task.name);
        // add the new task
        this.buildTasks.push(task);
        log.debug({
            message: `TransactionBuilder.addTask: Added build task: ${task.name}`,
            context: { task }
        });
    }

    /**
     * Sets the requester for a gas sponsored transaction.
     * @param requester - The address of the requester.
     * @returns The builder instance.
     */
    public withSponsorReq(requester: Address): this {
        this.params.beggar = requester;
        log.debug({
            message: 'TransactionBuilder.withSponsorReq',
            context: { requester }
        });
        return this;
    }

    /**
     * Sets the block reference for the transaction.
     * @param blockRef - The block reference to set.
     * @returns The builder instance.
     */
    public withBlockRef(blockRef: Hex): this {
        this.params.blockRef = blockRef;
        log.debug({
            message: 'TransactionBuilder.withBlockRef',
            context: { blockRef }
        });
        return this;
    }

    /**
     * Sets the chain tag for the transaction.
     * @param chainTag - The chain tag to set.
     * @returns The builder instance.
     * @throws IllegalArgumentError if the chain tag is negative.
     */
    public withChainTag(chainTag: number): this {
        if (chainTag < 0) {
            throw new IllegalArgumentError(
                'TransactionBuilder.withChainTag',
                'Chain tag must be non-negative.',
                { chainTag }
            );
        }
        this.params.chainTag = chainTag;
        log.debug({
            message: 'TransactionBuilder.withChainTag',
            context: { chainTag }
        });
        return this;
    }

    /**
     * Sets the clauses for the transaction.
     * @param clauses - The clauses to set.
     * @returns The builder instance.
     * @throws IllegalArgumentError if the clauses are empty.
     */
    public withClauses(clauses: Clause[]): this {
        if (clauses.length === 0) {
            throw new IllegalArgumentError(
                'TransactionBuilder.withClauses',
                'At least one clause is required to build a transaction.',
                { clauses }
            );
        }
        this.params.clauses = [...clauses];
        log.debug({
            message: 'TransactionBuilder.withClauses',
            context: { clauses }
        });
        return this;
    }

    /**
     * Sets the depends on for the transaction.
     * @param dependsOn - The transaction ID that this transaction depends on.
     * @returns The builder instance.
     */
    public withDependsOn(dependsOn: Hex): this {
        this.params.dependsOn = dependsOn;
        log.debug({
            message: 'TransactionBuilder.withDependsOn',
            context: { dependsOn }
        });
        return this;
    }

    /**
     * Sets the expiration for the transaction.
     * @param expiration - The expiration to set.
     * @returns The builder instance.
     * @throws IllegalArgumentError if the expiration is negative.
     */
    public withExpiration(expiration: number): this {
        if (expiration < 0) {
            throw new IllegalArgumentError(
                'TransactionBuilder.withExpiration',
                'Expiration must be non-negative.',
                { expiration }
            );
        }
        this.params.expiration = expiration;
        log.debug({
            message: 'TransactionBuilder.withExpiration',
            context: { expiration }
        });
        return this;
    }

    /**
     * Sets the max gas for the transaction.
     * @param gas - The max gas to set.
     * @returns The builder instance.
     * @throws IllegalArgumentError if the gas is negative.
     */
    public withGas(gas: bigint): this {
        if (gas < 0n) {
            throw new IllegalArgumentError(
                'TransactionBuilder.withGas',
                'Gas must be non-negative.',
                { gas }
            );
        }
        this.params.gas = gas;
        log.debug({
            message: 'TransactionBuilder.withGas',
            context: { gas }
        });
        return this;
    }

    /**
     * Sets the gas price coef for the transaction (legacy transaction)
     * @param coef - The gas price coef to set. (0 <= coef <= 255)
     * @returns The builder instance.
     */
    public withGasPriceCoef(coef: bigint): this {
        if (coef < 0n || coef > 255n) {
            throw new IllegalArgumentError(
                'TransactionBuilder.withGasPriceCoef',
                'Gas price coef must be between 0 and 255.',
                { coef }
            );
        }
        // sets gasPriceCoef and clears maxFeePerGas and maxPriorityFeePerGas
        this.params.gasPriceCoef = coef;
        this.params.maxFeePerGas = undefined;
        this.params.maxPriorityFeePerGas = undefined;
        log.debug({
            message: 'TransactionBuilder.withGasPriceCoef',
            context: { coef }
        });
        return this;
    }

    /**
     * Sets the nonce for the transaction.
     * @param nonce - The nonce to set.
     * @returns The builder instance.
     * @throws IllegalArgumentError if the nonce is negative.
     */
    public withNonce(nonce: number): this {
        if (nonce < 0) {
            throw new IllegalArgumentError(
                'TransactionBuilder.withNonce',
                'Nonce must be non-negative.',
                { nonce }
            );
        }
        this.params.nonce = nonce;
        log.debug({
            message: 'TransactionBuilder.withNonce',
            context: { nonce }
        });
        return this;
    }

    /**
     * Sets the max fee per gas for the transaction (dynamic fee transaction).
     * @param maxFeePerGas - The max fee per gas to set.
     * @returns The builder instance.
     * @throws IllegalArgumentError if the max fee per gas is negative.
     */
    public withMaxFeePerGas(maxFeePerGas: bigint): this {
        if (maxFeePerGas < 0n) {
            throw new IllegalArgumentError(
                'TransactionBuilder.withMaxFeePerGas',
                'Max fee per gas must be non-negative.',
                { maxFeePerGas }
            );
        }
        this.params.maxFeePerGas = maxFeePerGas;
        this.params.gasPriceCoef = undefined;
        log.debug({
            message: 'TransactionBuilder.withMaxFeePerGas',
            context: { maxFeePerGas }
        });
        return this;
    }

    /**
     * Sets the max priority fee per gas for the transaction (dynamic fee transaction).
     * @param maxPriorityFeePerGas - The max priority fee per gas to set.
     * @returns The builder instance.
     * @throws IllegalArgumentError if the max priority fee per gas is negative.
     */
    public withMaxPriorityFeePerGas(maxPriorityFeePerGas: bigint): this {
        if (maxPriorityFeePerGas < 0n) {
            throw new IllegalArgumentError(
                'TransactionBuilder.withMaxPriorityFeePerGas',
                'Max priority fee per gas must be non-negative.',
                { maxPriorityFeePerGas }
            );
        }
        this.params.maxPriorityFeePerGas = maxPriorityFeePerGas;
        this.params.gasPriceCoef = undefined;
        log.debug({
            message: 'TransactionBuilder.withMaxPriorityFeePerGas',
            context: { maxPriorityFeePerGas }
        });
        return this;
    }

    /**
     * Sets the default block ref for the transaction to the current best block.
     * @returns The builder instance.
     */
    public withDefaultBlockRef(): this {
        const task: () => Promise<void> = async () => {
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
        this.addTask({
            name: BuildTaskName.WITH_DEFAULT_BLOCK_REF,
            task
        });
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
        this.addTask({
            name: BuildTaskName.WITH_DEFAULT_CHAIN_TAG,
            task
        });
        return this;
    }

    /**
     * Sets the default expiration for the transaction to the default expiration.
     * @returns The builder instance.
     */
    public withDefaultExpiration(): this {
        this.params.expiration = TransactionBuilder.DEFAULT_EXPIRATION;
        log.debug({
            message: 'TransactionBuilder.withDefaultExpiration',
            context: { expiration: this.params.expiration }
        });
        return this;
    }

    /**
     * Sets the default nonce for the transaction to a random nonce.
     * @returns The builder instance.
     */
    public withRandomNonce(): this {
        this.params.nonce = Number(Hex.random(4).toString());
        log.debug({
            message: 'TransactionBuilder.withRandomNonce',
            context: { nonce: this.params.nonce }
        });
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
        this.addTask({
            name: BuildTaskName.WITH_DEFAULT_MAX_FEE_PER_GAS,
            task
        });
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
        this.addTask({
            name: BuildTaskName.WITH_ESTIMATED_GAS,
            task
        });
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
        log.debug({
            message:
                'TransactionBuilder.withDynFeeTxDefaults task(s) added to build tasks'
        });
        return this;
    }

    /**
     * Sets all the default values needed for a legacy transaction.
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
        log.debug({
            message:
                'TransactionBuilder.withLegacyTxDefaults task(s) added to build tasks'
        });
        return this;
    }

    /**
     * Resets the builder, erasing all the set parameters.
     * @returns The builder instance.
     */
    public reset(): this {
        this.params = { ...this.startingParams, clauses: [] };
        this.buildTasks = [];
        log.debug({
            message: 'TransactionBuilder reset'
        });
        return this;
    }

    /**
     * Checks the builder parameters and build tasks to ensure the transaction request can be built.
     * @throws InvalidTransactionField if the transaction request is invalid.
     */
    private preBuildChecks(): void {
        // check if clauses are empty
        if (this.params.clauses.length === 0) {
            log.error({
                message:
                    'TransactionBuilder.build: At least one clause is required to build a transaction.',
                context: { params: this.params }
            });
            throw new InvalidTransactionField(
                'TransactionBuilder.build',
                'At least one clause is required to build a transaction.',
                { params: this.params }
            );
        }
        // check if block ref was not set by the user
        if (
            this.params.blockRef.bi === TransactionBuilder.STARTING_BLOCK_REF.bi
        ) {
            // not directly set by the user, perhaps use default block ref task added
            const defaultBlockRefTask = this.buildTasks.find(
                (t) => t.name === BuildTaskName.WITH_DEFAULT_BLOCK_REF
            );
            if (defaultBlockRefTask === undefined) {
                // no default block ref task added, add it
                log.warn({
                    message:
                        'TransactionBuilder.build: Block ref not set, adding default block ref',
                    context: { params: this.params }
                });
                this.withDefaultBlockRef();
            }
        }
        // check if chain tag was not set by the user
        if (this.params.chainTag === TransactionBuilder.STARTING_CHAIN_TAG) {
            // not directly set by the user, perhaps use default chain tag task added
            const defaultChainTagTask = this.buildTasks.find(
                (t) => t.name === BuildTaskName.WITH_DEFAULT_CHAIN_TAG
            );
            if (defaultChainTagTask === undefined) {
                // no default chain tag task added, add it
                log.warn({
                    message:
                        'TransactionBuilder.build: Chain tag not set, adding default chain tag',
                    context: { params: this.params }
                });
                this.withDefaultChainTag();
            }
        }
        // check if estimating gas was not set by the user
        if (this.params.gas === TransactionBuilder.STARTING_GAS) {
            // not directly set by the user, perhaps use estimated gas task added
            const estimatedGasTask = this.buildTasks.find(
                (t) => t.name === BuildTaskName.WITH_ESTIMATED_GAS
            );
            if (estimatedGasTask === undefined) {
                // no estimated gas task added, throw error
                log.error({
                    message:
                        'TransactionBuilder.build: Gas estimation was not called, cannot build transaction'
                });
                throw new InvalidTransactionField(
                    'TransactionBuilder.build',
                    'Gas estimation was not called, cannot build transaction',
                    { params: this.params }
                );
            }
        }
    }

    /**
     * Checks the builder parameters after running all async tasks.
     */
    private async postBuildChecks(): Promise<void> {
        // if user did not add task for legacy or dynamic fee, execute that task
        if (
            this.params.gasPriceCoef === undefined &&
            this.params.maxFeePerGas === undefined
        ) {
            // add default task for dynamic fee
            this.withDefaultMaxFeePerGas();
            const feeTask = this.buildTasks.find(
                (t) => t.name === BuildTaskName.WITH_DEFAULT_MAX_FEE_PER_GAS
            );
            if (feeTask !== undefined) {
                log.debug({
                    message: `TransactionBuilder.build: Executing default fee task`
                });
                await feeTask.task();
            }
        }
        // check if nonce was not set
        if (this.params.nonce === TransactionBuilder.STARTING_NONCE) {
            this.withRandomNonce();
        }
    }

    /**
     * Builds the transaction request and resets the builder.
     * If user did not add task for legacy or dynamic fee, a dynamic fee transaction will be used.
     * The builder will reset itself after building the transaction request.
     * @returns The transaction request.
     * @throws InvalidTransactionField if the transaction request is invalid.
     */
    public async build(): Promise<TransactionRequest> {
        try {
            // check if the transaction request can be built
            this.preBuildChecks();
            // run all async build tasks
            for (const buildTask of this.buildTasks) {
                log.debug({
                    message: `TransactionBuilder.build: Executing build task: ${buildTask.name}`
                });
                await buildTask.task();
            }
            // check if the transaction request can be built after running all async tasks
            await this.postBuildChecks();
            // build the transaction request
            return new TransactionRequest(this.params);
        } finally {
            this.reset();
        }
    }
}

export { TransactionBuilder };
