import { type Revision } from '@vechain/sdk-core';

/**
 * Input options for:
 * * {@link AccountModule.getAccount},
 * * {@link AccountModule.getBytecode},
 * * {@link AccountModule.getStorage},
 */
export interface AccountInputOptions {
    /**
     * (Optional) The block number or ID to reference the bytecode version.
     */
    revision?: Revision;
}
