"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VeChainAbstractSigner = void 0;
const utils_1 = require("@noble/curves/abstract/utils");
const sdk_core_1 = require("@vechain/sdk-core");
const sdk_errors_1 = require("@vechain/sdk-errors");
const viem_1 = require("viem");
const rpc_methods_1 = require("../../../provider/utils/const/rpc-mapper/rpc-methods");
const utils_2 = require("../../../utils");
/**
 * Abstract VeChain signer.
 * This abstract class avoids people every time implementing standard signer
 * methods.
 * By implementing this abstract class, it will be easier to create new signers
 */
class VeChainAbstractSigner {
    MESSAGE_PREFIX = sdk_core_1.Txt.of('\x19Ethereum Signed Message:\n')
        .bytes;
    /**
     * The provider attached to this Signer (if any).
     */
    provider;
    /**
     * Create a new VeChainPrivateKeySigner.
     * A signer can be initialized using a private key.
     *
     * @param provider - The provider to connect to
     */
    constructor(provider) {
        // Store provider and gasPayer
        this.provider = provider;
    }
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
    async populateCall(transactionToPopulate) {
        // 1 - Add from field (if not provided)
        if (transactionToPopulate.from === undefined ||
            transactionToPopulate.from === null)
            transactionToPopulate.from = sdk_core_1.Address.checksum(sdk_core_1.HexUInt.of(await this.getAddress()));
        // Throw an error if the from address does not match the signer address
        // @note: this because we cannot sign a transaction with a different address
        else if (sdk_core_1.Address.checksum(sdk_core_1.HexUInt.of(transactionToPopulate.from)) !==
            sdk_core_1.Address.checksum(sdk_core_1.HexUInt.of(await this.getAddress()))) {
            throw new sdk_errors_1.InvalidDataType('VeChainAbstractSigner.populateCall()', 'From address does not match the signer address.', {
                signerAddress: sdk_core_1.Address.checksum(sdk_core_1.HexUInt.of(await this.getAddress())),
                fromAddress: sdk_core_1.Address.checksum(sdk_core_1.HexUInt.of(transactionToPopulate.from))
            });
        }
        // 2 - Set to field
        if (transactionToPopulate.to === undefined)
            transactionToPopulate.to = null;
        // 3 - Use directly clauses, if they are provided
        if (transactionToPopulate.clauses !== undefined &&
            transactionToPopulate.clauses.length > 0) {
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
    async populateTransaction(transactionToPopulate) {
        // 1 - Get the thor client
        if (this.provider === undefined) {
            throw new sdk_errors_1.JSONRPCInvalidParams('VechainAbstractSigner.populateTransaction()', 'Thor client not found into the signer. Please attach a Provider with a thor client to your signer instance.', { provider: this.provider });
        }
        const thorClient = this.provider
            .thorClient;
        // 2 - Populate the call, to get proper 'from' and 'to' address (compatible with multi-clause transactions)
        const populatedTransaction = await this.populateCall(transactionToPopulate);
        // 3 - Handle deprecated gasLimit property and estimate gas
        let totalGasResult;
        // Handle deprecated gasLimit property
        if (transactionToPopulate.gasLimit !== undefined) {
            console.warn('\n****************** WARNING: Deprecated Property Usage ******************\n' +
                '- The `gasLimit` property is deprecated and will be removed in a future release.\n' +
                '- Please use the `gas` property instead.\n' +
                '- The `gasLimit` value will be used as the `gas` value for this transaction.\n');
            totalGasResult = Number(transactionToPopulate.gasLimit);
        }
        else if (transactionToPopulate.gas !== undefined) {
            totalGasResult = Number(transactionToPopulate.gas);
        }
        else {
            totalGasResult = await this.estimateGas(transactionToPopulate);
        }
        // 4 - Build the transaction body
        return await thorClient.transactions.buildTransactionBody(populatedTransaction.clauses ??
            this._buildClauses(populatedTransaction), totalGasResult, {
            isDelegated: this.provider?.enableDelegation,
            nonce: populatedTransaction.nonce ??
                (await this.getNonce('pending')),
            blockRef: populatedTransaction.blockRef ?? undefined,
            chainTag: populatedTransaction.chainTag ?? undefined,
            dependsOn: populatedTransaction.dependsOn ?? undefined,
            expiration: populatedTransaction.expiration,
            gasPriceCoef: populatedTransaction.gasPriceCoef ?? undefined,
            maxPriorityFeePerGas: populatedTransaction.maxPriorityFeePerGas ?? undefined,
            maxFeePerGas: populatedTransaction.maxFeePerGas ?? undefined,
            gas: transactionToPopulate.gas,
            gasLimit: transactionToPopulate.gasLimit
        });
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
    async estimateGas(transactionToEstimate) {
        // 1 - Get the thor client
        if (this.provider === undefined) {
            throw new sdk_errors_1.JSONRPCInvalidParams('VechainAbstractSigner.estimateGas()', 'Thor client not found into the signer. Please attach a Provider with a thor client to your signer instance.', { provider: this.provider });
        }
        const thorClient = this.provider
            .thorClient;
        // 2 - Populate the call, to get proper from and to address (compatible with multi-clause transactions)
        const populatedTransaction = await this.populateCall(transactionToEstimate);
        // 3 - Estimate gas
        const gasEstimation = await thorClient.transactions.estimateGas(populatedTransaction.clauses ??
            this._buildClauses(populatedTransaction), populatedTransaction.from);
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
    async call(transactionToEvaluate, revision) {
        // 1 - Get the thor client
        if (this.provider === undefined) {
            throw new sdk_errors_1.JSONRPCInvalidParams('VechainAbstractSigner.call()', 'Thor client not found into the signer. Please attach a Provider with a thor client to your signer instance.', { provider: this.provider });
        }
        const thorClient = this.provider
            .thorClient;
        // 2 - Populate the call, to get proper from and to address (compatible with multi-clause transactions)
        const populatedTransaction = await this.populateCall(transactionToEvaluate);
        // 3 - Evaluate the transaction
        const simulation = await thorClient.transactions.simulateTransaction(populatedTransaction.clauses ??
            this._buildClauses(populatedTransaction), {
            revision: revision ?? undefined,
            gas: populatedTransaction.gas ?? undefined,
            gasPrice: populatedTransaction.gasPrice ?? undefined,
            caller: populatedTransaction.from,
            provedWork: populatedTransaction.provedWork ?? undefined,
            gasPayer: populatedTransaction.gasPayer ?? undefined,
            expiration: populatedTransaction.expiration ?? undefined,
            blockRef: populatedTransaction.blockRef ?? undefined
        });
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
    async getNonce(blockTag) {
        // If provider is available, get the nonce from the provider using eth_getTransactionCount
        if (this.provider !== undefined) {
            return (await this.provider.request({
                method: rpc_methods_1.RPC_METHODS.eth_getTransactionCount,
                params: [await this.getAddress(), blockTag]
            }));
        }
        // Otherwise return a random number
        return sdk_core_1.Hex.random(6).toString();
    }
    /**
     * Signs an [[link-eip-191]] prefixed a personal message.
     *
     * @param {string|Uint8Array} message - The message to be signed.
     *                                      If the %%message%% is a string, it is signed as UTF-8 encoded bytes.
     *                                      It is **not** interpreted as a [[BytesLike]];
     *                                      so the string ``"0x1234"`` is signed as six characters, **not** two bytes.
     * @return {Promise<string>} - A Promise that resolves to the signature as a string.
     */
    async signMessage(message) {
        try {
            const payload = typeof message === 'string' ? sdk_core_1.Txt.of(message).bytes : message;
            const payloadHashed = sdk_core_1.Keccak256.of((0, utils_1.concatBytes)(this.MESSAGE_PREFIX, sdk_core_1.Txt.of(payload.length).bytes, payload)).bytes;
            return await this.signPayload(payloadHashed);
        }
        catch (error) {
            throw new sdk_errors_1.SignerMethodError('VeChainAbstractSigner.signMessage', 'The message could not be signed.', { message }, error);
        }
    }
    /**
     * Deduces the primary from the types if not given.
     * The primary type will be the only type that is not used in any other type.
     * @param {Record<string, TypedDataParameter[]>} types - The types used for EIP712.
     * @returns {string} The primary type.
     */
    deducePrimaryType(types) {
        const parents = new Map();
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
        const primaryTypes = Array.from(parents.keys()).filter((n) => parents.get(n)?.length === 0);
        if (primaryTypes.length !== 1) {
            throw new sdk_errors_1.SignerMethodError('VeChainAbstractSigner.deducePrimaryType', 'Ambiguous primary types or unused types.', { primaryTypes: primaryTypes.join(', ') });
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
    async signTypedData(domain, types, message, primaryType) {
        try {
            const viemDomain = {
                chainId: undefined,
                name: domain.name,
                salt: domain.salt,
                verifyingContract: domain.verifyingContract,
                version: domain.version
            };
            // convert chainId
            if (domain.chainId !== undefined) {
                if (typeof domain.chainId === 'string' ||
                    typeof domain.chainId === 'number') {
                    viemDomain.chainId = BigInt(domain.chainId);
                }
                else if (typeof domain.chainId === 'bigint') {
                    viemDomain.chainId = domain.chainId;
                }
                else {
                    throw new sdk_errors_1.InvalidDataType('VeChainAbstractSigner.signTypedData', 'Invalid chainId type.', { chainId: domain.chainId });
                }
            }
            const payload = sdk_core_1.Hex.of((0, viem_1.hashTypedData)({
                domain: viemDomain,
                types,
                primaryType: primaryType ?? this.deducePrimaryType(types), // Deduce the primary type if not provided
                message
            })).bytes;
            return await this.signPayload(payload);
        }
        catch (error) {
            throw new sdk_errors_1.SignerMethodError('VeChainAbstractSigner.signTypedData', 'The typed data could not be signed.', { domain, types, message, primaryType }, error);
        }
    }
    /**
     * Use vet.domains to resolve name to address
     * @param vnsName - The name to resolve
     * @returns the address for a name or null
     */
    async resolveName(vnsName) {
        if (this.provider === undefined) {
            return null;
        }
        return await utils_2.vnsUtils.resolveName(this.provider.thorClient, vnsName);
    }
    /**
     * Build the transaction clauses
     * form a transaction given as input
     *
     * @param transaction - The transaction to sign
     * @returns The transaction clauses
     */
    _buildClauses(transaction) {
        return transaction.to !== undefined && transaction.to !== null
            ? // Normal transaction
                [
                    {
                        to: transaction.to,
                        data: transaction.data ?? '0x',
                        value: transaction.value ?? '0x0'
                    }
                ]
            : // If 'to' address is not provided, it will be assumed that the transaction is a contract creation transaction.
                [
                    sdk_core_1.Clause.deployContract(sdk_core_1.HexUInt.of(transaction.data ?? 0), undefined, {
                        value: transaction.value === undefined
                            ? transaction.value
                            : sdk_core_1.HexUInt.of(transaction.value).toString(true),
                        comment: transaction.comment
                    })
                ];
    }
}
exports.VeChainAbstractSigner = VeChainAbstractSigner;
