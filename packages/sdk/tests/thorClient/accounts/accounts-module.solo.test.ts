import { describe, expect, test } from '@jest/globals';
import { ThorClient } from '@thor/thor-client/ThorClient';
import { ThorNetworks } from '@thor';
import { FetchHttpClient } from '@http';
import { Address, Revision } from '@vcdm';

describe('AccountsModule', () => {
    describe('getAccount', () => {
        test('should be able to get account details with default revision', async () => {
            const thorClient = ThorClient.at(
                FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
            );
            // 1st account from solo
            const account = await thorClient.accounts.getAccount(
                Address.of('0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa')
            );
            expect(account).toBeDefined();
            expect(account.balance).toBeDefined();
            expect(account.energy).toBeDefined();
            expect(account.balance).toBeGreaterThan(0n);
            expect(account.energy).toBeGreaterThan(0n);
        });

        test('should be able to get account details with BEST revision', async () => {
            const thorClient = ThorClient.at(
                FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
            );
            // 1st account from solo
            const account = await thorClient.accounts.getAccount(
                Address.of('0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa'),
                Revision.BEST
            );
            expect(account).toBeDefined();
            expect(account.balance).toBeDefined();
            expect(account.energy).toBeDefined();
            expect(account.balance).toBeGreaterThan(0n);
            expect(account.energy).toBeGreaterThan(0n);
        });
        test('check hasCode for VTHO token contract', async () => {
            const thorClient = ThorClient.at(
                FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
            );
            // VTHO token contract
            const account = await thorClient.accounts.getAccount(
                Address.of('0x0000000000000000000000000000456E65726779')
            );
            expect(account.hasCode).toBe(true);
        });
    });
    describe('getBytecode', () => {
        test('should be able to get bytecode with default revision', async () => {
            const thorClient = ThorClient.at(
                FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
            );
            const bytecode = await thorClient.accounts.getBytecode(
                Address.of('0x0000000000000000000000000000456E65726779')
            );
            expect(bytecode).toBeDefined();
            expect(bytecode.toString().length).toBeGreaterThan(0);
        });
    });
    describe('getStorageAt', () => {
        test('should be able to get storage at with default revision', async () => {
            const thorClient = ThorClient.at(
                FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
            );
            const storage = await thorClient.accounts.getStorageAt(
                Address.of('0x0000000000000000000000000000456E65726779'),
                Hex.of('0x00')
            );
        });
});
