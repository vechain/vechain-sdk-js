import { describe, test } from '@jest/globals';
import {
    type ExecuteCodesRequestJSON,
    FetchHttpClient,
    InspectClauses,
    ThorNetworks
} from '../../../src';
import log from 'loglevel';

const logger = log.getLogger(
    'TEST:UNIT!packages/thorest/tests/thor/accounts/InspectClauses.testnet.test.ts'
);

describe('InspectClauses testnet tests', () => {
    test('ok <- askTo', async () => {
        const request = {
            gas: 50000,
            gasPrice: '1000000000000000',
            caller: '0x6d95e6dca01d109882fe1726a2fb9865fa41e7aa',
            provedWork: '1000',
            gasPayer: '0xd3ae78222beadb038203be21ed5ce7c9b1bff602',
            expiration: 1000,
            blockRef: '0x00000000851caf3c',
            clauses: [
                {
                    to: '0x0000000000000000000000000000456E65726779',
                    value: '0x0',
                    data: '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000000000000000000000000000000000000000013f306a2409fc0000'
                },
                {
                    to: '0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa',
                    value: '0x6124fee993bc00000',
                    data: '0x'
                },
                {
                    value: '0x0',
                    data: '0x6080604052348015600f57600080fd5b50609f8061001e6000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631820cabb146044575b600080fd5b348015604f57600080fd5b506056606c565b6040518082815260200191505060405180910390f35b62015180815600a165627a7a723058200ac7475da248e2fc26c057319e296e90c24d5f8b9bf956fb3b77545642cad3b10029'
                }
            ]
        } satisfies ExecuteCodesRequestJSON;
        const r = await InspectClauses.of(request).askTo(
            FetchHttpClient.at(ThorNetworks.TESTNET)
        );
        logger.debug(JSON.stringify(r, null, 2));
    });
});
