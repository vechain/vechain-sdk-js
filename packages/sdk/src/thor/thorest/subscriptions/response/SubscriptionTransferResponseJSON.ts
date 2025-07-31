import { type LogMetaJSON } from '@thor/thorest/json';

/**
 * [SubscriptionTransferResponse](http://localhost:8669/doc/stoplight-ui/#/schemas/SubscriptionTransferResponse)
 */
interface SubscriptionTransferResponseJSON {
    sender: string;
    recipient: string;
    amount: string;
    obsolete: boolean;
    meta: LogMetaJSON;
}

export { type SubscriptionTransferResponseJSON };
