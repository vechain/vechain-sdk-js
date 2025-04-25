import { Address } from '@vechain/sdk-core';
import {
    JSONRPCInternalError,
    JSONRPCInvalidParams,
    stringifyData
} from '@vechain/sdk-errors';
import type {
    TypedDataDomain,
    TypedDataParameter,
    VeChainSigner
} from '../../../../../signer/signers';
import type { ThorClient } from '../../../../../thor-client';
import type { VeChainProvider } from '../../../../providers/vechain-provider';

/**
 * RPC Method eth_signTypedDataV4 implementation
 *
 * @link [eth_signTypedDataV4](https://docs.metamask.io/wallet/reference/eth_signtypeddata_v4/)
 *
 * @param thorClient - The thor client instance to use.
 * @param params - The standard array of rpc call parameters.
 *               * params[0]: The hex encoded address of the account to sign the typed message.
 *               * params[1] An object or a JSON string containing:
 *                   * types - An array of EIP712Domain object. It is an array specifying one or more (name, version, chainId, verifyingContract) tuples.
 *                   * domain - Contains the domain separator values specified in the EIP712Domain type.
 *                   * primaryType: A string specifying the name of the primary type for the message.
 *                   * message: An object containing the data to sign.
 * @param provider - The provider instance to use.
 * @throws {JSONRPCInvalidParams, JSONRPCInternalError}
 */
const ethSignTypedDataV4 = async (
    thorClient: ThorClient,
    params: unknown[],
    provider?: VeChainProvider
): Promise<string> => {
    // Input validation
    if (
        params.length !== 2 ||
        typeof params[0] !== 'string' ||
        !Address.isValid(params[0]) ||
        (typeof params[1] !== 'object' && typeof params[1] !== 'string')
    )
        throw new JSONRPCInvalidParams(
            'eth_signTypedDataV4',
            `Invalid input params for "eth_signTypedDataV4" method. See https://docs.metamask.io/wallet/reference/eth_signtypeddata_v4/ for details.`,
            { params }
        );

    // Provider must be defined
    if (
        provider?.wallet === undefined ||
        (await provider.getSigner(params[0])) === null
    ) {
        throw new JSONRPCInvalidParams(
            'eth_signTypedDataV4',
            `Provider must be defined with a wallet. Ensure that the provider is defined, connected to the network and has the wallet with the address ${params[0]} into it.`,
            { provider }
        );
    }

    // Input params
    const [address] = params as [string, unknown];
    let typedData: {
        primaryType: string;
        domain: TypedDataDomain;
        types: Record<string, TypedDataParameter[]>;
        message: Record<string, unknown>;
    };

    // Parse typedData if it's a string
    if (typeof params[1] === 'string') {
        try {
            typedData = JSON.parse(params[1]) as {
                primaryType: string;
                domain: TypedDataDomain;
                types: Record<string, TypedDataParameter[]>;
                message: Record<string, unknown>;
            };
        } catch (error) {
            throw new JSONRPCInvalidParams(
                'eth_signTypedData_v4',
                'Invalid JSON string for typed data parameter',
                { params },
                error
            );
        }
    } else {
        typedData = params[1] as typeof typedData;
    }

    try {
        // Get the signer of the provider
        const signer = (await provider.getSigner(address)) as VeChainSigner;

        // Return the result
        return await signer.signTypedData(
            typedData.domain,
            typedData.types,
            typedData.message,
            typedData.primaryType
        );
    } catch (error) {
        throw new JSONRPCInternalError(
            'eth_signTypedDataV4',
            'Method "eth_signTypedDataV4" failed.',
            {
                params: stringifyData(params),
                url: thorClient.httpClient.baseURL
            },
            error
        );
    }
};

export { ethSignTypedDataV4 };
