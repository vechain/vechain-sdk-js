import { NetworkContracts } from './addresses';
import { type ThorClient } from '../../thor-client';
import {
    addressUtils,
    ZERO_ADDRESS,
    type FunctionFragment
} from '../../../../core';

const resolveNames = async (
    thor: ThorClient,
    names: string[]
): Promise<Array<null | string>> => {
    // identify current chain
    const genesisBlock = await thor.blocks.getGenesisBlock();

    // verify configuration for chain exists
    if (
        genesisBlock === null ||
        !addressUtils.isAddress(NetworkContracts[genesisBlock.id]?.resolveUtils)
    ) {
        return names.map(() => null);
    }

    const resolveUtilsAddress = NetworkContracts[genesisBlock.id].resolveUtils;

    // use the resolveUtils to lookup names
    const [addresses] = (await thor.contracts.executeCall(
        resolveUtilsAddress,
        'function getAddresses(string[] names) returns (address[] addresses)' as unknown as FunctionFragment,
        [names]
    )) as string[][];

    return addresses.map((address) => {
        // zero addresses are missing configuration entries
        if (address !== ZERO_ADDRESS && addressUtils.isAddress(address)) {
            return address;
        }

        return null;
    });
};

export const vnsUtils = { resolveNames };
