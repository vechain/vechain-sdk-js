"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.vnsUtils = void 0;
const sdk_core_1 = require("@vechain/sdk-core");
const addresses_1 = require("./addresses");
/**
 * Returns a single address or null for a name resolved at vet.domains
 *
 * @param thorClient - The thor client instance to use.
 * @param name - The name to resolve
 * @returns The address or null
 */
const resolveName = async (thorClient, name) => {
    const [address] = await vnsUtils.resolveNames(thorClient.blocks, thorClient.transactions, [name]);
    return address ?? null;
};
/**
 * Returns a list of addresses or null for names resolved by vet.domains
 *
 * @param thorClient - The thor client instance to use.
 * @param names - The names to resolve
 * @returns The list of the same size of names with the resolved address or null
 */
const resolveNames = async (blocksModule, transactionsModule, names) => {
    // identify current chain
    const genesisBlock = await blocksModule.getGenesisBlock();
    // verify configuration for chain exists
    if (genesisBlock === null ||
        !sdk_core_1.Address.isValid(addresses_1.NetworkContracts[genesisBlock.id]?.resolveUtils)) {
        return names.map(() => null);
    }
    const resolveUtilsAddress = addresses_1.NetworkContracts[genesisBlock.id].resolveUtils;
    // use the resolveUtils to lookup names
    const callGetAddresses = await transactionsModule.executeCall(resolveUtilsAddress, sdk_core_1.ABIItem.ofSignature(sdk_core_1.ABIFunction, 'function getAddresses(string[] names) returns (address[] addresses)'), [names]);
    const [addresses] = callGetAddresses.result.array;
    return addresses.map((address) => {
        // zero addresses are missing configuration entries
        if (address === sdk_core_1.ZERO_ADDRESS || !sdk_core_1.Address.isValid(address)) {
            return null;
        }
        return address;
    });
};
/**
 * Returns a single primary name for a given address resolved at vet.domains
 *
 * @param thorClient - The thor client instance to use.
 * @param address - The address to lookup
 * @returns The name or null
 */
const lookupAddress = async (thorClient, address) => {
    const [name] = await vnsUtils.lookupAddresses(thorClient, [address]);
    return name ?? null;
};
/**
 * Returns a list of names or null for addresses primary names resolved by vet.domains. Reverse lookup of name to address is verified.
 *
 * @param thorClient - The thor client instance to use.
 * @param addresses - The addresses to lookup
 * @returns The list of the same size of addresses with the resolved primary names or null
 */
const lookupAddresses = async (thorClient, addresses) => {
    // identify current chain
    const genesisBlock = await thorClient.blocks.getGenesisBlock();
    // verify configuration for chain exists
    if (genesisBlock === null ||
        !sdk_core_1.Address.isValid(addresses_1.NetworkContracts[genesisBlock.id]?.resolveUtils)) {
        return addresses.map(() => null);
    }
    const resolveUtilsAddress = addresses_1.NetworkContracts[genesisBlock.id].resolveUtils;
    // use the resolveUtils to lookup names
    const callGetNames = await thorClient.contracts.executeCall(resolveUtilsAddress, sdk_core_1.ABIItem.ofSignature(sdk_core_1.ABIFunction, 'function getNames(address[] addresses) returns (string[] names)'), [addresses]);
    const [names] = callGetNames.result.array;
    return names.map((name) => {
        // empty strings indicate a missing entry
        if (name === '') {
            return null;
        }
        return name;
    });
};
const vnsUtils = { resolveName, resolveNames, lookupAddress, lookupAddresses };
exports.vnsUtils = vnsUtils;
