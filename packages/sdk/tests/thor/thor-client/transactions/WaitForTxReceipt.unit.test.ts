import { IllegalArgumentError } from '@common/errors';
import { FetchHttpClient } from '@common/http';
import { Hex } from '@common/vcdm';
import { describe, expect, test } from '@jest/globals';
import { ThorClient } from '@thor/thor-client';
import { ThorNetworks } from '@thor/utils/const/network';

/**
 * @group unit
 */
describe('WaitForTxReceipt UNIT tests', () => {
    test('invalid intervalMs option', async () => {
        const thorClient = ThorClient.at(
            FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
        );
        const unknownTxId = Hex.of(
            '0xdeadbeefcafebabef00dbad00badd00dfeedface1337c0ffee000000baadf00d'
        );
        await expect(
            thorClient.transactions.waitForTransactionReceipt(unknownTxId, {
                intervalMs: 0
            })
        ).rejects.toThrow(IllegalArgumentError);
    });
    test('invalid timeoutMs option', async () => {
        const thorClient = ThorClient.at(
            FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
        );
        const unknownTxId = Hex.of(
            '0xdeadbeefcafebabef00dbad00badd00dfeedface1337c0ffee000000baadf00d'
        );
        await expect(
            thorClient.transactions.waitForTransactionReceipt(unknownTxId, {
                timeoutMs: 0
            })
        ).rejects.toThrow(IllegalArgumentError);
    });
    test('timeoutMs < intervalMs option', async () => {
        const thorClient = ThorClient.at(
            FetchHttpClient.at(new URL(ThorNetworks.SOLONET))
        );
        const unknownTxId = Hex.of(
            '0xdeadbeefcafebabef00dbad00badd00dfeedface1337c0ffee000000baadf00d'
        );
        await expect(
            thorClient.transactions.waitForTransactionReceipt(unknownTxId, {
                timeoutMs: 100,
                intervalMs: 200
            })
        ).rejects.toThrow(IllegalArgumentError);
    });
});
