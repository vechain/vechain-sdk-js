import { FPN } from '../../../src';
import { Units, Wei } from '../../../src/vcdm/currency';
import * as console from 'node:console';

describe('Units namespace tests', () => {
    describe('formatUnits method tests', () => {
        test('x', () => {
            const fpn = FPN.of('1000000000000000000', 0n);
            const str = fpn.div(FPN.of(10n ** 15n, 0n));
            console.log(str.toString());
        });
    });

    describe('parseUnits method tests', () => {
        test('x', () => {
            const sf = FPN.of(10n ** 18n, 0n);
            const eth = FPN.of('0.000000001', 18n);
            const r = eth.times(sf);
            const w = Wei.of(r.bi);
            console.log(w.bi);
        });

        test('wei', () => {
            const wei = Units.parseUnits('121.0', Units.gwei);
            console.log(wei.toString());
        });

        test('vet', () => {
            const wei = Units.parseVET('1');
            console.log(wei.toString());
        });
    });
});
