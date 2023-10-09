import { RLP as rlp } from '@ethereumjs/rlp';
import {
    type RLPProfile,
    ScalarKind,
    type RLPInput,
    type RLPValidObect
} from './types';
import { ERRORS } from '../utils';

export class RLP {
    constructor(readonly profile: RLPProfile) {}

    public encode(data: RLPValidObect): Buffer {
        const packedData = this.pack(data, this.profile, '');
        return Buffer.from(rlp.encode(packedData));
    }

    private pack(
        obj: RLPValidObect,
        profile: RLPProfile,
        ctx: string
    ): RLPInput {
        ctx = ctx !== '' ? ctx + '.' + profile.name : profile.name;
        const kind = profile.kind;

        if (kind instanceof ScalarKind) {
            return kind.data(obj, ctx).encode();
        }

        if (Array.isArray(kind) && !Array.isArray(obj)) {
            return kind.map((k) =>
                this.pack(obj[k.name] as RLPValidObect, k, ctx)
            );
        }

        if (Array.isArray(obj) && 'item' in kind) {
            const item = kind.item;
            return obj.map((part, i) =>
                this.pack(
                    part as RLPValidObect,
                    { name: '#' + i, kind: item },
                    ctx
                )
            );
        }

        throw new Error(ERRORS.RLP.INVALID_RLP(ctx, 'unexpected input'));
    }
}
