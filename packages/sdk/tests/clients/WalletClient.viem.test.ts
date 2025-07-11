import { describe } from '@jest/globals';
import { privateKeyToAccount } from 'viem/accounts';
import { TEST_ACCOUNTS } from '../fixture';
import { createWalletClient, http } from 'viem';
import { mainnet } from 'viem/chains';

const { TRANSACTION_SENDER, TRANSACTION_RECEIVER } = TEST_ACCOUNTS.TRANSACTION;

describe('viem', () => {
    test('a', async () => {
        const account = privateKeyToAccount(
            `0x${TRANSACTION_SENDER.privateKey}`
        );
        const walletClient = createWalletClient({
            account: account,
            chain: mainnet,
            transport: http()
        });
        const request = await walletClient.prepareTransactionRequest({
            to: '0x70997970c51812dc3a010c7d01b50e0d17dc79c8',
            value: 1000000000000000000n
        });
        const tx = await walletClient.signTransaction(request);
        console.log(tx);
    });
});
