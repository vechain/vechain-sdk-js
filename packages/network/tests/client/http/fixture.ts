import { ZERO_ADDRESS } from '../../fixture';

/**
 * First testnet block fixture
 */
const testnetGenesisBlock = {
    number: 0,
    id: '0x000000000b2bce3c70bc649a02749e8687721b09ed2e15997f466536b20bb127',
    size: 170,
    parentID:
        '0xffffffff00000000000000000000000000000000000000000000000000000000',
    timestamp: 1530014400,
    gasLimit: 10000000,
    beneficiary: ZERO_ADDRESS,
    gasUsed: 0,
    totalScore: 0,
    txsRoot:
        '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    txsFeatures: 0,
    stateRoot:
        '0x4ec3af0acbad1ae467ad569337d2fe8576fe303928d35b8cdd91de47e9ac84bb',
    receiptsRoot:
        '0x45b0cfc220ceec5b7c1c62c4d4193d38e4eba48e8815729ce75f9c0ab0e4c1c0',
    com: false,
    signer: ZERO_ADDRESS,
    isTrunk: true,
    isFinalized: true,
    transactions: []
};

/**
 * Zero address account details fixture
 */
const zeroAddressAccountDetails = {
    balance: '0x0',
    energy: '0x0',
    hasCode: false
};

export { testnetGenesisBlock, zeroAddressAccountDetails, ZERO_ADDRESS };
