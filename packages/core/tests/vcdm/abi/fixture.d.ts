import { InvalidAbiDataToEncodeOrDecode } from '@vechain/sdk-errors';
/**
 * Simple functions fixtures
 */
declare const functions: ({
    objectAbi: {
        constant: boolean;
        inputs: {
            name: string;
            type: string;
        }[];
        name: string;
        outputs: {
            name: string;
            type: string;
        }[];
        payable: boolean;
        stateMutability: string;
        type: string;
    };
    full: string;
    minimal: string;
    signatureHash: string;
    jsonStringifiedAbi: string;
    encodingTestsInputs: (string | bigint)[][];
} | {
    objectAbi: {
        inputs: never[];
        name: string;
        payable: boolean;
        outputs: {
            components: {
                internalType: string;
                name: string;
                type: string;
            }[];
            internalType: string;
            name: string;
            type: string;
        }[];
        stateMutability: string;
        type: string;
        constant?: undefined;
    };
    full: string;
    minimal: string;
    signatureHash: string;
    jsonStringifiedAbi: string;
    encodingTestsInputs: never[][];
})[];
/**
 * Simple parameters for function 2 (functions[1]) fixture.
 * Used to test encoding and decoding of multiple parameters in encode/decode abi tests.
 */
declare const simpleParametersDataForFunction2: {
    master: string;
    endorsor: string;
    identity: string;
    active: boolean;
}[];
/**
 * Simple events fixtures
 */
declare const events: {
    objectAbi: {
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
    };
    full: string;
    minimal: string;
    signatureHash: string;
    jsonStringifiedAbi: string;
    encodingTestsInputs: (string | bigint)[][];
}[];
/**
 * Event test cases for encoding topics
 */
declare const topicsEventTestCases: ({
    event: {
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
    };
    valuesToEncode: string[];
    expectedTopics: string[];
} | {
    event: string;
    valuesToEncode: string[];
    expectedTopics: (string | undefined)[];
} | {
    event: string;
    valuesToEncode: (string | bigint)[];
    expectedTopics: string[];
} | {
    event: string;
    valuesToEncode: (bigint | null)[];
    expectedTopics: (string | undefined)[];
} | {
    event: string;
    valuesToEncode: (bigint | undefined)[];
    expectedTopics: (string | undefined)[];
} | {
    event: {
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
    };
    valuesToEncode: {
        appId: string;
    };
    expectedTopics: (string | undefined)[];
})[];
/**
 * Invalid topics event test cases
 */
declare const invalidTopicsEventTestCases: ({
    event: {
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
    };
    valuesToEncode: string[];
    expectedError: typeof InvalidAbiDataToEncodeOrDecode;
} | {
    event: {
        anonymous: boolean;
        inputs: {
            indexed: boolean;
            internalType: string;
            name: string;
            type: string;
        }[];
        name: string;
        type: string;
    };
    valuesToEncode: string[];
    expectedError: typeof InvalidAbiDataToEncodeOrDecode;
})[];
/**
 * Encode and decode parameter valid values
 */
declare const encodedDecodedValues: ({
    type: string;
    value: string;
    encoded: string;
} | {
    type: string;
    value: string[];
    encoded: string;
})[];
/**
 * Encode and decode parameter invalid values
 */
declare const encodedDecodedInvalidValues: {
    type: string;
    value: string;
    encoded: string;
}[];
declare const contractABI: readonly [{
    readonly constant: false;
    readonly inputs: readonly [{
        readonly name: "value";
        readonly type: "uint256";
    }];
    readonly name: "setValue";
    readonly outputs: readonly [];
    readonly payable: false;
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly constant: true;
    readonly inputs: readonly [];
    readonly name: "getValue";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly payable: false;
    readonly stateMutability: "view";
    readonly type: "function";
}];
declare const contractABIWithEvents: readonly [{
    readonly constant: false;
    readonly inputs: readonly [{
        readonly name: "value";
        readonly type: "uint256";
    }];
    readonly name: "setValue";
    readonly outputs: readonly [];
    readonly payable: false;
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}, {
    readonly constant: true;
    readonly inputs: readonly [];
    readonly name: "getValue";
    readonly outputs: readonly [{
        readonly name: "";
        readonly type: "uint256";
    }];
    readonly payable: false;
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly anonymous: false;
    readonly inputs: readonly [{
        readonly indexed: false;
        readonly name: "sender";
        readonly type: "address";
    }, {
        readonly indexed: false;
        readonly name: "value";
        readonly type: "uint256";
    }];
    readonly name: "ValueChanged";
    readonly type: "event";
}];
declare const contractStorageABI: readonly [{
    readonly inputs: readonly [];
    readonly name: "getValue";
    readonly outputs: readonly [{
        readonly internalType: "string";
        readonly name: "";
        readonly type: "string";
    }];
    readonly stateMutability: "view";
    readonly type: "function";
}, {
    readonly inputs: readonly [{
        readonly internalType: "string";
        readonly name: "_value";
        readonly type: "string";
    }];
    readonly name: "setValue";
    readonly outputs: readonly [];
    readonly stateMutability: "nonpayable";
    readonly type: "function";
}];
export declare const encodedParams = "0x000000000000000000000000000000000000000000000000000000000000007b00000000000000000000000000000000000000000000000000000000000000ea";
declare const ValueChangedEventData: {
    sender: string;
    value: number;
};
interface ExpectedERC721TransferEventType {
    eventName: 'Transfer';
    args: {
        from: `0x${string}`;
        to: `0x${string}`;
        tokenId: bigint;
    };
}
interface ExpectedCustomFunctionType {
    args: readonly [bigint];
    functionName: 'setValue';
}
export { contractABI, contractABIWithEvents, contractStorageABI, encodedDecodedInvalidValues, encodedDecodedValues, events, functions, invalidTopicsEventTestCases, simpleParametersDataForFunction2, topicsEventTestCases, ValueChangedEventData, type ExpectedCustomFunctionType, type ExpectedERC721TransferEventType };
//# sourceMappingURL=fixture.d.ts.map