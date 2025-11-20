import { Address, Hex, Revision } from '@common/vcdm';
import { describe, expect, test } from '@jest/globals';
import { PrivateKeySigner } from '@thor/signer';
import { Clause, ThorClient } from '@thor/thor-client';
import { ThorNetworks, ZERO_ADDRESS } from '@thor/utils';
import { getConfigData } from '@vechain/sdk-solo-setup';

const soloConfig = getConfigData();
const thorClient = ThorClient.at(ThorNetworks.SOLONET);

/**
 * @group solo
 */
describe('ExecuteClauses SOLO tests', () => {
    test('should execute a clause, with no transaction options', async () => {
        const clauses = [
            new Clause(Address.of(ZERO_ADDRESS), 1n, null, null, null)
        ];
        const senderPrivateKey = Hex.of(
            soloConfig.DEFAULT_SOLO_ACCOUNT_PRIVATE_KEYS[0]
        );
        const senderSigner = new PrivateKeySigner(senderPrivateKey.bytes);
        const txId = await thorClient.transactions.executeClauses(
            clauses,
            senderSigner,
            { revision: Revision.BEST }
        );
        expect(txId).toBeDefined();
        const receipt =
            await thorClient.transactions.waitForTransactionReceipt(txId);
        expect(receipt).toBeDefined();
        expect(receipt?.reverted).toBe(false);
    });
    test('should execute a clause, with transaction options', async () => {
        const clauses = [
            new Clause(Address.of(ZERO_ADDRESS), 1n, null, null, null)
        ];
        const senderPrivateKey = Hex.of(
            soloConfig.DEFAULT_SOLO_ACCOUNT_PRIVATE_KEYS[0]
        );
        const senderSigner = new PrivateKeySigner(senderPrivateKey.bytes);
        const txId = await thorClient.transactions.executeClauses(
            clauses,
            senderSigner,
            { revision: Revision.BEST },
            { gasPriceCoef: 100 }
        );
        expect(txId).toBeDefined();
        const receipt =
            await thorClient.transactions.waitForTransactionReceipt(txId);
        expect(receipt).toBeDefined();
        expect(receipt?.reverted).toBe(false);
    });
});
