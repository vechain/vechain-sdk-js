import { ThorNetworks } from '@vechain/sdk-temp/thor';
import { createPublicClient, getContract } from '@vechain/sdk-temp/viem';

const publicClient = createPublicClient({ network: ThorNetworks.TESTNET });

const energyContractAddress = '0x0000000000000000000000000000456e65726779';

const energyContract = getContract({
    address: energyContractAddress,
    abi: [
        {
            constant: true,
            inputs: [],
            name: 'name',
            outputs: [
                {
                    name: '',
                    type: 'string'
                }
            ],
            payable: false,
            stateMutability: 'view',
            type: 'function'
        }
    ] as const,
    publicClient
});

const name = await energyContract.read.name();
console.log('Contract Name:', name);
