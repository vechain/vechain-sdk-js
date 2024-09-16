// Specify the path to your Solidity contract file
import { coder, ERC721_ABI, FPN, Units, VTHO_ADDRESS } from '../../src';
import { generateRandomValidAddress } from '../fixture';
import {
    InvalidAbiDataToEncodeOrDecode,
    InvalidDataType
} from '@vechain/sdk-errors';

const exampleContractBytecode =
    '608060405234801561001057600080fd5b506040516102063803806102068339818101604052810190610032919061007a565b80600081905550506100a7565b600080fd5b6000819050919050565b61005781610044565b811461006257600080fd5b50565b6000815190506100748161004e565b92915050565b6000602082840312156100905761008f61003f565b5b600061009e84828501610065565b91505092915050565b610150806100b66000396000f3fe608060405234801561001057600080fd5b50600436106100365760003560e01c806360fe47b11461003b5780636d4ce63c14610057575b600080fd5b610055600480360381019061005091906100c3565b610075565b005b61005f61007f565b60405161006c91906100ff565b60405180910390f35b8060008190555050565b60008054905090565b600080fd5b6000819050919050565b6100a08161008d565b81146100ab57600080fd5b50565b6000813590506100bd81610097565b92915050565b6000602082840312156100d9576100d8610088565b5b60006100e7848285016100ae565b91505092915050565b6100f98161008d565b82525050565b600060208201905061011460008301846100f0565b9291505056fea26469706673582212205afd59a6c45e89fb94e9e067818966a866fb7912880dd931923031b31555a92c64736f6c63430008160033';

const exampleContractAbi = [
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'initialValue',
                type: 'uint256'
            }
        ],
        stateMutability: 'nonpayable',
        type: 'constructor'
    },
    {
        inputs: [],
        name: 'get',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256'
            }
        ],
        stateMutability: 'view',
        type: 'function'
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'x',
                type: 'uint256'
            }
        ],
        name: 'set',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function'
    }
];

/**
 * Generates a random valid address.
 */
const recipientAddress = generateRandomValidAddress();

/**
 * Generates a random valid address.
 */
const senderAddress = generateRandomValidAddress();

/**
 * Generates a random valid address.
 */
const contractAddress = generateRandomValidAddress();

/**
 * Test cases for building clauses for transferring VIP180 tokens.
 */
const transferTokenClausesTestCases = [
    {
        tokenAddress: VTHO_ADDRESS,
        recipientAddress,
        amount: 1,
        expected: {
            to: VTHO_ADDRESS,
            value: 0,
            data: `0xa9059cbb000000000000000000000000${recipientAddress.slice(
                2
            )}0000000000000000000000000000000000000000000000000000000000000001`
        }
    },
    {
        tokenAddress: VTHO_ADDRESS,
        recipientAddress,
        amount: '1',
        expected: {
            to: VTHO_ADDRESS,
            value: 0,
            data: `0xa9059cbb000000000000000000000000${recipientAddress.slice(
                2
            )}0000000000000000000000000000000000000000000000000000000000000001`
        }
    },
    {
        tokenAddress: VTHO_ADDRESS,
        recipientAddress,
        amount: Units.parseEther('1'),
        expected: {
            to: VTHO_ADDRESS,
            value: 0,
            data: `0xa9059cbb000000000000000000000000${recipientAddress.slice(
                2
            )}0000000000000000000000000000000000000000000000000de0b6b3a7640000`
        }
    },
    {
        tokenAddress: VTHO_ADDRESS,
        recipientAddress,
        amount: Units.parseEther('500000000'),
        expected: {
            to: VTHO_ADDRESS,
            value: 0,
            data: `0xa9059cbb000000000000000000000000${recipientAddress.slice(
                2
            )}0000000000000000000000000000000000000000019d971e4fe8401e74000000`
        }
    },
    {
        tokenAddress: VTHO_ADDRESS,
        recipientAddress,
        amount: FPN.of(100),
        expected: {
            to: VTHO_ADDRESS,
            value: 0,
            data: `0xa9059cbb000000000000000000000000${recipientAddress.slice(
                2
            )}0000000000000000000000000000000000000000000000000000000000000064`
        }
    }
];

