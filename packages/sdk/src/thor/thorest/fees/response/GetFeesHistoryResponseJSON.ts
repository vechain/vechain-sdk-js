/**
 * [GetFeesHistoryResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/GetFeesHistoryResponse)
 */
interface GetFeesHistoryResponseJSON {
    oldestBlock: string; // hex
    baseFeePerGas: string[]; // hex
    gasUsedRatio: number[]; // number
    reward?: string[][]; // hex
}

export { type GetFeesHistoryResponseJSON };
