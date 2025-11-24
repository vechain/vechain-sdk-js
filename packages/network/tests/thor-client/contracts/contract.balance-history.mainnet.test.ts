import { beforeAll, describe, expect, test } from '@jest/globals';
import { ABIContract, Txt } from '@vechain/sdk-core';
import { MAINNET_URL, ThorClient } from '../../../src';

const BALANCE_OF_ABI = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address'
            }
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    }
] as const;

const BALANCE_OF_FUNCTION =
    ABIContract.ofAbi(BALANCE_OF_ABI).getFunction('balanceOf');

const B3TR_CONTRACT = '0x5ef79995FE8a89e0812330E4378eB2660ceDe699';
const TARGET_ACCOUNT = '0xff0f343772ae053f6ddb2885ea9df1d301e222f6';
const TRANSFER_BLOCK = 23131865;
const REVISION_AFTER_TRANSFER = TRANSFER_BLOCK + 1;
const REVISION_BEFORE_TRANSFER = TRANSFER_BLOCK - 1;

/**
 * Verifies that historical contract reads on mainnet can target specific revisions.
 *
 * @group integration/client/thor-client/contracts/balance-history-mainnet
 */
describe('ThorClient - Contracts balance history (mainnet)', () => {
    let thorClient: ThorClient;

    beforeAll(() => {
        thorClient = ThorClient.at(MAINNET_URL);
    });

    test('reads balanceOf around a known transfer block', async () => {
        const contract = thorClient.contracts.load(
            B3TR_CONTRACT,
            BALANCE_OF_ABI
        );

        contract.setContractReadOptions({
            revision: Txt.of(REVISION_AFTER_TRANSFER)
        });

        const afterLoadResult = await contract.read.balanceOf(TARGET_ACCOUNT);
        const afterCallResult = await thorClient.contracts.executeCall(
            B3TR_CONTRACT,
            BALANCE_OF_FUNCTION,
            [TARGET_ACCOUNT],
            { revision: Txt.of(REVISION_AFTER_TRANSFER) }
        );

        expect(afterCallResult.success).toBe(true);
        const afterPlain = afterCallResult.result.plain as bigint;
        expect(afterLoadResult).toEqual([afterPlain]);

        contract.setContractReadOptions({
            revision: Txt.of(REVISION_BEFORE_TRANSFER)
        });

        const beforeLoadResult = await contract.read.balanceOf(TARGET_ACCOUNT);
        const beforeCallResult = await thorClient.contracts.executeCall(
            B3TR_CONTRACT,
            BALANCE_OF_FUNCTION,
            [TARGET_ACCOUNT],
            { revision: Txt.of(REVISION_BEFORE_TRANSFER) }
        );

        expect(beforeCallResult.success).toBe(true);
        const beforePlain = beforeCallResult.result.plain as bigint;

        expect(beforeLoadResult).toEqual([beforePlain]);

        expect(afterPlain).not.toEqual(beforePlain);
    }, 30000);
});
