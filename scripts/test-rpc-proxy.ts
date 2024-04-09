import axios from 'axios';
import assert from 'assert';

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
                to: '0x3db469a79593dcc67f07de1869d6682fc1eaf535',
                value: '1000000000000000000',
                data: '0x'
            },
            'latest'
        ],
        expected: '0x'
    }
]

async function testRPCProxy() {
  const proxyUrl = 'http://localhost:8545';

  try {
    // Send RPC requests to test it
    endpointsTestCases.forEach(async({method, params, expected})=>{
        const response = await axios.post(proxyUrl, {
            jsonrpc: '2.0',
            method: method,
            params: params
        });
        assert.ok(response.data && response.data.result, 'Response does not contain result');
        assert.strictEqual(response.data.result, expected, 'Expected a different result');
        return 0;
    })
  } catch (error) {
    console.error('Error occurred while testing RPC Proxy:', (error as Error).message);
    return 1;
  }
}

testRPCProxy();
