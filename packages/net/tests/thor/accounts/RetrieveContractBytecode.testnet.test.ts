import { describe, test } from '@jest/globals';
import { Address } from '@vechain/sdk-core';
import {
    RetrieveContractBytecode,
    FetchHttpClient,
    ThorNetworks
} from '../../../src';

describe('RetrieveContractBytecode testnet tests', () => {
    test('ok <- askTo', async () => {
        const r = await RetrieveContractBytecode.of(
            Address.of('0x0000000000000000000000000000456E65726779')
        ).askTo(new FetchHttpClient(ThorNetworks.TESTNET));
        console.log(JSON.stringify(r, null, 2));
    });
});
