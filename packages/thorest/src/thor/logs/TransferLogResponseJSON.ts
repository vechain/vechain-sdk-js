import type { LogMetaJSON } from '@thor/logs/LogMetaJSON';
interface TransferLogResponseJSON {
    sender: string;
    recipient: string;
    amount: string;
    meta: LogMetaJSON;
}

export { type TransferLogResponseJSON };
