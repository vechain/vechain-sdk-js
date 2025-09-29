import { type Abi } from 'abitype';
import { type Signer } from '@thor/signer';
import { type Address } from '@common/vcdm';
import { type PublicClient, type WalletClient } from '@viem/clients';
import { Contract, ContractFactory } from './model';

/**
 * Represents a module for interacting with smart contracts on the blockchain.
 * This is the middle-layer contracts module that delegates to viem clients.
 */
class ContractsModule {
    private publicClient?: PublicClient;
    private walletClient?: WalletClient;

    /**
     * Creates a new ContractsModule instance
     * @param publicClient - Optional PublicClient for read operations
     * @param walletClient - Optional WalletClient for write operations
     */
    constructor(publicClient?: PublicClient, walletClient?: WalletClient) {
        this.publicClient = publicClient;
        this.walletClient = walletClient;
    }

    /**
     * Gets the PublicClient instance
     */
    public getPublicClient(): PublicClient | undefined {
        return this.publicClient;
    }

    /**
     * Gets the WalletClient instance
     */
    public getWalletClient(): WalletClient | undefined {
        return this.walletClient;
    }

    /**
     * Sets the PublicClient instance
     */
    public setPublicClient(publicClient: PublicClient): void {
        this.publicClient = publicClient;
    }

    /**
     * Sets the WalletClient instance
     */
    public setWalletClient(walletClient: WalletClient): void {
        this.walletClient = walletClient;
    }

    /**
     * Creates a new instance of `ContractFactory` configured with the specified ABI, bytecode, and signer.
     * This factory is used to deploy new smart contracts to the blockchain network.
     *
     * @param abi - The Application Binary Interface (ABI) of the contract.
     * @param bytecode - The compiled bytecode of the contract.
     * @param signer - The signer used for signing transactions during contract deployment.
     * @returns An instance of `ContractFactory` configured with the provided parameters.
     */
    public createContractFactory<TAbi extends Abi>(
        abi: TAbi,
        bytecode: string,
        signer: Signer
    ): ContractFactory<TAbi> {
        return new ContractFactory<TAbi>(abi, bytecode, signer, this);
    }

    /**
     * Initializes and returns a new Contract instance with the provided parameters.
     *
     * @param address - The blockchain address of the contract to load.
     * @param abi - The Application Binary Interface (ABI) of the contract.
     * @param signer - Optional. The signer, used for signing transactions when interacting with the contract.
     * @returns A new instance of the Contract, initialized with the provided parameters.
     */
    public load<TAbi extends Abi>(
        address: Address,
        abi: TAbi,
        signer?: Signer
    ): Contract<TAbi> {
        return new Contract<TAbi>(address, abi, this, signer);
    }

    /**
     * Checks if the module has a PublicClient for read operations
     */
    public hasPublicClient(): boolean {
        return this.publicClient !== undefined;
    }

    /**
     * Checks if the module has a WalletClient for write operations
     */
    public hasWalletClient(): boolean {
        return this.walletClient !== undefined;
    }
}

export { ContractsModule };
