import { type SignTransactionOptions } from '@vechain/sdk-network';
import { type vechain_sdk_core_ethers } from '@vechain/sdk-core';
import type {
    HardhatVechainProvider,
    JSONRPCEthersProvider,
    VechainProvider
} from '@vechain/sdk-provider';

/**
 * Available types for the VechainProvider's
 *
 * @NOTE: We use our supported providers instead of ethers providers.
 * If you create a new provider, you need to add it here.
 */
type AvailableVechainProviders =
    | VechainProvider
    | HardhatVechainProvider
    | JSONRPCEthersProvider;

/**
 * A signer for vechain, adding specific methods for vechain to the ethers signer
 *
 * @NOTE: Su support completely our providers (that already support ethers provider format)
 * We use our supported providers instead of ethers providers
 */
interface VechainSigner<TProviderType extends AvailableVechainProviders>
    extends vechain_sdk_core_ethers.Signer {
    /**
     * ********* START: Delegator needed methods *********
     */

    /**
     * The delegator attached to this Signer (if any)
     */
    delegator: null | SignTransactionOptions;

    /**
     * Sign a transaction with the delegator
     * @param transactionToSign - the transaction to sign
     * @returns the fully signed transaction
     */
    signWithDelegator: (
        transactionToSign: vechain_sdk_core_ethers.TransactionRequest
    ) => Promise<string>;

    /**
     * Send a transaction with the delegator
     * @param transactionToSend - the transaction to send
     * @returns the transaction response
     */
    sendWithDelegator: (
        transactionToSend: vechain_sdk_core_ethers.TransactionRequest
    ) => Promise<vechain_sdk_core_ethers.TransactionResponse>;

    /**
     * ********* END: Delegator needed methods *********
     */

    /**
     * ********* START: Standard ethers signer methods adapted for vechain *********
     */

    /**
     * The provider attached to this Signer (if any).
     */
    provider: TProviderType | null;

    /**
     *  Returns a new instance of this Signer connected to //provider// or detached
     *  from any Provider if null.
     */
    connect: (provider: TProviderType | null) => VechainSigner;

    /**
     *  Get the address of the Signer.
     */
    getAddress: () => Promise<string>;

    /**
     *  Gets the next nonce required for this Signer to send a transaction.
     *
     *  @param blockTag - The blocktag to base the transaction count on, keep in mind
     *         many nodes do not honour this value and silently ignore it [default: ``"latest"``]
     *
     *  @NOTE: This method generates a random number as nonce. It is because the nonce in vechain is a 6-byte number.
     */
    getNonce: (blockTag?: vechain_sdk_core_ethers.BlockTag) => Promise<number>;

    /**
     *  Prepares a {@link vechain_sdk_core_ethers.TransactionRequest} for calling:
     *  - resolves ``to`` and ``from`` addresses
     *  - if ``from`` is specified, check that it matches this Signer
     *
     *  @param tx - The call to prepare
     */
    populateCall: (
        tx: vechain_sdk_core_ethers.TransactionRequest
    ) => Promise<vechain_sdk_core_ethers.TransactionLike<string>>;

    /**
     *  Prepares a {@link vechain_sdk_core_ethers.TransactionRequest} for sending to the network by
     *  populating any missing properties:
     *  - resolves ``to`` and ``from`` addresses
     *  - if ``from`` is specified , check that it matches this Signer
     *  - populates ``nonce`` via ``signer.getNonce("pending")``
     *  - populates ``gasLimit`` via ``signer.estimateGas(tx)``
     *  - populates ``chainId`` via ``signer.provider.getNetwork()``
     *  - populates ``type`` and relevant fee data for that type (``gasPrice``
     *    for legacy transactions, ``maxFeePerGas`` for EIP-1559, etc)
     *
     *  @note Some Signer implementations may skip populating properties that
     *        are populated downstream; for example JsonRpcSigner defers to the
     *        node to populate the nonce and fee data.
     *
     *  @param tx - The call to prepare
     */
    populateTransaction: (
        tx: vechain_sdk_core_ethers.TransactionRequest
    ) => Promise<vechain_sdk_core_ethers.TransactionLike<string>>;

    /**
     *  Estimates the required gas required to execute //tx// on the Blockchain. This
     *  will be the expected amount a transaction will require as its ``gasLimit``
     *  to successfully run all the necessary computations and store the needed state
     *  that the transaction intends.
     *
     *  Keep in mind that this is **best efforts**, since the state of the Blockchain
     *  is in flux, which could affect transaction gas requirements.
     *
     *  @throws UNPREDICTABLE_GAS_LIMIT A transaction believed by the node to likely
     *          fail will throw an error during gas estimation. This could indicate that it
     *          will actually fail or that the circumstances are simply too complex for the
     *          node to take into account. In these cases, a manually determined ``gasLimit``
     *          will need to be made.
     */
    estimateGas: (
        tx: vechain_sdk_core_ethers.TransactionRequest
    ) => Promise<bigint>;

    /**
     *  Evaluates the //tx// by running it against the current Blockchain state. This
     *  cannot change state and has no cost in ether, as it is effectively simulating
     *  execution.
     *
     *  This can be used to have the Blockchain perform computations based on its state
     *  (e.g. running a Contract's getters) or to simulate the effect of a transaction
     *  before actually performing an operation.
     */
    call: (tx: vechain_sdk_core_ethers.TransactionRequest) => Promise<string>;

    /**
     *  Resolves an ENS Name to an address.
     */
    resolveName: (name: string) => Promise<null | string>;

    /// /////////////////
    // Signing

    /**
     *  Signs %%tx%%, returning the fully signed transaction. This does not
     *  populate any additional properties within the transaction.
     */
    signTransaction: (
        tx: vechain_sdk_core_ethers.TransactionRequest
    ) => Promise<string>;

    /**
     *  Sends %%tx%% to the Network. The ``signer.populateTransaction(tx)``
     *  is called first to ensure all necessary properties for the
     *  transaction to be valid have been popualted first.
     */
    sendTransaction: (
        tx: vechain_sdk_core_ethers.TransactionRequest
    ) => Promise<vechain_sdk_core_ethers.TransactionResponse>;

    /**
     *  Signs an [[link-eip-191]] prefixed a personal message.
     *
     *  If the %%message%% is a string, it is signed as UTF-8 encoded bytes. It is **not**
     *  interpreted as a [[BytesLike]]; so the string ``"0x1234"`` is signed as six
     *  characters, **not** two bytes.
     *
     *  To sign that example as two bytes, the Uint8Array should be used
     *  (i.e. ``new Uint8Array([ 0x12, 0x34 ])``).
     */
    signMessage: (message: string | Uint8Array) => Promise<string>;

    /**
     *  Signs the [[link-eip-712]] typed data.
     */
    signTypedData: (
        domain: vechain_sdk_core_ethers.TypedDataDomain,
        types: Record<string, vechain_sdk_core_ethers.TypedDataField[]>,
        value: Record<string, unknown>
    ) => Promise<string>;

    /**
     * ********* END: Standard ethers signer methods adapted for vechain *********
     */
}

export { type VechainSigner, type AvailableVechainProviders };
