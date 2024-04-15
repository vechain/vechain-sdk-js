import {
    type ProviderInternalWallet,
    type ProviderInternalWalletAccount
} from '../types';
import { assert, buildError, DATA, TRANSACTION } from '@vechain/sdk-errors';
import {
    addressUtils,
    assertIsAddress,
    secp256k1,
    Transaction,
    type TransactionBody,
    TransactionHandler
} from '@vechain/sdk-core';
import {
    DelegationHandler,
    type SignTransactionOptions,
    type ThorClient
} from '../../../../thor-client';
import {
    type AvailableVechainProviders,
    VechainBaseSigner,
    type VechainSigner
} from '../../../../signer';

/**
 * Provider internal Base wallet class.
 *
 * This is the most basic wallet implementation we can have.
 */
class ProviderInternalBaseWallet implements ProviderInternalWallet {
    /**
     * List of accounts in the wallet.
     */
    readonly accounts: ProviderInternalWalletAccount[];

    /**
     * Options for signing a transaction with delegator.
     */
    readonly delegator?: SignTransactionOptions;

    /**
     * Create a new wallet.
     *
     * @param accounts List of accounts in the wallet.
     * @param options Optional options for signing a transaction with delegator.
     */
    constructor(
        accounts: ProviderInternalWalletAccount[],
        options?: {
            delegator?: SignTransactionOptions;
        }
    ) {
        this.accounts = accounts;
        this.delegator = options?.delegator;
    }

    /**
     * Get a signer into the internal wallet provider
     * for the given address.
     *
     * @param parentProvider - The parent provider of the Internal Wallet.
     * @param address - Address of the account.
     * @returns The signer for the given address.
     */
    async getSigner<TProviderType extends AvailableVechainProviders>(
        parentProvider: TProviderType,
        address: string
    ): Promise<VechainSigner<TProviderType> | null> {
        // Get the account from the wallet
        const signerAccount = await this.getAccount(address);

        // Return a new signer (if exists)
        if (signerAccount?.privateKey !== undefined) {
            return await Promise.resolve(
                new VechainBaseSigner(
                    signerAccount.privateKey,
                    parentProvider,
                    DelegationHandler(this.delegator).delegatorOrNull()
                )
            );
        }
        return null;
    }

    /**
     * Get the list of addresses in the wallet.
     *
     * @returns The list of addresses in the wallet.
     */
    async getAddresses(): Promise<string[]> {
        return await Promise.resolve(
            this.accounts.map((account) => account.address)
        );
    }

    /**
     * Get an account by address.
     *
     * @param address - Address of the account.
     * @returns The account with the given address, or null if not found.
     */
    async getAccount(
        address: string
    ): Promise<ProviderInternalWalletAccount | null> {
        // Check if the address is valid
        assert(
            'getAccount',
            addressUtils.isAddress(address),
            DATA.INVALID_DATA_TYPE,
            'Invalid params expected an address.',
            { address }
        );

        // Get the account by address
        const account = this.accounts.find(
            (account) =>
                addressUtils.toChecksummed(account.address) ===
                addressUtils.toChecksummed(address)
        );
        return await Promise.resolve(account ?? null);
    }

    /**
     * Get the options for signing a transaction with delegator (if any).
     *
     * @returns The options for signing a transaction with delegator.
     */
    async getDelegator(): Promise<SignTransactionOptions | null> {
        return await Promise.resolve(
            DelegationHandler(this.delegator).delegatorOrNull()
        );
    }

    /**
     * Sign a transaction using the account in the wallet.
     * The private key of the sender (from) account is used to sign the transaction.
     *
     * @param transactionOrigin - The origin address of the transaction (the 'from' field).
     * @param transactionToSign - The transaction to sign.
     * @returns The signed transaction.
     */
    async signTransaction(
        transactionOrigin: string,
        transactionToSign: TransactionBody
    ): Promise<Transaction> {
        // 1 - Check if origin is a valid address
        assertIsAddress('signTransaction', transactionOrigin);

        // 2 - Get the account from the wallet
        const accountUsedToSign = await this.getAccount(transactionOrigin);
        if (accountUsedToSign === null)
            throw buildError(
                'signTransaction',
                TRANSACTION.MISSING_PRIVATE_KEY,
                `Missing private key for the account ${transactionOrigin} into the wallet.\n` +
                    `Available accounts into the wallet: \n${this.accounts.join('\n\t')}`,
                { address: transactionOrigin }
            );

        // 3 - Sign the transaction
        return TransactionHandler.sign(
            transactionToSign,
            accountUsedToSign.privateKey as Buffer
        );
    }

    /**
     * Sign a transaction with the delegator.
     * The signature of the delegator into the wallet will be used to sign the transaction.
     *
     * @param transactionOrigin - The origin address of the transaction (the 'from' field).
     * @param transactionToSign - The transaction to sign.
     * @param thorClient - The ThorClient instance used to sign using the url
     * @returns The transaction signed by the delegator.
     *
     */
    async signTransactionWithDelegator(
        transactionOrigin: string,
        transactionToSign: TransactionBody,
        thorClient: ThorClient
    ): Promise<Transaction> {
        // 1 - Check if the wallet has a delegator
        assert(
            'signTransactionWithDelegator',
            DelegationHandler(this.delegator).isDelegated(),
            TRANSACTION.MISSING_PRIVATE_KEY,
            'Missing delegator in the wallet.'
        );

        // 2 - Check if origin is a valid address
        assertIsAddress('signTransaction', transactionOrigin);

        // 3 - Get the account from the wallet
        const accountUsedToSign = await this.getAccount(transactionOrigin);
        if (accountUsedToSign === null)
            throw buildError(
                'signTransaction',
                TRANSACTION.MISSING_PRIVATE_KEY,
                `Missing private key for the account ${transactionOrigin} into the wallet.\n` +
                    `Available accounts into the wallet: \n${this.accounts.join('\n\t')}`,
                { address: transactionOrigin }
            );

        // 4 - Sign the transaction with the delegator private key
        if (this.delegator?.delegatorPrivateKey !== undefined) {
            return TransactionHandler.signWithDelegator(
                transactionToSign,
                accountUsedToSign.privateKey as Buffer,
                Buffer.from(this.delegator.delegatorPrivateKey, 'hex')
            );
        }

        // 5 - Sign the transaction with the delegator url
        const delegatorSignatureWithUrl = await DelegationHandler(
            this.delegator
        ).getDelegationSignatureUsingUrl(
            new Transaction(transactionToSign),
            transactionOrigin,
            thorClient.httpClient
        );

        // Sign transaction with origin private key
        const originSignature = secp256k1.sign(
            new Transaction(transactionToSign).getSignatureHash(),
            accountUsedToSign?.privateKey as Buffer
        );

        // Sign the transaction with both signatures. Concat both signatures to get the final signature
        const signature = Buffer.concat([
            originSignature,
            delegatorSignatureWithUrl
        ]);

        // Return new signed transaction
        return new Transaction(transactionToSign, signature);
    }
}

export { ProviderInternalBaseWallet };
