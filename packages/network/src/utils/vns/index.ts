import { type AvailableVechainProviders, RPC_METHODS } from '../../';

import {
    addressUtils,
    VNS_NETWORK_CONFIGURATION,
    ZERO_ADDRESS,
    type FunctionFragment
} from '../../../../core';

const resolveNames = async (
    provider: AvailableVechainProviders,
    names: string[]
): Promise<Array<null | string>> => {
    // use chainId to identify the contracts to use
    const chainId = (await provider.request({
        method: RPC_METHODS.eth_chainId,
        params: []
    })) as string;

    // verify configuration for chain exists
    if (
        !addressUtils.isAddress(
            VNS_NETWORK_CONFIGURATION[chainId]?.resolveUtils
        )
    ) {
        return names.map(() => null);
    }

    const resolveUtilsAddress = VNS_NETWORK_CONFIGURATION[chainId].resolveUtils;

    // use the resolveUtils to lookup names
    const addresses = (await provider.thorClient.contracts.executeCall(
        resolveUtilsAddress,
        'function getAddresses(string[] names) returns (address[] addresses)' as unknown as FunctionFragment,
        [names]
    )) as string[][];

    return addresses[0].map((address) => {
        // zero addresses are missing configuration entries
        if (address !== ZERO_ADDRESS && addressUtils.isAddress(address)) {
            return address;
        }

        return null;
    });
};

export { resolveNames };
