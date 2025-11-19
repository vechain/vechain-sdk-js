"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const contract_proxy_1 = require("./contract-proxy");
/**
 * A class representing a smart contract deployed on the blockchain.
 */
class Contract {
    contractsModule;
    address;
    abi;
    signer;
    deployTransactionReceipt;
    read = {};
    transact = {};
    filters = {};
    clause = {};
    criteria = {};
    contractCallOptions = {};
    contractTransactionOptions = {};
    /**
     * Initializes a new instance of the `Contract` class.
     * @param address The address of the contract.
     * @param abi The Application Binary Interface (ABI) of the contract, which defines the contract's methods and events.
     * @param thor An instance of ThorClient to interact with the blockchain.
     * @param signer The signer caller used for signing transactions.
     * @param transactionReceipt (Optional) The transaction receipt of the contract deployment.
     */
    constructor(address, abi, contractsModule, signer, transactionReceipt) {
        this.abi = abi;
        this.address = address;
        this.contractsModule = contractsModule;
        this.deployTransactionReceipt = transactionReceipt;
        this.signer = signer;
        this.read = (0, contract_proxy_1.getReadProxy)(this);
        this.transact = (0, contract_proxy_1.getTransactProxy)(this);
        this.filters = (0, contract_proxy_1.getFilterProxy)(this);
        this.clause = (0, contract_proxy_1.getClauseProxy)(this);
        this.criteria = (0, contract_proxy_1.getCriteriaProxy)(this);
    }
    /**
     * Sets the options for contract calls.
     * @param options - The contract call options to set.
     * @returns The updated contract call options.
     */
    setContractReadOptions(options) {
        this.contractCallOptions = options;
        return this.contractCallOptions;
    }
    /**
     * Clears the current contract call options, resetting them to an empty object.
     * @returns The updated contract call options.
     */
    getContractReadOptions() {
        return this.contractCallOptions;
    }
    /**
     * Clears the current contract call options, resetting them to an empty object.
     */
    clearContractReadOptions() {
        this.contractCallOptions = {};
    }
    /**
     * Sets the options for contract transactions.
     * @param options - The contract transaction options to set.
     * @returns The updated contract transaction options.
     */
    setContractTransactOptions(options) {
        this.contractTransactionOptions = options;
        return this.contractTransactionOptions;
    }
    /**
     * Retrieves the options for contract transactions.
     * @returns The contract transaction options.
     */
    getContractTransactOptions() {
        return this.contractTransactionOptions;
    }
    /**
     * Clears the current contract transaction options, resetting them to an empty object.
     */
    clearContractTransactOptions() {
        this.contractTransactionOptions = {};
    }
    /**
     * Sets the private key of the caller for signing transactions.
     * @param signer - The caller signer
     */
    setSigner(signer) {
        this.signer = signer;
        return this.signer;
    }
    /**
     * Get the caller signer used for signing transactions.
     * @returns The signer used for signing transactions.
     */
    getSigner() {
        return this.signer;
    }
    /**
     * Retrieves the function ABI for the specified function name.
     * @param prop - The name of the function.
     * @return The function ABI for the specified event name.
     * @throws {InvalidAbiItem}
     *
     */
    getFunctionAbi(prop) {
        return sdk_core_1.ABIContract.ofAbi(this.abi).getFunction(prop.toString());
    }
    /**
     * Retrieves the event ABI for the specified event name.
     * @param eventName - The name of the event.
     * @return The event ABI for the specified event name.
     * @throws {InvalidAbiItem}
     */
    getEventAbi(eventName) {
        return sdk_core_1.ABIContract.ofAbi(this.abi).getEvent(eventName.toString());
    }
}
exports.Contract = Contract;
