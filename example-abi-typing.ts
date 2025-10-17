import { ThorClient } from './packages/sdk/src/thor/thor-client/ThorClient';
import { Address } from './packages/sdk/src/common/vcdm';

// Example ABI with proper typing
const vetAbi = [
    {
        inputs: [{ name: 'addr', type: 'address' }],
        name: 'balanceOf',
        outputs: [{ name: 'balance', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            { name: 'to', type: 'address' },
            { name: 'amount', type: 'uint256' }
        ],
        name: 'transfer',
        outputs: [{ name: 'success', type: 'bool' }],
        stateMutability: 'nonpayable',
        type: 'function'
    }
] as const;

const LOCAL_URL = 'http://localhost:8669';

// Create ThorClient instance
const thorClient = new ThorClient(new URL(LOCAL_URL));

// Create contract with ABI-based typing using ThorClient
const vetContract = thorClient.contracts.load(
    Address.of('0x0000000000000000000000000000456E65726779'), // VET token address
    vetAbi
);

async function example() {
    // balanceOf expects an address parameter and returns a bigint (not [bigint])
    const balance: bigint = await vetContract.read.balanceOf(
        Address.of('0x1234567890123456789012345678901234567890')
    );

    console.log('Balance:', balance.toString());

    // transfer expects (to: Address, amount: bigint) and returns SendTransactionResult
    const transferResult = await vetContract.write.transfer(
        Address.of('0x1234567890123456789012345678901234567890'),
        1000n
    );

    console.log('Transfer result:', transferResult.id);

    const transferClause = vetContract.clause.transfer(
        Address.of('0x1234567890123456789012345678901234567890'),
        1000n
    );

    console.log('Transfer clause:', transferClause);
}

// This demonstrates the ABI-based typing in action
export { example, vetContract };
