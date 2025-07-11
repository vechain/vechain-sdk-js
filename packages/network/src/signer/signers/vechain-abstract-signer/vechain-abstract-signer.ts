import { concatBytes } from '@noble/curves/abstract/utils';
import {
    Address,
    Clause,
    Hex,
    HexUInt,
    Keccak256,
    Txt,
    type TransactionBody,
    type TransactionClause
} from '@vechain/sdk-core';
import {
    InvalidDataType,
    JSONRPCInvalidParams,
    SignerMethodError
} from '@vechain/sdk-errors';
import { hashTypedData } from 'viem';
import { RPC_METHODS } from '../../../provider/utils/const/rpc-mapper/rpc-methods';
import { type TransactionSimulationResult } from '../../../thor-client';
import { vnsUtils } from '../../../utils';
import {
    type AvailableVeChainProviders,
    type TransactionRequestInput,
    type TypedDataDomain,
    type TypedDataParameter,
    type VeChainSigner
} from '../types';
import type { TypedDataDomain as viemTypedDataDomain } from 'viem';

/**
 * Abstract VeChain signer.
 * This abstract class avoids people every time implementing standard signer
 * methods.
 * By implementing this abstract class, it will be easier to create new signers
 */
abstract class VeChainAbstractSigner implements VeChainSigner {
    protected readonly MESSAGE_PREFIX = Txt.of('\x19Ethereum Signed Message:\n')
        .bytes;

    /**
     * The provider attached to this Signer (if any).
     */
    provider?: AvailableVeChainProviders;

    /**
     * Create a new VeChainPrivateKeySigner.
     * A signer can be initialized using a private key.
     *
     * @param provider - The provider to connect to
     */
    protected constructor(provider?: AvailableVeChainProviders) {
        // Store provider and gasPayer
        this.provider = provider;
    }

    /**
     *  Returns a new instance of this Signer connected to //provider// or detached
     *  from any Provider if undefined.
     *
     * @param provider - The provider to connect to
     * @returns a new instance of this Signer connected to //provider// or detached
     */
    abstract connect(provider: AvailableVeChainProviders): this;

    /**
     * Get the address of the Signer.
     *
     * @returns the address of the signer
     */
    abstract getAddress(): Promise<string>;

    /**
     *  Prepares a {@link TransactionRequestInput} for calling:
     *  - resolves ``to`` and ``from`` addresses
     *  - if ``from`` is specified, check that it matches this Signer
     *
     *  @note: Here the base support of multi-clause transaction is added.
     *  So, if clauses are provided in the transaction, it will be used as it is.
     *  Otherwise, standard transaction will be prepared.
     *
     *  @param transactionToPopulate - The call to prepare
     *  @returns the prepared call transaction
     * @throws {InvalidDataType}
     */
    async populateCall(
        transactionToPopulate: TransactionRequestInput
    ): Promise<TransactionRequestInput> {
        // 1 - Add from field (if not provided)
        if (
            transactionToPopulate.from === undefined ||
            transactionToPopulate.from === null
        )
            transactionToPopulate.from = Address.checksum(
                HexUInt.of(await this.getAddress())
            );
        // Throw an error if the from address does not match the signer address
        // @note: this because we cannot sign a transaction with a different address
        else if (
            Address.checksum(HexUInt.of(transactionToPopulate.from)) !==
            Address.checksum(HexUInt.of(await this.getAddress()))
        ) {
            throw new InvalidDataType(
                'VeChainAbstractSigner.populateCall()',
                'From address does not match the signer address.',
                {
                    signerAddress: Address.checksum(
                        HexUInt.of(await this.getAddress())
                    ),
                    fromAddress: Address.checksum(
                        HexUInt.of(transactionToPopulate.from)
                    )
                }
            );
        }

        // 2 - Set to field
        if (transactionToPopulate.to === undefined)
            transactionToPopulate.to = null;

        // 3 - Use directly clauses, if they are provided
        if (
            transactionToPopulate.clauses !== undefined &&
            transactionToPopulate.clauses.length > 0
        ) {
            // 2.1 - Set to, value and data fields to be consistent
            transactionToPopulate.to = transactionToPopulate.clauses[0].to;
            transactionToPopulate.value =
                transactionToPopulate.clauses[0].value;
            transactionToPopulate.data = transactionToPopulate.clauses[0].data;
        }

        // Return the transaction
        return transactionToPopulate;
    }

