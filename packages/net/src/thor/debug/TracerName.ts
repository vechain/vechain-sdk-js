interface TracerName {
    name: string;
    toString: () => string;
}

class StructLogger implements TracerName {
    name = 'structLogger';
    toString: () => string = () => this.name;
}

class FourByte implements TracerName {
    name = '4byte';
    toString: () => string = () => this.name;
}

class Call implements TracerName {
    name = 'call';
    toString: () => string = () => this.name;
}

class Noop implements TracerName {
    name = 'noop';
    toString: () => string = () => this.name;
}

class Prestate implements TracerName {
    name = 'prestate';
    toString: () => string = () => this.name;
}

class Unigram implements TracerName {
    name = 'unigram';
    toString: () => string = () => this.name;
}

class Bigram implements TracerName {
    name = 'bigram';
    toString: () => string = () => this.name;
}

class Trigram implements TracerName {
    name = 'trigram';
    toString: () => string = () => this.name;
}

class EvmDis implements TracerName {
    name = 'evmdis';
    toString: () => string = () => this.name;
}

class OpCount implements TracerName {
    name = 'opcount';
    toString: () => string = () => this.name;
}

class Null implements TracerName {
    name = 'null';
    toString: () => string = () => this.name;
}

class Tracer implements TracerName {
    private static readonly NAMES: Map<string, TracerName> = new Map<
        string,
        TracerName
    >()
        .set(StructLogger.name, new StructLogger())
        .set(FourByte.name, new FourByte())
        .set(Call.name, new Call())
        .set(Noop.name, new Noop())
        .set(Prestate.name, new Prestate())
        .set(Unigram.name, new Unigram())
        .set(Bigram.name, new Bigram())
        .set(Trigram.name, new Trigram())
        .set(EvmDis.name, new EvmDis())
        .set(OpCount.name, new OpCount())
        .set(Null.name, new Null());

    name: string;

    protected constructor(name: string) {
        this.name = name;
    }

    toString: () => string = () => this.name;

    static of(name: string): Tracer {
        const label = Tracer.NAMES.get(name);
        if (label !== undefined) {
            return new Tracer(label.name);
        } else {
            throw new Error(`Tracer ${name} not found.`);
        }
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
