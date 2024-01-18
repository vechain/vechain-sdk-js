/**
 * Fixture for eth_getTransactionReceipt correct cases for solo network
 */
const getReceiptCorrectCasesSoloNetwork = [
    {
        testCase:
            'eth_getTransactionReceipt - Should return correct transaction receipt - test case 1, a block with 10 transactions',
        hash: '0x4836db989f9072035586451ead35eb8a4ff5d2d4ce1996d7a550bdcb71a769f2', // Number 5 (index 4) into the block 2
        expected: {
            blockHash:
                '0x0000000235cb882736526a29a3456eea7bfc26117c8cb0d815828baf760c7eb5',
            blockNumber: '0x2',
            contractAddress: null,
            from: '0xabef6032b9176c186f6bf984f548bda53349f70a',
            gasUsed: '0x1087e',
            logs: [
                {
                    blockHash:
                        '0x0000000235cb882736526a29a3456eea7bfc26117c8cb0d815828baf760c7eb5',
                    blockNumber: '0x2',
                    transactionHash:
                        '0x4836db989f9072035586451ead35eb8a4ff5d2d4ce1996d7a550bdcb71a769f2',
                    address: '0x0000000000000000000000000000456e65726779',
                    topics: [
                        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                        '0x000000000000000000000000abef6032b9176c186f6bf984f548bda53349f70a',
                        '0x000000000000000000000000062f167a905c1484de7e75b88edc7439f82117de'
                    ],
                    data: '0x0000000000000000000000000000000000000000019d971e4fe8401e74000000',
                    removed: false,
                    transactionIndex: '0x4',
                    logIndex: '0x4'
                }
            ],
            status: '0x1',
            to: '0x0000000000000000000000000000456e65726779',
            transactionHash:
                '0x4836db989f9072035586451ead35eb8a4ff5d2d4ce1996d7a550bdcb71a769f2',
            transactionIndex: '0x4',
            logsBloom:
                '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            cumulativeGasUsed: '0x0',
            effectiveGasPrice: '0x0',
            type: '0x0'
        }
    },
    {
        testCase:
            'eth_getTransactionReceipt - Should return correct transaction receipt - test case 1, a block with 1 transaction',
        hash: '0x0a12d014783c36df12c30a02e801a76f3268cf3bc31e9ce0f667fa650d7bd6a1', // Number 1 (index 0) into the block 3
        expected: {
            blockHash:
                '0x00000003bdba35183f812d586dccdcb37fd0b0e9b4f419581a6d519a7cc71d7e',
            blockNumber: '0x3',
            contractAddress: '0xb2c20a6de401003a671659b10629eb82ff254fb8',
            from: '0xf02f557c753edf5fcdcbfe4c1c3a448b3cc84d54',
            gasUsed: '0x2a6487',
            logs: [
                {
                    blockHash:
                        '0x00000003bdba35183f812d586dccdcb37fd0b0e9b4f419581a6d519a7cc71d7e',
                    blockNumber: '0x3',
                    transactionHash:
                        '0x0a12d014783c36df12c30a02e801a76f3268cf3bc31e9ce0f667fa650d7bd6a1',
                    address: '0xb2c20a6de401003a671659b10629eb82ff254fb8',
                    topics: [
                        '0xb35bf4274d4295009f1ec66ed3f579db287889444366c03d3a695539372e8951'
                    ],
                    data: '0x000000000000000000000000f02f557c753edf5fcdcbfe4c1c3a448b3cc84d54',
                    removed: false,
                    transactionIndex: '0x0',
                    logIndex: '0x0'
                }
            ],
            status: '0x1',
            to: null,
            transactionHash:
                '0x0a12d014783c36df12c30a02e801a76f3268cf3bc31e9ce0f667fa650d7bd6a1',
            transactionIndex: '0x0',
            logsBloom:
                '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            cumulativeGasUsed: '0x0',
            effectiveGasPrice: '0x0',
            type: '0x0'
        }
    }
];

/**
 * Fixture for eth_getTransactionReceipt correct cases for test network
 */
const getReceiptCorrectCasesTestNetwork = [
    {
        testCase:
            'eth_getTransactionReceipt - Should return correct transaction receipt - test case 1, reverted transaction',
        hash: '0xfcee8fa4c325e3b35cf7a726db2a455fa8a0e8c84809ba0123487428f70ef7d2', // Simple reverted transaction
        expected: {
            blockHash:
                '0x010be0ce812bed2ef355b0163ec1d21ceb10f10573c45a7e5a24ef0c00b23181',
            blockNumber: '0x10be0ce',
            contractAddress: null,
            from: '0x4383ce6813f49438b7d9a9716a4bb799d83cf116',
            gasUsed: '0x698f',
            logs: [],
            status: '0x0',
            to: '0x9395baa47082552592f9cef61c2a1f068bd2af8f',
            transactionHash:
                '0xfcee8fa4c325e3b35cf7a726db2a455fa8a0e8c84809ba0123487428f70ef7d2',
            transactionIndex: '0x0',
            logsBloom:
                '0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000',
            cumulativeGasUsed: '0x0',
            effectiveGasPrice: '0x0',
            type: '0x0'
        }
    },
    {
        testCase:
            'eth_getTransactionReceipt - Should return correct transaction receipt - test case 1, reverted transaction',
        hash: '0x0000000000000000000000000b2a455fa8000000000000000000000000000000', // Simple null transaction
        expected: null
    }
];

export { getReceiptCorrectCasesSoloNetwork, getReceiptCorrectCasesTestNetwork };