    /**
     *  Prepares a {@link TransactionRequestInput} for sending to the network by
     *  populating any missing properties:
     *  - resolves ``to`` and ``from`` addresses
     *  - if ``from`` is specified , check that it matches this Signer
     *  - populates ``nonce`` via ``signer.getNonce("pending")``
     *  - populates gas parameters via ``signer.estimateGas(tx)``
     *  - ... and other necessary properties
     *
     *  @param transactionToPopulate - The call to prepare
     *  @returns the prepared transaction
     *  @throws {JSONRPCInvalidParams}
     */
    async populateTransaction(
        transactionToPopulate: TransactionRequestInput
    ): Promise<TransactionBody> {
        // 1 - Get the thor client
        if ((this.provider as AvailableVeChainProviders) === undefined) {
            throw new JSONRPCInvalidParams(
                'VechainAbstractSigner.populateTransaction()',
                'Thor client not found into the signer. Please attach a Provider with a thor client to your signer instance.',
                { provider: this.provider }
            );
        }

        const thorClient = (this.provider as AvailableVeChainProviders)
            .thorClient;

        // 2 - Populate the call, to get proper 'from' and 'to' address (compatible with multi-clause transactions)
        const populatedTransaction = await this.populateCall(
            transactionToPopulate
        );

        // 3 - Estimate gas
        const totalGasResult =
            transactionToPopulate.gas !== undefined
                ? Number(transactionToPopulate.gas)
                : await this.estimateGas(transactionToPopulate);

        // 4 - Build the transaction body
        return await thorClient.transactions.buildTransactionBody(
            populatedTransaction.clauses ??
                this._buildClauses(populatedTransaction),
            totalGasResult,
            {
                isDelegated: this.provider?.enableDelegation as boolean,
                nonce:
                    populatedTransaction.nonce ??
                    (await this.getNonce('pending')),
                blockRef: populatedTransaction.blockRef ?? undefined,
                chainTag: populatedTransaction.chainTag ?? undefined,
                dependsOn: populatedTransaction.dependsOn ?? undefined,
                expiration: populatedTransaction.expiration,
                gasPriceCoef: populatedTransaction.gasPriceCoef ?? undefined,
                maxPriorityFeePerGas:
                    populatedTransaction.maxPriorityFeePerGas ?? undefined,
                maxFeePerGas: populatedTransaction.maxFeePerGas ?? undefined
            }
        );
    }

    /**
     * Estimates the gas required to execute //tx// on the Blockchain. This
     * will be the expected amount a transaction will need
     * to successfully run all the necessary computations and store the changed state
     * that the transaction intends.
     *
     * @param transactionToEstimate - The transaction to estimate gas for
     * @returns the total estimated gas required
     * @throws {JSONRPCInvalidParams}
     */
    async estimateGas(
        transactionToEstimate: TransactionRequestInput
    ): Promise<number> {
        // 1 - Get the thor client
        if ((this.provider as AvailableVeChainProviders) === undefined) {
            throw new JSONRPCInvalidParams(
                'VechainAbstractSigner.estimateGas()',
                'Thor client not found into the signer. Please attach a Provider with a thor client to your signer instance.',
                { provider: this.provider }
            );
        }

        const thorClient = (this.provider as AvailableVeChainProviders)
            .thorClient;

        // 2 - Populate the call, to get proper from and to address (compatible with multi-clause transactions)
        const populatedTransaction = await this.populateCall(
            transactionToEstimate
        );

        // 3 - Estimate gas
        const gasEstimation = await thorClient.transactions.estimateGas(
            populatedTransaction.clauses ??
                this._buildClauses(populatedTransaction),
            populatedTransaction.from as string
        );

        // Return the gas estimation
        return gasEstimation.totalGas;
    }

