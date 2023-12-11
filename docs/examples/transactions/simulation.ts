import { expect } from 'expect';
import {
    HttpClient,
    ThorestClient
} from '@vechainfoundation/vechain-sdk-network';
import {
    contract,
    dataUtils,
    PARAMS_ABI,
    PARAMS_ADDRESS } from "@vechainfoundation/vechain-sdk-core";

// In this example we simulate a transaction of sending 1 VET to another account

// 1 - Create client for solo network
const _soloUrl = 'http://localhost:8669';
const soloNetwork = new HttpClient(_soloUrl);
const thorestSoloClient = new ThorestClient(soloNetwork);

// 2(a) - create the transaction for a VET transfer
const transaction1 = {
    clauses: [
        {
            to: '0xb717b660cd51109334bd10b2c168986055f58c1a',
            value: '1000000000000000000',
            data: '0x'
        }
    ],
    simulateTransactionOptions: {
        caller: '0x7a28e7361fd10f4f058f9fefc77544349ecff5d6'
    }
}

// 2(b) - define the expected result
const expected1 =
    [{
        data: '0x',
        events: [],
        transfers: [
            {
                sender: '0x7a28e7361fd10f4f058f9fefc77544349ecff5d6',
                recipient:
                    '0xb717b660cd51109334bd10b2c168986055f58c1a',
                amount: '0xde0b6b3a7640000'
            }
        ],
        gasUsed: 0,
        reverted: false,
        vmError: ''
    }]


// 3 - Simulate the transaction
const simulatedTx1 =
    await thorestSoloClient.transactions.simulateTransaction(
        transaction1.clauses,
        {
            ...transaction1.simulateTransactionOptions
        }
    );


// 4 - Check the result - i.e. the gas used is returned and the transfer values are correct
// Note: VET transfers do not consume gas (no EVM computation)
expect(simulatedTx1[0].gasUsed).toEqual(expected1[0].gasUsed);
expect(simulatedTx1[0].transfers).toEqual(expected1[0].transfers);

// In this next example we simulate a Simulate smart contract transaction

// 1(a) - create the transaction for a VET transfer
const transaction2 = {
    clauses: [
        /**
         * Calls the PARAMS 'get(bytes32)' function.
         * Passes "base-gas-price" encoded as bytes 32 as the parameter.
         */
        {
            to: PARAMS_ADDRESS,
            value: '0',
            data: contract.coder.encodeFunctionInput(
                PARAMS_ABI,
                'get',
                [
                    dataUtils.encodeBytes32String(
                        'base-gas-price'
                    )
                ]
            )
        }
    ]
}

// 1(b) - define the expected result
const expected2 = [
    {
        /**
         * Base gas price set in the params.sol built-in contract.
         *
         * The value set for thor-solo is `1000000000000000` (0,001 VTHO)
         *
         * @link see [thor/params.go](https://github.com/vechain/thor/blob/master/thor/params.go)
         */
        data: '0x00000000000000000000000000000000000000000000000000038d7ea4c68000',
        events: [],
        transfers: [],
        gasUsed: 591,
        reverted: false,
        vmError: ''
    }
]

// 2 - Simulate the transaction
const simulatedTx2 =
    await thorestSoloClient.transactions.simulateTransaction(
        transaction2.clauses
    );

// 3 - Check the result
expect(simulatedTx2[0].gasUsed).toEqual(expected2[0].gasUsed);
