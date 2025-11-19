import { EventFragment } from 'ethers';
/**
 * Test cases for the getEventSubscriptionUrl function
 */
declare const getEventSubscriptionUrlTestCases: ({
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
    options: {
        address?: undefined;
    };
    expectedURL: string;
} | {
    event: EventFragment;
    valuesToEncode: string[];
    options: {
        address?: undefined;
    };
    expectedURL: string;
} | {
    event: string;
    valuesToEncode: (string | null)[];
    options: {
        address?: undefined;
    };
    expectedURL: string;
} | {
    event: string;
    valuesToEncode: undefined;
    options: {
        address?: undefined;
    };
    expectedURL: string;
} | {
    event: string;
    valuesToEncode: (string | bigint)[];
    options: {
        address?: undefined;
    };
    expectedURL: string;
} | {
    event: string;
    valuesToEncode: (string | bigint | null)[];
    options: {
        address: string;
    };
    expectedURL: string;
})[];
/**
 * Test cases for the getBlockSubscriptionUrl function
 */
declare const getBlockSubscriptionUrlTestCases: {
    options: {};
    expectedURL: string;
}[];
/**
 * Test cases for the getLegacyBeatSubscriptionUrl function
 */
declare const getLegacyBeatSubscriptionUrlTestCases: {
    options: {};
    expectedURL: string;
}[];
/**
 * Test cases for the getBeatSubscriptionUrl function
 */
declare const getBeatSubscriptionUrlTestCases: {
    options: {};
    expectedURL: string;
}[];
/**
 * Test cases for the getNewTransactionsSubscriptionUrl function
 */
declare const getNewTransactionsSubscriptionUrlTestCases: {
    expectedURL: string;
}[];
declare const getVETtransfersSubscriptionUrlTestCases: ({
    options: {
        signerAddress?: undefined;
        sender?: undefined;
        recipient?: undefined;
    };
    expectedURL: string;
} | {
    options: {
        signerAddress: string;
        sender?: undefined;
        recipient?: undefined;
    };
    expectedURL: string;
} | {
    options: {
        signerAddress: string;
        sender: string;
        recipient?: undefined;
    };
    expectedURL: string;
} | {
    options: {
        recipient: string;
        signerAddress?: undefined;
        sender?: undefined;
    };
    expectedURL: string;
})[];
/**
 * Test if the websocket connection is valid
 *
 * @param url - The websocket URL to test
 *
 * @returns A promise that resolves to true if the connection is valid, false otherwise.
 */
declare function testWebSocketConnection(url: string): Promise<boolean>;
export { getBeatSubscriptionUrlTestCases, getBlockSubscriptionUrlTestCases, getEventSubscriptionUrlTestCases, getLegacyBeatSubscriptionUrlTestCases, getNewTransactionsSubscriptionUrlTestCases, getVETtransfersSubscriptionUrlTestCases, testWebSocketConnection };
//# sourceMappingURL=fixture.d.ts.map