    /**
     * Evaluates the //tx// by running it against the current Blockchain state. This
     * cannot change state and has no cost, as it is effectively simulating
     * execution.
     *
     * This can be used to have the Blockchain perform computations based on its state
     * (e.g. running a Contract's getters) or to simulate the effect of a transaction
     * before actually performing an operation.
     *
     * @param transactionToEvaluate - The transaction to evaluate
     * @param revision - The block number or block ID of which the transaction simulation is based on
     * @returns the result of the evaluation
     * @throws {JSONRPCInvalidParams}
     */
    async call(
        transactionToEvaluate: TransactionRequestInput,
        revision?: string
    ): Promise<string> {
        // 1 - Get the thor client
        if ((this.provider as AvailableVeChainProviders) === undefined) {
            throw new JSONRPCInvalidParams(
                'VechainAbstractSigner.call()',
                'Thor client not found into the signer. Please attach a Provider with a thor client to your signer instance.',
                { provider: this.provider }
            );
        }
        const thorClient = (this.provider as AvailableVeChainProviders)
            .thorClient;

        // 2 - Populate the call, to get proper from and to address (compatible with multi-clause transactions)
        const populatedTransaction = await this.populateCall(
            transactionToEvaluate
        );

        // 3 - Evaluate the transaction
        const simulation: TransactionSimulationResult[] =
            await thorClient.transactions.simulateTransaction(
                populatedTransaction.clauses ??
                    this._buildClauses(populatedTransaction),
                {
                    revision: revision ?? undefined,
                    gas: (populatedTransaction.gas as number) ?? undefined,
                    gasPrice: populatedTransaction.gasPrice ?? undefined,
                    caller: populatedTransaction.from as string,
                    provedWork: populatedTransaction.provedWork ?? undefined,
                    gasPayer: populatedTransaction.gasPayer ?? undefined,
                    expiration: populatedTransaction.expiration ?? undefined,
                    blockRef: populatedTransaction.blockRef ?? undefined
                }
            );

        // 4 - Return the result of the evaluation
        return simulation[0].data;
    }

    /**
     *  Gets the next nonce required for this Signer to send a transaction.
     *
     *  @param blockTag - The blocktag to base the transaction count on, keep in mind
     *         many nodes do not honour this value and silently ignore it [default: ``"latest"``]
     *
     *  @NOTE: This method generates a random number as nonce. It is because the nonce in VeChain is a 6-byte number.
     */
    async getNonce(blockTag?: string): Promise<string> {
        // If provider is available, get the nonce from the provider using eth_getTransactionCount
        if (this.provider !== undefined) {
            return (await this.provider.request({
                method: RPC_METHODS.eth_getTransactionCount,
                params: [await this.getAddress(), blockTag]
            })) as string;
        }

        // Otherwise return a random number
        return Hex.random(6).toString();
    }

    /**
     * Signs %%transactionToSign%%, returning the fully signed transaction. This does not
     * populate any additional properties with eth_getTransactionCount: RPC_METHODS, p0: (string | undefined)[], args: EIP1193RequestArguments* @param transactionToSign - The transaction to sign
     * @returns The fully signed transaction
     */
    abstract signTransaction(
        transactionToSign: TransactionRequestInput
    ): Promise<string>;

    /**
     *  Sends %%transactionToSend%% to the Network. The ``signer.populateTransaction(transactionToSend)``
     *  is called first to ensure all necessary properties for the
     *  transaction to be valid have been populated first.
     *
     *  @param transactionToSend - The transaction to send
     *  @returns The transaction response
     */
    abstract sendTransaction(
        transactionToSend: TransactionRequestInput
    ): Promise<string>;

    /**
     * Signs a bytes payload returning the VeChain signature in hexadecimal format.
     * @param {Uint8Array} payload in bytes to sign.
     * @returns {string} The VeChain signature in hexadecimal format.
     */
    abstract signPayload(payload: Uint8Array): Promise<string>;

    /**
     * Signs an [[link-eip-191]] prefixed a personal message.
     *
     * @param {string|Uint8Array} message - The message to be signed.
     *                                      If the %%message%% is a string, it is signed as UTF-8 encoded bytes.
     *                                      It is **not** interpreted as a [[BytesLike]];
     *                                      so the string ``"0x1234"`` is signed as six characters, **not** two bytes.
     * @return {Promise<string>} - A Promise that resolves to the signature as a string.
     */
    public async signMessage(message: string | Uint8Array): Promise<string> {
        try {
            const payload =
                typeof message === 'string' ? Txt.of(message).bytes : message;
            const payloadHashed = Keccak256.of(
                concatBytes(
                    this.MESSAGE_PREFIX,
                    Txt.of(payload.length).bytes,
                    payload
                )
            ).bytes;
            return await this.signPayload(payloadHashed);
        } catch (error) {
            throw new SignerMethodError(
                'VeChainAbstractSigner.signMessage',
                'The message could not be signed.',
                { message },
                error
            );
        }
    }

