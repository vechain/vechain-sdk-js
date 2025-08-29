/**
 * [SubscriptionBeat2Response](http://localhost:8669/doc/stoplight-ui/#/schemas/SubscriptionBeat2Response)
 */
interface SubscriptionBeat2ResponseJSON {
    gasLimit: number;
    obsolete: boolean;
    number: number;
    id: string;
    parentID: string;
    timestamp: number;
    txsFeatures: number;
    bloom: string;
    k: number;
}

export { type SubscriptionBeat2ResponseJSON };
