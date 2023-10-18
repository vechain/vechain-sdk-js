import { BufferKind } from './bufferkind';
import { NumericKind } from './numerickind';
import { ScalarKind } from './scalarkind.abstract';
import {
    HexBlobKind,
    FixedHexBlobKind,
    OptionalFixedHexBlobKind,
    CompactFixedHexBlobKind
} from './hexblobkinds';

/**
 * RLP profile classes.
 */
export const RLPProfiles = {
    ScalarKind,
    BufferKind,
    NumericKind,
    HexBlobKind,
    FixedHexBlobKind,
    OptionalFixedHexBlobKind,
    CompactFixedHexBlobKind
};

export type { ScalarKind };
