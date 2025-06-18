import { type EventJSON } from '@thor';
import { type TransferJSON } from '@thor';

interface ExecuteCodeResponseJSON {
    data: string;
    events: EventJSON[];
    transfers: TransferJSON[];
    gasUsed: number;
    reverted: boolean;
    vmError: string;
}

export { type ExecuteCodeResponseJSON };
