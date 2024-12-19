abstract class TracerName {
    abstract toString: () => string;
}

class StructLogger implements TracerName {
    static readonly NAME = 'structLogger';
    toString: () => string = () => StructLogger.NAME;
}

class FourByte implements TracerName {
    static readonly NAME = '4byte';
    toString: () => string = () => FourByte.NAME;
}

class Call implements TracerName {
    static readonly NAME = 'call';
    toString: () => string = () => Call.NAME;
}

class Noop implements TracerName {
    static readonly NAME = 'noop';
    toString: () => string = () => Noop.NAME;
}

class Prestate implements TracerName {
    static readonly NAME = 'prestate';
    toString: () => string = () => Prestate.NAME;
}

class Unigram implements TracerName {
    static readonly NAME = 'unigram';
    toString: () => string = () => Unigram.NAME;
}

class Bigram implements TracerName {
    static readonly NAME = 'bigram';
    toString: () => string = () => Bigram.NAME;
}

class Trigram implements TracerName {
    static readonly NAME = 'trigram';
    toString: () => string = () => Trigram.NAME;
}

class EvmDis implements TracerName {
    static readonly NAME = 'evmdis';
    toString: () => string = () => EvmDis.NAME;
}

class OpCount implements TracerName {
    static readonly NAME = 'opcount';
    toString: () => string = () => OpCount.NAME;
}

class Null implements TracerName {
    static readonly NAME = 'null';
    toString: () => string = () => Null.NAME;
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
class Tracer {
    static of(name: string): TracerName {
        switch (name) {
            case StructLogger.NAME:
                return new StructLogger();
            case FourByte.NAME:
                return new FourByte();
            case Call.NAME:
                return new Call();
            case Noop.NAME:
                return new Noop();
            case Prestate.NAME:
                return new Prestate();
            case Unigram.NAME:
                return new Unigram();
            case Bigram.NAME:
                return new Bigram();
            case Trigram.NAME:
                return new Trigram();
            case EvmDis.NAME:
                return new EvmDis();
            case OpCount.NAME:
                return new OpCount();
            case Null.NAME:
                return new Null();
        }
        throw new Error(`TracerName ${name} not found`);
    }
}

export {
    type TracerName,
    StructLogger,
    FourByte,
    Call,
    Noop,
    Prestate,
    Unigram,
    Bigram,
    Trigram,
    EvmDis,
    OpCount,
    Null,
    Tracer
};
