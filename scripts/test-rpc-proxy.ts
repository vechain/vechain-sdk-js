import { fail, strictEqual } from 'assert';

const endpointsTestCases = [
    {
        method: 'net_version',
        params: [],
        expected: '0x186aa'
    },
    {
        method: 'eth_chainId',
        params: [],
        expected: '0x186aa'
    },
    {
        method: 'web3_clientVersion',
        params: [],
        expected: 'thor'
    },
    {
        method: 'eth_call',
        params: [
            {
                from: '0x7487d912d03ab9de786278f679592b3730bdd540',
                to: '0x3db469a79593dcc67f07DE1869d6682fC1eaf535',
                value: '1000000000000000000',
                data: '0x'
            },
            'latest'
        ],
        expected: '0x'
    }
];

const proxyUrl = 'http://localhost:8545';

async function testRPCProxy(): Promise<void> {
    try {
        // Send RPC requests to test it
        for (const { method, params, expected } of endpointsTestCases) {
            const response = await fetch(proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    jsonrpc: '2.0',
                    id: 1,
                    method,
                    params
                })
            });

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const data: { result?: unknown } = await response.json();

            if (data.result === undefined) {
                throw new Error('Response does not contain result');
            }

            strictEqual(data.result, expected, 'Expected a different result');
        }
    } catch (error) {
        console.error(
            'Error occurred while testing RPC Proxy:',
            (error as Error).message
        );
    }
}

testRPCProxy().catch(fail);
