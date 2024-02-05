import { vechain_sdk_core_ethers } from '@vechain/vechain-sdk-core';

/**
 * Fixtures for eth_getLogs positive cases
 */
const logsFixture = [
    {
        address: '0x0000000000000000000000000000456e65726779',
        fromBlock: vechain_sdk_core_ethers.toQuantity(0),
        toBlock: vechain_sdk_core_ethers.toQuantity(100000),
        topics: [
            '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e',
            '0x0000000000000000000000005034aa590125b64023a0262112b98d72e3c8e40e'
        ]
    }
];

export { logsFixture };
