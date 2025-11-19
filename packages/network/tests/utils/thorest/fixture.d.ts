import { InvalidDataType } from '@vechain/sdk-errors';
/**
 * toQueryString test cases fixture
 */
declare const toQueryStringTestCases: ({
    records: {
        a: number;
        b: number;
        c: number;
        d?: undefined;
    };
    expected: string;
} | {
    records: {
        a: number;
        b: number;
        c: number;
        d: undefined;
    };
    expected: string;
} | {
    records: {
        a: undefined;
        b: number;
        c: number;
        d: undefined;
    };
    expected: string;
} | {
    records: {
        a?: undefined;
        b?: undefined;
        c?: undefined;
        d?: undefined;
    };
    expected: string;
})[];
/**
 * sanitizeWebsocketBaseURL test cases fixture
 */
declare const sanitizeWebsocketBaseURLTestCases: {
    url: string;
    expected: string;
}[];
/**
 * invalid sanitizeWebsocketBaseURL test cases fixture
 */
declare const invalidSanitizeWebsocketBaseURLTestCases: {
    url: string;
    expectedError: typeof InvalidDataType;
}[];
export { toQueryStringTestCases, sanitizeWebsocketBaseURLTestCases, invalidSanitizeWebsocketBaseURLTestCases };
//# sourceMappingURL=fixture.d.ts.map