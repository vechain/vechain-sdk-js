"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractsModule = void 0;
const model_1 = require("./model");
/**
 * Represents a module for interacting with smart contracts on the blockchain.
 */
class ContractsModule {
    transactionsModule;
    constructor(transactionsModule) {
        this.transactionsModule = transactionsModule;
    }
    /**
     * Creates a new instance of `ContractFactory` configured with the specified ABI, bytecode, and signer.
     * This factory is used to deploy new smart contracts to the blockchain network managed by this instance.
     *
     * @param abi - The Application Binary Interface (ABI) of the contract, which defines the contract's methods and events.
     * @param bytecode - The compiled bytecode of the contract, representing the contract's executable code.
     * @param signer - The signer used for signing transactions during contract deployment, ensuring the deployer's identity.
     * @returns An instance of `ContractFactory` configured with the provided ABI, bytecode, and signer, ready for deploying contracts.
     */
    createContractFactory(abi, bytecode, signer) {
        return new model_1.ContractFactory(abi, bytecode, signer, this);
    }
    /**
     * Initializes and returns a new Contract instance with the provided parameters.
     *
     * @param address - The blockchain address of the contract to load.
     * @param abi - The Application Binary Interface (ABI) of the contract, which defines the contract's methods and structures.
     * @param signer - Optional. The signer caller, used for signing transactions when interacting with the contract.
     * @returns A new instance of the Contract, initialized with the provided address, ABI, and optionally, a signer.
     */
    load(address, abi, signer) {
        return new model_1.Contract(address, abi, this, signer);
    }
    /**
     * This method is going to be deprecated in next release.
     * Use {@link TransactionsModule.executeCall} instead.
     */
    async executeCall(contractAddress, functionAbi, functionData, contractCallOptions) {
        return await this.transactionsModule.executeCall(contractAddress, functionAbi, functionData, contractCallOptions);
    }
    /**
     * This method is going to be deprecated in the next release.
     * Use {@link TransactionsModule.executeMultipleClausesCall} next.
     */
    async executeMultipleClausesCall(clauses, options) {
        if (clauses.every((clause) => 'clause' in clause)) {
            return await this.transactionsModule.executeMultipleClausesCall(clauses, options);
        }
        return await this.transactionsModule.executeMultipleClausesCall(clauses, options);
    }
    /**
     * This method is going to be deprecated in the next release.
     * Use {@link TransactionsModule.executeTransaction} instead.
     */
    async executeTransaction(signer, contractAddress, functionAbi, functionData, options) {
        return await this.transactionsModule.executeTransaction(signer, contractAddress, functionAbi, functionData, options);
    }
    /**
     * This method is going to be deprected in the next release.
     * Use {@link TransactionsModule.executeMultipleClausesTransaction} instead.
     */
    async executeMultipleClausesTransaction(clauses, signer, options) {
        return await this.transactionsModule.executeMultipleClausesTransaction(clauses, signer, options);
    }
    /**
     * This method is going to be deprecated in the next release.
     * Use {@link TransactionsModule.getLegacyBaseGasPrice} instead.
     */
    async getLegacyBaseGasPrice() {
        return await this.transactionsModule.getLegacyBaseGasPrice();
    }
}
exports.ContractsModule = ContractsModule;
