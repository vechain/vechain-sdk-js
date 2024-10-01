import {
    DockerComposeEnvironment,
    PullPolicy,
    type StartedDockerComposeEnvironment,
    Wait
} from 'testcontainers';
import axios from 'axios';

let environment: StartedDockerComposeEnvironment;
const RPC_PROXY_URL = `http://localhost:8545`;

beforeAll(async () => {
    environment = await new DockerComposeEnvironment(
        '../../docker',
        'docker-compose.rpc-proxy.yml'
    )
        .withPullPolicy(PullPolicy.alwaysPull())
        .withWaitStrategy(
            'thor-solo',
            Wait.forLogMessage('📦 new block packed')
        )
        .withWaitStrategy(
            'rpc-proxy',
            Wait.forLogMessage('[rpc-proxy]: Proxy is running on port 8545')
        )
        .up();
});

afterAll(async () => {
    await environment.down();
});

describe('RPC Proxy endpoints', () => {
    describe('should return proper response for', () => {
        it('eth_blockNumber method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                jsonrpc: '2.0',
                method: 'eth_blockNumber',
                params: [],
                id: 1
            });
            expect(response.status).toBe(200);

            console.log(response.data);
            expect(response.data).toHaveProperty('result');
        });

        it('eth_getTransactionCount method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                jsonrpc: '2.0',
                method: 'eth_getTransactionCount',
                params: [
                    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
                    'latest'
                ],
                id: 1
            });

            expect(response.status).toBe(200);

            console.log(response.data);
            expect(response.data).toHaveProperty('result');
        });

        it('eth_gasPrice method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                jsonrpc: '2.0',
                method: 'eth_gasPrice',
                params: [],
                id: 1
            });

            expect(response.status).toBe(200);

            console.log(response.data);
            expect(response.data).toHaveProperty('result');
        });

        it('eth_getCode method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                jsonrpc: '2.0',
                method: 'eth_getCode',
                params: [
                    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
                    'latest'
                ],
                id: 1
            });

            expect(response.status).toBe(200);

            console.log(response.data);
            expect(response.data).toHaveProperty('result');
        });

        it('eth_getLogs method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                jsonrpc: '2.0',
                method: 'eth_getLogs',
                params: [
                    { address: '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed' }
                ],
                id: 1
            });

            expect(response.status).toBe(200);

            console.log(response.data);
            expect(response.data).toHaveProperty('result');
        });

        it('eth_getBalance method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                jsonrpc: '2.0',
                method: 'eth_getBalance',
                params: [
                    '0x7567d83b7b8d80addcb281a71d54fc7b3364ffed',
                    'latest'
                ],
                id: 1
            });

            expect(response.status).toBe(200);

            console.log(response.data);
            expect(response.data).toHaveProperty('result');
        });

        it('net_peerCount method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                jsonrpc: '2.0',
                method: 'net_peerCount',
                params: [],
                id: 1
            });

            expect(response.status).toBe(200);

            console.log(response.data);
            expect(response.data).toHaveProperty('result');
        });

        it('net_listening method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                jsonrpc: '2.0',
                method: 'net_listening',
                params: [],
                id: 67
            });

            expect(response.status).toBe(200);

            console.log(response.data);
            expect(response.data).toHaveProperty('result');
        });

        it('eth_getTransactionByBlockNumberAndIndex method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                method: 'eth_getTransactionByBlockNumberAndIndex',
                params: ['0xc5043f', '0x0'],
                id: 1,
                jsonrpc: '2.0'
            });

            expect(response.status).toBe(200);

            console.log(response.data);
            expect(response.data).toHaveProperty('result');
        });

        it('eth_getBlockTransactionCountByNumber method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                method: 'eth_getBlockTransactionCountByNumber',
                params: ['0xc5043f'],
                id: 1,
                jsonrpc: '2.0'
            });

            expect(response.status).toBe(200);

            console.log(response.data);
            expect(response.data).toHaveProperty('result');
        });

        it('eth_getBlockTransactionCountByHash method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                method: 'eth_getBlockTransactionCountByHash',
                params: [
                    '0x829df9bb801fc0494abf2f443423a49ffa32964554db71b098d332d87b70a48b'
                ],
                id: 1,
                jsonrpc: '2.0'
            });

            expect(response.status).toBe(200);

            console.log(response.data);
            expect(response.data).toHaveProperty('result');
        });
    });

    describe('should return METHOD NOT IMPLEMENTED for', () => {
        it('eth_getProof method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                method: 'eth_getProof',
                params: [
                    {
                        from: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                        to: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                        value: '0x186a0'
                    },
                    'latest'
                ],
                id: 1,
                jsonrpc: '2.0'
            });

            expect(response.status).toBe(200);

            console.log(response.data);
            expect(response.data).toHaveProperty('result');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.data.result).toBe('METHOD NOT IMPLEMENTED');
        });

        it('eth_sign method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                jsonrpc: '2.0',
                method: 'eth_sign',
                params: [
                    '0x9b2055d370f73ec7d8a03e965129118dc8f5bf83',
                    '0xdeadbeaf'
                ],
                id: 1
            });

            expect(response.status).toBe(200);

            console.log(response.data);
            expect(response.data).toHaveProperty('result');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.data.result).toBe('METHOD NOT IMPLEMENTED');
        });

        it('eth_getUncleCountByBlockHash method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                method: 'eth_getUncleCountByBlockHash',
                params: [
                    '0x829df9bb801fc0494abf2f443423a49ffa32964554db71b098d332d87b70a48b'
                ],
                id: 1,
                jsonrpc: '2.0'
            });

            expect(response.status).toBe(200);

            console.log(response.data);
            expect(response.data).toHaveProperty('result');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.data.result).toBe('METHOD NOT IMPLEMENTED');
        });

        it('eth_getUncleCountByBlockNumber method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                method: 'eth_getUncleCountByBlockNumber',
                params: ['0xc5043f'],
                id: 1,
                jsonrpc: '2.0'
            });

            expect(response.status).toBe(200);

            console.log(response.data);
            expect(response.data).toHaveProperty('result');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.data.result).toBe('METHOD NOT IMPLEMENTED');
        });

        it('eth_getUncleByBlockHashAndIndex method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                jsonrpc: '2.0',
                method: 'eth_getUncleByBlockHashAndIndex',
                params: [
                    '0xb3b20624f8f0f86eb50dd04688409e5cea4bd02d700bf6e79e9384d47d6a5a35',
                    '0x0'
                ],
                id: 1
            });

            expect(response.status).toBe(200);

            console.log(response.data);
            expect(response.data).toHaveProperty('result');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.data.result).toBe('METHOD NOT IMPLEMENTED');
        });

        it('eth_getUncleByBlockNumberAndIndex method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                jsonrpc: '2.0',
                method: 'eth_getUncleByBlockNumberAndIndex',
                params: ['latest', '0x0'],
                id: 1
            });

            expect(response.status).toBe(200);

            console.log(response.data);
            expect(response.data).toHaveProperty('result');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.data.result).toBe('METHOD NOT IMPLEMENTED');
        });

        it('eth_getProof method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                jsonrpc: '2.0',
                method: 'eth_getProof',
                params: [
                    '0x7F0d15C7FAae65896648C8273B6d7E43f58Fa842',
                    [
                        '0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421'
                    ],
                    'latest'
                ],
                id: 1
            });

            expect(response.status).toBe(200);

            console.log(response.data);
            expect(response.data).toHaveProperty('result');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.data.result).toBe('METHOD NOT IMPLEMENTED');
        });

        it('eth_feeHistory method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                jsonrpc: '2.0',
                method: 'eth_feeHistory',
                params: [4, 'latest', [25, 75]],
                id: 1
            });

            expect(response.status).toBe(200);

            console.log(response.data);
            expect(response.data).toHaveProperty('result');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.data.result).toBe('METHOD NOT IMPLEMENTED');
        });
    });

    describe('should return fail for', () => {
        it('eth_estimateGas method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                method: 'eth_estimateGas',
                params: [
                    {
                        from: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                        to: '0xf077b491b355e64048ce21e3a6fc4751eeea77fa',
                        value: '0x186a0'
                    },
                    'latest'
                ],
                id: 1,
                jsonrpc: '2.0'
            });

            expect(response.status).toBe(200);
            console.log(response.data);

            expect(response.data).toHaveProperty('error');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.data.error.errorMessage).toBe(
                `Method "eth_estimateGas" failed.`
            );
        });

        it('eth_getTransactionByBlockHashAndIndex method call', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                method: 'eth_getTransactionByBlockHashAndIndex',
                params: [
                    '0x829df9bb801fc0494abf2f443423a49ffa32964554db71b098d332d87b70a48b',
                    '0x0'
                ],
                id: 1,
                jsonrpc: '2.0'
            });

            expect(response.status).toBe(200);
            console.log(response.data);

            expect(response.data).toHaveProperty('error');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.data.error.errorMessage).toBe(
                `Method "eth_getTransactionByBlockHashAndIndex" failed.`
            );
        });

        it('non existing invalid method', async () => {
            const response = await axios.post(RPC_PROXY_URL, {
                jsonrpc: '2.0',
                method: 'invalid_method',
                params: [],
                id: 1
            });

            expect(response.status).toBe(200);
            console.log(response.data);

            expect(response.data).toHaveProperty('error');
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.data.error.errorMessage).toBe(
                'Method not found. Invalid RPC method given as input.'
            );
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            expect(response.data.error.methodName).toBe(
                'VeChainProvider.request()'
            );
        });
    });
});
