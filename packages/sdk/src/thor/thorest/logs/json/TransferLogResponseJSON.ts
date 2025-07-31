import type { LogMetaJSON } from '@thor/thorest/json';
interface TransferLogResponseJSON {
    sender: string;
    recipient: string;
    amount: string;
    meta: LogMetaJSON;
}

export { type TransferLogResponseJSON };