/**
 * Test cases for building clauses for transferring VIP180 tokens.
 */
const invalidTransferTokenClausesTestCases = [
    {
        tokenAddress: VTHO_ADDRESS,
        recipientAddress,
        amount: -100,
        expectedError: InvalidDataType
    },
    {
        tokenAddress: VTHO_ADDRESS,
        recipientAddress,
        amount: -1,
        expectedError: InvalidDataType
    },
    {
        tokenAddress: VTHO_ADDRESS,
        recipientAddress,
        amount: '1,2',
        expectedError: InvalidDataType
    },
    {
        tokenAddress: VTHO_ADDRESS,
        recipientAddress,
        amount: 1.7,
        expectedError: InvalidDataType
    }
];

/**
 * Test cases for building clauses for transferring VET.
 */
const transferVETtestCases = [
    {
        recipientAddress,
        amount: 1,
        clauseOptions: { comment: 'transferring 1 VET' },
        expected: {
            to: recipientAddress,
            value: '0x1',
            data: '0x',
            comment: 'transferring 1 VET'
        }
    },
    {
        recipientAddress,
        amount: '1',
        clauseOptions: undefined,
        expected: {
            to: recipientAddress,
            value: '0x1',
            data: '0x'
        }
    },
    {
        recipientAddress,
        amount: Units.parseEther('1'),
        clauseOptions: undefined,
        expected: {
            to: recipientAddress,
            value: '0xde0b6b3a7640000',
            data: '0x'
        }
    },
    {
        recipientAddress,
        amount: Units.parseEther('500000000'),
        clauseOptions: undefined,
        expected: {
            to: recipientAddress,
            value: '0x19d971e4fe8401e74000000',
            data: '0x'
        }
    },
    {
        recipientAddress,
        amount: 100,
        clauseOptions: undefined,
        expected: {
            to: recipientAddress,
            value: '0x64',
            data: '0x'
        }
    }
];

/**
 * Test cases for building clauses for transferring NFT.
 */
const transferNFTtestCases = [
    {
        contractAddress,
        senderAddress,
        recipientAddress,
        tokenId: '0',
        expected: {
            to: contractAddress,
            value: 0,
            data: coder.encodeFunctionInput(ERC721_ABI, 'transferFrom', [
                senderAddress,
                recipientAddress,
                '0'
            ])
        }
    }
];

/**
 * Invalid NFT cases for building clauses for transferring NFT.
 */
const invalidNFTtestCases = [
    {
        contractAddress,
        senderAddress,
        recipientAddress,
        tokenId: '',
        expectedError: InvalidDataType
    },
    {
        contractAddress,
        senderAddress,
        recipientAddress,
        tokenId: '-654',
        expectedError: InvalidAbiDataToEncodeOrDecode
    },
    {
        contractAddress,
        senderAddress,
        recipientAddress: '',
        tokenId: '0x00001',
        expectedError: InvalidAbiDataToEncodeOrDecode
    },
    {
        contractAddress: '',
        senderAddress,
        recipientAddress,
        tokenId: '0x00001',
        expectedError: InvalidDataType
    },
    {
        contractAddress,
        senderAddress: '',
        recipientAddress,
        tokenId: '0x00001',
        expectedError: InvalidDataType
    }
];

/**
 * Invalid Test cases for building clauses for transferring VET.
 */
const invalidTransferVETTestCases = [
    {
        recipientAddress,
        amount: -100,
        expectedError: InvalidDataType
    },
    {
        recipientAddress,
        amount: -1,
        expectedError: InvalidDataType
    },
    {
        recipientAddress,
        amount: '1,2',
        expectedError: InvalidDataType
    },
    {
        recipientAddress,
        amount: '1.2',
        expectedError: InvalidDataType
    },
    {
        recipientAddress,
        amount: 1.7,
        expectedError: InvalidDataType
    }
];

export {
    exampleContractAbi,
    exampleContractBytecode,
    transferTokenClausesTestCases,
    invalidTransferTokenClausesTestCases,
    transferVETtestCases,
    transferNFTtestCases,
    invalidNFTtestCases,
    invalidTransferVETTestCases
};
