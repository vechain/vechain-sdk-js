import { type LogMetaJSON } from "@thor/logs";

/**
 * [SubscriptionEventResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/SubscriptionEventResponse)
 */
interface SubscriptionEventResponseJSON {
    address: string;
    topics: string[];
    data: string;
    obsolete: boolean;
    meta: LogMetaJSON;
}

export { type SubscriptionEventResponseJSON };