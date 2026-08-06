import { afterEach, beforeEach, describe, expect, test } from '@jest/globals';
import { ABIFunction, ABIItem, ZERO_ADDRESS } from '@vechain/sdk-core';
import { JSONRPCMethodNotFound } from '@vechain/sdk-errors';
import { mainNetwork } from '../../../fixture';
import { providerMethodsTestCasesMainnet } from '../fixture';
import { ThorClient, VeChainProvider } from '../../../../src';

/**
 * VNS resolve-utils contract on mainnet (vet.domains).
 */
const VNS_RESOLVE_UTILS_MAINNET = '0xA11413086e163e41901bb81fdc5617c975Fa5a1A';

/**
 * Domain used for VNS assertions.
 *
 * NOTE: do not hardcode third-party domains and their addresses here: domains
 * expire and re-point, breaking CI on network state instead of code (this
 * happened with 'clayton.vet'). The tests below compare the provider output
 * against the on-chain registry itself, so they stay green regardless of the
 * domain lifecycle. Registering 'test-sdk.vet' on mainnet (already owned by
 * the team on testnet) automatically makes them assert a real resolution.
 */
const VNS_TEST_DOMAIN = 'test-sdk.vet';

/**
 *VeChain provider tests - Mainnet
 *
 * @group integration/providers/vechain-provider-mainnet
 */
describe('VeChain provider tests - mainnet', () => {
    /**
     * ThorClient and provider instances
     */
    let thorClient: ThorClient;
    let provider: VeChainProvider;

    /**
     * Init thor client and provider before each test
     */
    beforeEach(() => {
        thorClient = new ThorClient(mainNetwork);
        provider = new VeChainProvider(thorClient);
    });

    /**
     * Destroy thor client and provider after each test
     */
    afterEach(() => {
        provider.destroy();
    });

    /**
     * Provider methods tests
     */
    providerMethodsTestCasesMainnet.forEach(
        ({ description, method, params, expected }) => {
            test(description, async () => {
                // Call RPC function
                const rpcCall = await provider.request({
                    method,
                    params
                });

                // Compare the result with the expected value
                expect(rpcCall).toStrictEqual(expected);
            });
        }
    );

    /**
     * eth_getBalance RPC call test
     */
    test('Should be able to get the latest block number', async () => {
        // Call RPC function
        const rpcCall = await provider.request({
            method: 'eth_blockNumber',
            params: []
        });

        // Compare the result with the expected value
        expect(rpcCall).not.toBe('0x0');
    });

    /**
     * Invalid RPC method tests
     */
    test('Should throw an error when calling an invalid RPC method', async () => {
        // Check if the provider is defined
        expect(provider).toBeDefined();

        // Call RPC function
        await expect(
            async () =>
                await provider.request({
                    method: 'INVALID_METHOD',
                    params: [-1]
                })
        ).rejects.toThrowError(JSONRPCMethodNotFound);
    });

    describe('resolveName(vnsName)', () => {
        test('Should resolve a name consistently with the on-chain registry', async () => {
            const address = await provider.resolveName(VNS_TEST_DOMAIN);

            // Oracle: ask the VNS resolve-utils contract directly
            const oracleCall = await thorClient.contracts.executeCall(
                VNS_RESOLVE_UTILS_MAINNET,
                ABIItem.ofSignature(
                    ABIFunction,
                    'function getAddresses(string[] names) returns (address[] addresses)'
                ),
                [[VNS_TEST_DOMAIN]]
            );
            const [[oracleAddress]] = oracleCall.result.array as string[][];
            const expected =
                oracleAddress === ZERO_ADDRESS ? null : oracleAddress;

            expect(address).toBe(expected);
        });

        test('Should resolve to null for unknown names', async () => {
            const name = `unknown.${VNS_TEST_DOMAIN}`;
            const address = await provider.resolveName(name);
            expect(address).toBe(null);
        });
    });

    describe('lookupAddress(address)', () => {
        test('Should lookup a name consistently with the on-chain registry', async () => {
            const address = '0x105199a26b10e55300CB71B46c5B5e867b7dF427';
            const name = await provider.lookupAddress(address);

            // Oracle: ask the VNS resolve-utils contract directly
            const oracleCall = await thorClient.contracts.executeCall(
                VNS_RESOLVE_UTILS_MAINNET,
                ABIItem.ofSignature(
                    ABIFunction,
                    'function getNames(address[] addresses) returns (string[] names)'
                ),
                [[address]]
            );
            const [[oracleName]] = oracleCall.result.array as string[][];
            const expected = oracleName === '' ? null : oracleName;

            expect(name).toBe(expected);
        });

        test('Should resolve to null for unknown names', async () => {
            const address = '0x0000000000000000000000000000000000000001';
            const name = await provider.resolveName(address);
            expect(name).toBe(null);
        });
    });
});
