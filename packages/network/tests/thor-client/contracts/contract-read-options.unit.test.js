"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const sdk_core_1 = require("@vechain/sdk-core");
const src_1 = require("../../../src");
/**
 * Contract read options behavior.
 *
 * @group unit/clients/thor-client/contracts
 */
const simpleAbi = [
    {
        name: 'get',
        type: 'function',
        stateMutability: 'view',
        inputs: [],
        outputs: [
            {
                name: '',
                type: 'uint256'
            }
        ]
    }
];
function createMockedContract() {
    const executeCall = globals_1.jest.fn();
    executeCall.mockResolvedValue({
        success: true,
        result: {
            array: [123n]
        }
    });
    const contractsModule = {
        executeCall
    };
    return {
        contract: new src_1.Contract('0x0000000000000000000000000000000000000000', simpleAbi, contractsModule),
        executeCall
    };
}
(0, globals_1.describe)('Contract read options', () => {
    (0, globals_1.test)('uses revision configured via setContractReadOptions when no clause override is provided', async () => {
        const { contract, executeCall } = createMockedContract();
        contract.setContractReadOptions({ revision: sdk_core_1.Revision.of('0x1234') });
        await contract.read.get();
        (0, globals_1.expect)(executeCall).toHaveBeenCalledTimes(1);
        (0, globals_1.expect)(executeCall.mock.calls[0][3]?.revision?.toString()).toBe('0x1234');
    });
    (0, globals_1.test)('clause-level revision overrides contract-level revision without clearing it', async () => {
        const { contract, executeCall } = createMockedContract();
        contract.setContractReadOptions({ revision: sdk_core_1.Revision.of('0xaaaa') });
        await contract.read.get({ revision: '0xbbbb' });
        await contract.read.get();
        (0, globals_1.expect)(executeCall).toHaveBeenCalledTimes(2);
        (0, globals_1.expect)(executeCall.mock.calls[0][3]?.revision?.toString()).toBe('0xbbbb');
        (0, globals_1.expect)(executeCall.mock.calls[1][3]?.revision?.toString()).toBe('0xaaaa');
    });
});
