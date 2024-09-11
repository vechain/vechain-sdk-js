import { type Txt } from '../Txt';

export interface Currency<V> {
    get code(): Txt;

    get value(): V;
}
