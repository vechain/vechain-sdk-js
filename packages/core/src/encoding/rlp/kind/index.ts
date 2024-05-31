import { BufferKind } from './bufferkind';
import { NumericKind } from './numerickind';
import { ScalarKind } from './scalarkind.abstract';
import {
    CompactFixedHexBlobKind,
    FixedHexBlobKind,
    HexBlobKind,
    OptionalFixedHexBlobKind
} from './hexblobkinds';

/**
 * RLP_CODER profile classes.
 */
export const RLPProfiles: {
    ScalarKind: typeof ScalarKind;
    BufferKind: typeof BufferKind;
    NumericKind: typeof NumericKind;
    HexBlobKind: typeof HexBlobKind;
    FixedHexBlobKind: typeof FixedHexBlobKind;
    OptionalFixedHexBlobKind: typeof OptionalFixedHexBlobKind;
    CompactFixedHexBlobKind: typeof CompactFixedHexBlobKind;
} = {
    ScalarKind,
    BufferKind,
    NumericKind,
    HexBlobKind,
    FixedHexBlobKind,
    OptionalFixedHexBlobKind,
    CompactFixedHexBlobKind
};

export type { ScalarKind };
