// import {
//     type AvailableVechainProviders,
//     type TransactionRequest,
//     type TransactionResponse,
//     type VechainSigner
// } from '../types';
// import { type SignTransactionOptions } from '@vechain/sdk-network';
// import {
//     Hex0x,
//     secp256k1,
//     type vechain_sdk_core_ethers
// } from '@vechain/sdk-core';
//
// /**
//  * Abstract class for Vechain Signer
//  * An **AbstractVechainSigner** includes most of the functionality required
//  * to get a [[VechainSigner]] working as expected, but requires a few
//  * Signer-specific methods be overridden.
//  */
// abstract class AbstractVechainSigner<
//     TProviderType extends AvailableVechainProviders
// > implements VechainSigner<TProviderType>
// {
//     /**
//      * ********* START: Delegator needed methods *********
//      */
//
//     /**
//      * The delegator attached to this Signer (if any)
//      */
//     delegator: SignTransactionOptions | null;
//
//     /**
//      * Sign a transaction with the delegator
//      * @param transactionToSign - the transaction to sign
//      * @returns the fully signed transaction
//      */
//     abstract signWithDelegator: (
//         transactionToSign: TransactionRequest
//     ) => Promise<string>;
//
//     /**
//      * Send a transaction with the delegator
//      * @param transactionToSend - the transaction to send
//      * @returns the transaction response
//      */
//     abstract sendWithDelegator: (
//         transactionToSend: TransactionRequest
//     ) => Promise<TransactionResponse>;
//
//     /**
//      * ********* END: Delegator needed methods *********
//      */
//
//     /**
//      * ********* START: Standard ethers signer methods adapted for vechain *********
//      */
//
//     /**
//      * The Provider this Signer is connected to (or null)
//      */
//     provider: TProviderType | null;
//
//     /**
//      * Create a new instance of the AbstractVechainSigner
//      *
//      * @param provider - The Provider this Signer is connected to (or null)
//      * @param delegator - The delegator attached to this Signer (if any)
//      */
//     constructor(
//         provider: TProviderType | null,
//         delegator: SignTransactionOptions | null
//     ) {
//         this.provider = provider;
//         this.delegator = delegator;
//     }
//
//     /**
//      *  Returns a new instance of this Signer connected to //provider// or detached
//      *  from any Provider if null.
//      */
//     connect(provider: TProviderType | null): this {
//         this.provider = provider;
//         return this;
//     }
//
//     /// /////////////////
//     // State
//
//     /**
//      *  Get the address of the Signer.
//      */
//     abstract getAddress(): Promise<string>;
//
//     /**
//      *  Gets the next nonce required for this Signer to send a transaction.
//      *
//      *  @param blockTag - The blocktag to base the transaction count on, keep in mind
//      *         many nodes do not honour this value and silently ignore it [default: ``"latest"``]
//      *
//      *  @NOTE: This method generates a random number as nonce. It is because the nonce in vechain is a 6-byte number.
//      */
//     async getNonce(
//         // eslint-disable-next-line @typescript-eslint/no-unused-vars
//         blockTag?: vechain_sdk_core_ethers.BlockTag
//     ): Promise<number> {
//         // Return a random number
//         return await Promise.resolve(
//             Number(Hex0x.of(secp256k1.randomBytes(6)))
//         );
//     }
//
//     /// /////////////////
//     // Preparation
//
//     /**
//      *  Prepares a {@link TransactionRequest} for calling:
//      *  - resolves ``to`` and ``from`` addresses
//      *  - if ``from`` is specified , check that it matches this Signer
//      *
//      *  @param tx - The call to prepare
//      */
//     abstract populateCall(
//         tx: TransactionRequest
//     ): Promise<vechain_sdk_core_ethers.TransactionLike<string>>;
//
//     /**
//      *  Prepares a {@link TransactionRequest} for sending to the network by
//      *  populating any missing properties:
//      *  - resolves ``to`` and ``from`` addresses
//      *  - if ``from`` is specified , check that it matches this Signer
//      *  - populates ``nonce`` via ``signer.getNonce("pending")``
//      *  - populates ``gasLimit`` via ``signer.estimateGas(tx)``
//      *  - populates ``chainId`` via ``signer.provider.getNetwork()``
//      *  - populates ``type`` and relevant fee data for that type (``gasPrice``
//      *    for legacy transactions, ``maxFeePerGas`` for EIP-1559, etc)
//      *
//      *  @note Some Signer implementations may skip populating properties that
//      *        are populated downstream; for example JsonRpcSigner defers to the
//      *        node to populate the nonce and fee data.
//      *
//      *  @param tx - The call to prepare
//      */
//     abstract populateTransaction(
//         tx: TransactionRequest
//     ): Promise<vechain_sdk_core_ethers.TransactionLike<string>>;
//
//     /// /////////////////
//     // Execution
//
//     /**
//      *  Estimates the required gas required to execute //tx// on the Blockchain. This
//      *  will be the expected amount a transaction will require as its ``gasLimit``
//      *  to successfully run all the necessary computations and store the needed state
//      *  that the transaction intends.
//      *
//      *  Keep in mind that this is **best efforts**, since the state of the Blockchain
//      *  is in flux, which could affect transaction gas requirements.
//      *
//      *  @throws UNPREDICTABLE_GAS_LIMIT A transaction that is believed by the node to likely
//      *          fail will throw an error during gas estimation. This could indicate that it
//      *          will actually fail or that the circumstances are simply too complex for the
//      *          node to take into account. In these cases, a manually determined ``gasLimit``
//      *          will need to be made.
//      */
//     abstract estimateGas(tx: TransactionRequest): Promise<bigint>;
//
//     /**
//      *  Evaluates the //tx// by running it against the current Blockchain state. This
//      *  cannot change state and has no cost in ether, as it is effectively simulating
//      *  execution.
//      *
//      *  This can be used to have the Blockchain perform computations based on its state
//      *  (e.g. running a Contract's getters) or to simulate the effect of a transaction
//      *  before actually performing an operation.
//      */
//     abstract call(tx: TransactionRequest): Promise<string>;
//
//     /**
//      *  Resolves an ENS Name to an address.
//      */
//     abstract resolveName(name: string): Promise<null | string>;
//
//     /// /////////////////
//     // Signing
//
//     /**
//      *  Signs %%tx%%, returning the fully signed transaction. This does not
//      *  populate any additional properties within the transaction.
//      */
//     abstract signTransaction(tx: TransactionRequest): Promise<string>;
//
//     /**
//      *  Sends %%tx%% to the Network. The ``signer.populateTransaction(tx)``
//      *  is called first to ensure all necessary properties for the
//      *  transaction to be valid have been popualted first.
//      */
//     abstract sendTransaction(
//         tx: TransactionRequest
//     ): Promise<TransactionResponse>;
//
//     /**
//      *  Signs an [[link-eip-191]] prefixed personal message.
//      *
//      *  If the %%message%% is a string, it is signed as UTF-8 encoded bytes. It is **not**
//      *  interpretted as a [[BytesLike]]; so the string ``"0x1234"`` is signed as six
//      *  characters, **not** two bytes.
//      *
//      *  To sign that example as two bytes, the Uint8Array should be used
//      *  (i.e. ``new Uint8Array([ 0x12, 0x34 ])``).
//      */
//     abstract signMessage(message: string | Uint8Array): Promise<string>;
//
//     /**
//      *  Signs the [[link-eip-712]] typed data.
//      */
//     abstract signTypedData(
//         domain: vechain_sdk_core_ethers.TypedDataDomain,
//         types: Record<string, vechain_sdk_core_ethers.TypedDataField[]>,
//         value: Record<string, unknown>
//     ): Promise<string>;
//
//     /**
//      * ********* END: Standard ethers signer methods adapted for vechain *********
//      */
// }
//
// export { AbstractVechainSigner };

export const test = 1;
