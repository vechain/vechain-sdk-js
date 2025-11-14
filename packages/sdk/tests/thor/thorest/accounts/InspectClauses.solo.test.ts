import { describe, expect, test } from '@jest/globals';
import { ExecuteCodesRequest, InspectClauses } from '@thor/thorest';
import { FetchHttpClient } from '@common/http';
import { Address, BlockRef, Hex, HexUInt } from '@common/vcdm';
import {
    Clause,
    type SimulateTransactionOptions
} from '@thor/thor-client/model/transactions';
import { ThorNetworks } from '@thor/utils/const/network';

/**
 * VeChain inspect clauses - solo
 *
 * @group solo/thor/accounts
 */
describe('InspectClauses solo tests', () => {
    test('ok <- askTo', async () => {
        const clauses = [
            new Clause(
                Address.of('0x0000000000000000000000000000456E65726779'),
                0n,
                Hex.of(
                    '0xa9059cbb0000000000000000000000000f872421dc479f3c11edd89512731814d0598db50000000000000000000000000000000000000000000000013f306a2409fc0000'
                )
            ),
            new Clause(
                Address.of('0xf077b491b355E64048cE21E3A6Fc4751eEeA77fa'),
                HexUInt.of('0x6124fee993bc00000').bi,
                Hex.of('0x')
            ),
            new Clause(
                null,
                0n,
                Hex.of(
                    '0x6080604052348015600f57600080fd5b50609f8061001e6000396000f300608060405260043610603f576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631820cabb146044575b600080fd5b348015604f57600080fd5b506056606c565b6040518082815260200191505060405180910390f35b62015180815600a165627a7a723058200ac7475da248e2fc26c057319e296e90c24d5f8b9bf956fb3b77545642cad3b10029'
                )
            )
        ];
        const options: SimulateTransactionOptions = {
            gas: 50000n,
            gasPrice: 1000000000000000n,
            caller: Address.of('0x6d95e6dca01d109882fe1726a2fb9865fa41e7aa'),
            provedWork: '1000',
            gasPayer: Address.of('0xd3ae78222beadb038203be21ed5ce7c9b1bff602'),
            expiration: 1000,
            blockRef: BlockRef.of('0x00000000851caf3c')
        };
        const response = (
            await InspectClauses.of(
                new ExecuteCodesRequest(clauses, options)
            ).askTo(FetchHttpClient.at(new URL(ThorNetworks.SOLONET)))
        ).response;
        expect(response.items.length).toBe(1);
        expect(response.items[0].data.toString()).toBe(
            '0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001d6275696c74696e3a20696e73756666696369656e742062616c616e6365000000'
        );
        expect(response.items[0].gasUsed).toBe(1071n);
        expect(response.items[0].reverted).toBe(true);
        expect(response.items[0].vmError).toBe('execution reverted');
    });
});
