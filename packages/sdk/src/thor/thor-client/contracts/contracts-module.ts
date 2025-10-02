import { type Abi } from 'abitype';
import { type Signer } from '../../../thor/signer';
import { type Address } from '../../../common/vcdm';
import { type HttpClient } from '@common/http';
import { AbstractThorModule } from '../AbstractThorModule';
import { Contract, ContractFactory } from './model';

/**
 * Represents a module for interacting with smart contracts on the blockchain.
 * This is the middle-layer contracts module that works directly with ThorClient.
 *
 * This follows the official VeChain SDK pattern where ContractsModule
 * is a ThorModule that provides contract interaction capabilities.
 */
class ContractsModule extends AbstractThorModule {
    /**
     * Creates a new ContractsModule instance
     * @param httpClient - The HTTP client for blockchain communication
     */
    constructor(httpClient: HttpClient) {
        super(httpClient);
    }

    /**
     * Creates a new instance of `ContractFactory` configured with the specified ABI, bytecode, and signer.
     * This factory is used to deploy new smart contracts to the blockchain network using VeChain's official Clause pattern.
     *
     * @param abi - The Application Binary Interface (ABI) of the contract.
     * @param bytecode - The compiled bytecode of the contract.
     * @param signer - The signer used for signing transactions during contract deployment.
     * @returns An instance of `ContractFactory` configured with the provided parameters.
     *
     * @example
     * ```typescript
     * const thorClient = ThorClient.at('https://mainnet.vechain.org');
     * const factory = thorClient.contracts.createContractFactory(abi, bytecode, signer);
     *
     * // Create deployment clause
     * const deployClause = factory.createDeploymentClause([constructorArg1, constructorArg2]);
     *
     * // Deploy contract (when ThorClient transaction sending is implemented)
     * const contract = await factory.deploy([constructorArg1, constructorArg2]);
     * ```
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
}

export { ContractsModule };
