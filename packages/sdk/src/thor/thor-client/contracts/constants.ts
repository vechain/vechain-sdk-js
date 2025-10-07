import { Address } from '@common/vcdm';

/**
 * Built-in contract addresses and ABIs for VeChain blockchain
 */
export const BUILT_IN_CONTRACTS = {
    /**
     * Parameters contract address
     */
    PARAMS_ADDRESS: Address.of('0x0000000000000000000000000000456e65726779'),

    /**
     * Energy contract address
     */
    ENERGY_ADDRESS: Address.of('0x0000000000000000000000000000456e65726779'),

    /**
     * Parameters contract ABI
     */
    PARAMS_ABI: [
        {
            inputs: [
                {
                    name: 'key',
                    type: 'bytes32'
                }
            ],
            name: 'get',
            outputs: [
                {
                    name: 'value',
                    type: 'bytes32'
                }
            ],
            stateMutability: 'view',
            type: 'function'
        }
    ] as const,

    /**
     * Energy contract ABI
     */
    ENERGY_ABI: [
        {
            inputs: [
                {
                    name: 'addr',
                    type: 'address'
                }
            ],
            name: 'balanceOf',
            outputs: [
                {
                    name: 'balance',
                    type: 'uint256'
                }
            ],
            stateMutability: 'view',
            type: 'function'
        }
    ] as const
} as const;
