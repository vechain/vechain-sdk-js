import { Address } from '@common/vcdm';
import { ThorClient } from '@thor/thor-client';
import {
    MAINNET_CHAIN_TAG,
    TESTNET_CHAIN_TAG,
    ZERO_ADDRESS
} from '@thor/utils/const';
import { parseAbiItem } from 'viem';

/**
 * Class for resolving VNS names
 */
class VNSResolver {
    /**
     * The VNS contracts for the different networks
     */
    private static readonly VNS_CONTRACTS: Record<
        string,
        { registry: string; resolveUtils: string }
    > = {
        [MAINNET_CHAIN_TAG]: {
            registry: '0xa9231da8BF8D10e2df3f6E03Dd5449caD600129b',
            resolveUtils: '0xA11413086e163e41901bb81fdc5617c975Fa5a1A'
        },

        [TESTNET_CHAIN_TAG]: {
            registry: '0xcBFB30c1F267914816668d53AcBA7bA7c9806D13',
            resolveUtils: '0xc403b8EA53F707d7d4de095f0A20bC491Cf2bc94'
        }
    };

    /**
     * The function signature for the getAddresses function
     */
    private static readonly GET_ADDRESSES_FN =
        'function getAddresses(string[] names) returns (address[] addresses)';

    /**
     * The function signature for the getNames function
     */
    private static readonly GET_NAMES_FN =
        'function getNames(address[] addresses) returns (string[] names)';

    /**
     * Returns a single address or null for a name resolved at vet.domains
     *
     * @param thorClient - The thor client instance to use.
     * @param name - The name to resolve
     * @returns The address or null
     */
    public static async resolveName(
        thorClient: ThorClient,
        name: string
    ): Promise<null | Address> {
        const [address] = await VNSResolver.resolveNames(thorClient, [name]);
        return address;
    }

    /**
     * Returns a list of addresses or null for names resolved by vet.domains
     *
     * @param thorClient - The thor client instance to use.
     * @param names - The names to resolve
     * @returns The list of the same size of names with the resolved address or null
     */
    public static async resolveNames(
        thorClient: ThorClient,
        names: string[]
    ): Promise<Array<null | Address>> {
        // identify current chain
        const chainTag = await thorClient.nodes.getChainTag();

        // verify configuration for chain exists
        if (
            chainTag === null ||
            !Address.isValid(VNSResolver.VNS_CONTRACTS[chainTag]?.resolveUtils)
        ) {
            return names.map(() => null);
        }

        // get the resolveUtils address for the current chain
        const resolveUtilsAddress =
            VNSResolver.VNS_CONTRACTS[chainTag].resolveUtils;

        // parse the getAddresses function
        const getAddressesFn = parseAbiItem(VNSResolver.GET_ADDRESSES_FN);

        // use the resolveUtils to lookup names
        const callGetAddresses = await thorClient.contracts.executeCall(
            resolveUtilsAddress,
            getAddressesFn,
            [names]
        );
        const addresses = callGetAddresses.result.array as string[];

        // map zero and invalid addresses to null
        return addresses.map((address) => {
            // zero addresses are missing configuration entries
            if (address === ZERO_ADDRESS || !Address.isValid(address)) {
                return null;
            }
            return Address.of(address);
        });
    }

    /**
     * Returns a single primary name for a given address resolved at vet.domains
     *
     * @param thorClient - The thor client instance to use.
     * @param address - The address to lookup
     * @returns The name or null
     */
    public static async lookupAddress(
        thorClient: ThorClient,
        address: Address
    ): Promise<null | string> {
        const [name] = await VNSResolver.lookupAddresses(thorClient, [address]);
        return name ?? null;
    }

    /**
     * Returns a list of names or null for addresses primary names resolved by vet.domains.
     * Reverse lookup of name to address is verified.
     *
     * @param thorClient - The thor client instance to use.
     * @param addresses - The addresses to lookup
     * @returns The list of the same size of addresses with the resolved primary names or null
     */
    public static async lookupAddresses(
        thorClient: ThorClient,
        addresses: Address[]
    ): Promise<Array<null | string>> {
        // identify current chain
        const chainTag = await thorClient.nodes.getChainTag();

        // verify configuration for chain exists
        if (
            chainTag === null ||
            !Address.isValid(VNSResolver.VNS_CONTRACTS[chainTag]?.resolveUtils)
        ) {
            return addresses.map(() => null);
        }

        const resolveUtilsAddress =
            VNSResolver.VNS_CONTRACTS[chainTag].resolveUtils;

        // parse the getNames function
        const getNamesFn = parseAbiItem(VNSResolver.GET_NAMES_FN);

        // use the resolveUtils to lookup names
        const callGetNames = await thorClient.contracts.executeCall(
            resolveUtilsAddress,
            getNamesFn,
            [addresses]
        );
        const names = callGetNames.result.array as string[];

        return names.map((name) => {
            // empty strings indicate a missing entry
            if (name === '') {
                return null;
            }
            return name.toLowerCase();
        });
    }
}

export { VNSResolver };
