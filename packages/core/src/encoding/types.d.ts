import { type Input } from '@ethereumjs/rlp';

type RLPInput = Input;

type RLPValidObect = Record<string, RLPInput | RLPComplexObject>;

interface RLPComplexObject {
    [key: string]: RLPInput | RLPComplexObject;
}

abstract class ScalarKind {
    public abstract data(
        data: RLPValidData,
        ctx: string
    ): { encode: () => Buffer };

    public abstract buffer(
        buf: Buffer,
        ctx: string
    ): { decode: () => RLPValidData };
}

interface ArrayKind {
    item: RLPProfile['kind'];
}

type StructKind = RLPProfile[];

interface RLPProfile {
    name: string;
    kind: ScalarKind | ArrayKind | StructKind;
}

export {
    ScalarKind,
    type RLPInput,
    type RLPValidObect,
    type ArrayKind,
    type StructKind,
    type RLPProfile
};
