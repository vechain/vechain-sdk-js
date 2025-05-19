import { describe, expect, test } from '@jest/globals';
import {
    Bigram,
    Call,
    EvmDis,
    FourByte,
    Noop,
    Null,
    OpCount,
    Prestate,
    StructLogger,
    Tracer,
    Trigram,
    Unigram
} from '@thor';

/**
 * VeChain tracer name - unit
 *
 * @group unit/debug
 */
describe('TracerName unit tests', () => {
    describe('toString() returns correct name', () => {
        test('StructLogger', () => {
            const tracer = new StructLogger();
            expect(tracer.toString()).toBe('structLogger');
        });

        test('FourByte', () => {
            const tracer = new FourByte();
            expect(tracer.toString()).toBe('4byte');
        });

        test('Call', () => {
            const tracer = new Call();
            expect(tracer.toString()).toBe('call');
        });

        test('Noop', () => {
            const tracer = new Noop();
            expect(tracer.toString()).toBe('noop');
        });

        test('Prestate', () => {
            const tracer = new Prestate();
            expect(tracer.toString()).toBe('prestate');
        });

        test('Unigram', () => {
            const tracer = new Unigram();
            expect(tracer.toString()).toBe('unigram');
        });

        test('Bigram', () => {
            const tracer = new Bigram();
            expect(tracer.toString()).toBe('bigram');
        });

        test('Trigram', () => {
            const tracer = new Trigram();
            expect(tracer.toString()).toBe('trigram');
        });

        test('EvmDis', () => {
            const tracer = new EvmDis();
            expect(tracer.toString()).toBe('evmdis');
        });

        test('OpCount', () => {
            const tracer = new OpCount();
            expect(tracer.toString()).toBe('opcount');
        });

        test('Null', () => {
            const tracer = new Null();
            expect(tracer.toString()).toBe('null');
        });
    });

    describe('Tracer.of() factory method', () => {
        test('creates StructLogger instance', () => {
            const tracer = Tracer.of('structLogger');
            expect(tracer).toBeInstanceOf(StructLogger);
            expect(tracer.toString()).toBe('structLogger');
        });

        test('creates FourByte instance', () => {
            const tracer = Tracer.of('4byte');
            expect(tracer).toBeInstanceOf(FourByte);
            expect(tracer.toString()).toBe('4byte');
        });

        test('creates Call instance', () => {
            const tracer = Tracer.of('call');
            expect(tracer).toBeInstanceOf(Call);
            expect(tracer.toString()).toBe('call');
        });

        test('creates Noop instance', () => {
            const tracer = Tracer.of('noop');
            expect(tracer).toBeInstanceOf(Noop);
            expect(tracer.toString()).toBe('noop');
        });

        test('creates Prestate instance', () => {
            const tracer = Tracer.of('prestate');
            expect(tracer).toBeInstanceOf(Prestate);
            expect(tracer.toString()).toBe('prestate');
        });

        test('creates Unigram instance', () => {
            const tracer = Tracer.of('unigram');
            expect(tracer).toBeInstanceOf(Unigram);
            expect(tracer.toString()).toBe('unigram');
        });

        test('creates Bigram instance', () => {
            const tracer = Tracer.of('bigram');
            expect(tracer).toBeInstanceOf(Bigram);
            expect(tracer.toString()).toBe('bigram');
        });

        test('creates Trigram instance', () => {
            const tracer = Tracer.of('trigram');
            expect(tracer).toBeInstanceOf(Trigram);
            expect(tracer.toString()).toBe('trigram');
        });

        test('creates EvmDis instance', () => {
            const tracer = Tracer.of('evmdis');
            expect(tracer).toBeInstanceOf(EvmDis);
            expect(tracer.toString()).toBe('evmdis');
        });

        test('creates OpCount instance', () => {
            const tracer = Tracer.of('opcount');
            expect(tracer).toBeInstanceOf(OpCount);
            expect(tracer.toString()).toBe('opcount');
        });

        test('creates Null instance', () => {
            const tracer = Tracer.of('null');
            expect(tracer).toBeInstanceOf(Null);
            expect(tracer.toString()).toBe('null');
        });

        test('throws error for invalid tracer name', () => {
            expect(() => Tracer.of('invalid')).toThrow(
                'TracerName invalid not found'
            );
        });
    });
});
