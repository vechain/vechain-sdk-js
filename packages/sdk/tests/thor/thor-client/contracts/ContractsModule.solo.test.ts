import { Address, Hex, Revision } from '@common/vcdm';
import { describe, expect, test, beforeAll } from '@jest/globals';
import { PrivateKeySigner } from '@thor/signer';
import { ABIContract, ThorClient } from '@thor/thor-client';
import { ERC20_ABI, ThorNetworks, VTHO_ADDRESS } from '@thor/utils';
import { getConfigData } from '@vechain/sdk-solo-setup';

/**
 * @group solo
 */
describe('ContractsModule Solo Tests', () => {
    let thorClient: ThorClient;
    let senderAddress: Address;
    let senderSigner: PrivateKeySigner;

    beforeAll(() => {
        thorClient = ThorClient.at(ThorNetworks.SOLONET);
        const soloConfig = getConfigData();
        senderAddress = Address.of(
            soloConfig.DEFAULT_SOLO_ACCOUNT_ADDRESSES[0]
        );
        const senderPrivateKey = Hex.of(
            soloConfig.DEFAULT_SOLO_ACCOUNT_PRIVATE_KEYS[0]
        );
        senderSigner = new PrivateKeySigner(senderPrivateKey.bytes);
    });

    describe('executeTransaction', () => {
        test('ok <- transfer VTHO to self, no options', async () => {
            const erc20Abi = new ABIContract(ERC20_ABI);
            const transferFunctionAbi = erc20Abi.getFunction('transfer');
            const txId = await thorClient.contracts.executeTransaction(
                senderSigner,
                VTHO_ADDRESS,
                transferFunctionAbi,
                [senderAddress.toString(), 1n]
            );
            expect(txId).toBeDefined();
            const receipt =
                await thorClient.transactions.waitForTransactionReceipt(txId);
            expect(receipt).toBeDefined();
            expect(receipt?.reverted).toBe(false);
        });
        test('ok <- transfer VTHO to self, with transactionoptions', async () => {
            const erc20Abi = new ABIContract(ERC20_ABI);
            const transferFunctionAbi = erc20Abi.getFunction('transfer');
            const txId = await thorClient.contracts.executeTransaction(
                senderSigner,
                VTHO_ADDRESS,
                transferFunctionAbi,
                [senderAddress.toString(), 1n],
                { gas: 100000n, gasPriceCoef: 255n }
            );
            expect(txId).toBeDefined();
            const receipt =
                await thorClient.transactions.waitForTransactionReceipt(txId);
            expect(receipt).toBeDefined();
            expect(receipt?.reverted).toBe(false);
        });
        test('ok <- transfer VTHO to self, with estimate gas options', async () => {
            const erc20Abi = new ABIContract(ERC20_ABI);
            const transferFunctionAbi = erc20Abi.getFunction('transfer');
            const txId = await thorClient.contracts.executeTransaction(
                senderSigner,
                VTHO_ADDRESS,
                transferFunctionAbi,
                [senderAddress.toString(), 1n],
                undefined,
                { revision: Revision.BEST, gasPadding: 0.2 }
            );
            expect(txId).toBeDefined();
            const receipt =
                await thorClient.transactions.waitForTransactionReceipt(txId);
            expect(receipt).toBeDefined();
            expect(receipt?.reverted).toBe(false);
        });
    });
});