    /**
     * Deduces the primary from the types if not given.
     * The primary type will be the only type that is not used in any other type.
     * @param {Record<string, TypedDataParameter[]>} types - The types used for EIP712.
     * @returns {string} The primary type.
     */
    private deducePrimaryType(
        types: Record<string, TypedDataParameter[]>
    ): string {
        const parents = new Map<string, string[]>();

        // Initialize parents map
        Object.keys(types).forEach((type) => {
            parents.set(type, []);
        });

        // Populate parents map
        for (const name in types) {
            for (const field of types[name]) {
                // In case the type is an array, we get its prefix
                const type = field.type.split('[')[0];
                if (parents.has(type)) {
                    parents.get(type)?.push(name);
                }
            }
        }

        // Find primary types
        const primaryTypes = Array.from(parents.keys()).filter(
            (n) => parents.get(n)?.length === 0
        );

        if (primaryTypes.length !== 1) {
            throw new SignerMethodError(
                'VeChainAbstractSigner.deducePrimaryType',
                'Ambiguous primary types or unused types.',
                { primaryTypes: primaryTypes.join(', ') }
            );
        }

        return primaryTypes[0];
    }

    /**
     * Signs the [[link-eip-712]] typed data.
     *
     * @param {TypedDataDomain} domain - The domain parameters used for signing.
     * @param {Record<string, TypedDataParameter[]>} types - The types used for signing.
     * @param {Record<string, unknown>} message - The message data to be signed.
     * @param {string} primaryType - The primary type used for signing.
     *
     * @return {Promise<string>} - A promise that resolves with the signature string.
     */
    public async signTypedData(
        domain: TypedDataDomain,
        types: Record<string, TypedDataParameter[]>,
        message: Record<string, unknown>,
        primaryType?: string
    ): Promise<string> {
        try {
            const viemDomain: viemTypedDataDomain = {
                chainId: undefined,
                name: domain.name,
                salt: domain.salt,
                verifyingContract: domain.verifyingContract,
                version: domain.version
            };
            // convert chainId
            if (domain.chainId !== undefined) {
                if (
                    typeof domain.chainId === 'string' ||
                    typeof domain.chainId === 'number'
                ) {
                    viemDomain.chainId = BigInt(domain.chainId);
                } else if (typeof domain.chainId === 'bigint') {
                    viemDomain.chainId = domain.chainId;
                } else {
                    throw new InvalidDataType(
                        'VeChainAbstractSigner.signTypedData',
                        'Invalid chainId type.',
                        { chainId: domain.chainId }
                    );
                }
            }
            const payload = Hex.of(
                hashTypedData({
                    domain: viemDomain,
                    types,
                    primaryType: primaryType ?? this.deducePrimaryType(types), // Deduce the primary type if not provided
                    message
                })
            ).bytes;

            return await this.signPayload(payload);
        } catch (error) {
            throw new SignerMethodError(
                'VeChainAbstractSigner.signTypedData',
                'The typed data could not be signed.',
                { domain, types, message, primaryType },
                error
            );
        }
    }

    /**
     * Use vet.domains to resolve name to address
     * @param vnsName - The name to resolve
     * @returns the address for a name or null
     */
    async resolveName(vnsName: string): Promise<null | string> {
        if (this.provider === undefined) {
            return null;
        }

        return await vnsUtils.resolveName(this.provider.thorClient, vnsName);
    }

    /**
     * Build the transaction clauses
     * form a transaction given as input
     *
     * @param transaction - The transaction to sign
     * @returns The transaction clauses
     */
    protected _buildClauses(
        transaction: TransactionRequestInput
    ): TransactionClause[] {
        return transaction.to !== undefined && transaction.to !== null
            ? // Normal transaction
              [
                  {
                      to: transaction.to,
                      data: transaction.data ?? '0x',
                      value: transaction.value ?? '0x0'
                  } satisfies TransactionClause
              ]
            : // If 'to' address is not provided, it will be assumed that the transaction is a contract creation transaction.
              [
                  Clause.deployContract(
                      HexUInt.of(transaction.data ?? 0),
                      undefined,
                      {
                          value:
                              transaction.value === undefined
                                  ? transaction.value
                                  : HexUInt.of(transaction.value).toString(
                                        true
                                    ),
                          comment: transaction.comment
                      }
                  ) as TransactionClause
              ];
    }
}

export { VeChainAbstractSigner };
