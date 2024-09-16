import { Hex, Txt } from '../../../src';

const CONTENT = Hex.of(
    Txt.of('Hello world - Здравствуйте - こんにちは!').bytes
);
const NO_CONTENT = Hex.of('0x');

export { CONTENT, NO_CONTENT };
