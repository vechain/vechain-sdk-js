import { NetworkContracts } from './addresses';
import { type ThorClient } from '../../thor-client';
import {
    Address,
    type FunctionFragment,
    ZERO_ADDRESS
} from '@vechain/sdk-core';

/**
 * Returns a single address or null for a name resolved at vet.domains
 *
 * @param thorClient - The thor client instance to use.
 * @param name - The name to resolve
 * @returns The address or null
 */
const resolveName = async (
    thorClient: ThorClient,
    name: string
): Promise<null | string> => {
    const [address] = await vnsUtils.resolveNames(thorClient, [name]);
    return address ?? null;
};

/**
 * Returns a list of addresses or null for names resolved by vet.domains
 *
 * @param thorClient - The thor client instance to use.
 * @param names - The names to resolve
 * @returns The list of the same size of names with the resolved address or null
 */
const resolveNames = async (
    thorClient: ThorClient,
    names: string[]
): Promise<Array<null | string>> => {
    // identify current chain
    const genesisBlock = await thorClient.blocks.getGenesisBlock();

    // verify configuration for chain exists
    if (
        genesisBlock === null ||
        !Address.isValid(NetworkContracts[genesisBlock.id]?.resolveUtils)
    ) {
        return names.map(() => null);
    }

    const resolveUtilsAddress = NetworkContracts[genesisBlock.id].resolveUtils;

    // use the resolveUtils to lookup names
    const [addresses] = (await thorClient.contracts.executeCall(
        resolveUtilsAddress,
        'function getAddresses(string[] names) returns (address[] addresses)' as unknown as FunctionFragment,
        [names]
    )) as string[][];

    return addresses.map((address) => {
        // zero addresses are missing configuration entries
        if (address === ZERO_ADDRESS || !Address.isValid(address)) {
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
const lookupAddress = async (
    thorClient: ThorClient,
    address: string
): Promise<null | string> => {
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
const lookupAddresses = async (
    thorClient: ThorClient,
    addresses: string[]
): Promise<Array<null | string>> => {
    // identify current chain
    const genesisBlock = await thorClient.blocks.getGenesisBlock();

    // verify configuration for chain exists
    if (
        genesisBlock === null ||
        !Address.isValid(NetworkContracts[genesisBlock.id]?.resolveUtils)
    ) {
        return addresses.map(() => null);
    }

    const resolveUtilsAddress = NetworkContracts[genesisBlock.id].resolveUtils;

    // use the resolveUtils to lookup names
    const [names] = (await thorClient.contracts.executeCall(
        resolveUtilsAddress,
        'function getNames(address[] addresses) returns (string[] names)' as unknown as FunctionFragment,
        [addresses]
    )) as string[][];

    return names.map((name) => {
        // empty strings indicate a missing entry
        if (name === '') {
            return null;
        }

        return name;
    });
};

const vnsUtils = { resolveName, resolveNames, lookupAddress, lookupAddresses };
export { vnsUtils };
