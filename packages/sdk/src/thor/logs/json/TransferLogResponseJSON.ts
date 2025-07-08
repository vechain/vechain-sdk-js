import type { LogMetaJSON } from '@thor/json';
interface TransferLogResponseJSON {
    sender: string;
    recipient: string;
    amount: string;
    meta: LogMetaJSON;
}

export { type TransferLogResponseJSON };
