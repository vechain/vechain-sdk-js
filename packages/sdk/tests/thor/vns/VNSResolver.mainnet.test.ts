import { Address } from '@common/vcdm';
import { describe, expect, test } from '@jest/globals';
import { ThorClient } from '@thor/thor-client';
import { ThorNetworks } from '@thor/utils';
import { VNSResolver } from '@thor/vns';

/**
 * @group mainnet
 */
describe('VNSResolver mainnet tests', () => {
    describe('resolve domain name', () => {
        test('ok <- will resolve a single name', async () => {
            const thorClient = ThorClient.at(ThorNetworks.MAINNET);
            const address = await VNSResolver.resolveName(
                thorClient,
                'treasury.greencartdapp.vet'
            );
            expect(address).not.toBeNull();
            expect(address?.toString().toLowerCase()).toBe(
                '0xD92232681ed830D541439170F630ca8ae9948A5d'.toLowerCase()
            );
        });
        test('ok <- will resolve a list of names', async () => {
            const thorClient = ThorClient.at(ThorNetworks.MAINNET);
            const addresses = await VNSResolver.resolveNames(thorClient, [
                'treasury.greencartdapp.vet',
                'greencartdapp.vet'
            ]);
            expect(addresses?.length).toBe(2);
            expect(addresses?.[0]?.toString().toLowerCase()).toBe(
                '0xD92232681ed830D541439170F630ca8ae9948A5d'.toLowerCase()
            );
            expect(addresses?.[1]?.toString().toLowerCase()).toBe(
                '0x20733c43F564971b16F25d161D68575047469562'.toLowerCase()
            );
        });
        test('error <- will return null for name that does not exist', async () => {
            const thorClient = ThorClient.at(ThorNetworks.MAINNET);
            const address = await VNSResolver.resolveName(
                thorClient,
                'somemadeupnamethatdoesnotexist.vet'
            );
            expect(address).toBeNull();
        });
        test('error <- will return null for name that is not a valid domain name', async () => {
            const thorClient = ThorClient.at(ThorNetworks.MAINNET);
            const address = await VNSResolver.resolveName(
                thorClient,
                'notvalid'
            );
            expect(address).toBeNull();
        });
    });
    describe('lookup address', () => {
        test('ok <- will lookup a single address', async () => {
            const thorClient = ThorClient.at(ThorNetworks.MAINNET);
            const name = await VNSResolver.lookupAddress(
                thorClient,
                Address.of('0xD92232681ed830D541439170F630ca8ae9948A5d')
            );
            expect(name).not.toBeNull();
            expect(name?.toLowerCase()).toBe('treasury.greencartdapp.vet');
        });
        test('ok <- will lookup a list of addresses', async () => {
            const thorClient = ThorClient.at(ThorNetworks.MAINNET);
            const names = await VNSResolver.lookupAddresses(thorClient, [
                Address.of('0xD92232681ed830D541439170F630ca8ae9948A5d'),
                Address.of('0x20733c43F564971b16F25d161D68575047469562')
            ]);
            expect(names).not.toBeNull();
            expect(names?.[0]?.toLowerCase()).toBe(
                'treasury.greencartdapp.vet'
            );
            expect(names?.[1]?.toLowerCase()).toBe('greencartdapp.vet');
        });
        test('error <- will return null for address that does not have a domain name', async () => {
            const thorClient = ThorClient.at(ThorNetworks.MAINNET);
            const name = await VNSResolver.lookupAddress(
                thorClient,
                Address.of('0x0000000000000000000000000000000000000000')
            );
            expect(name).toBeNull();
        });
    });
});
