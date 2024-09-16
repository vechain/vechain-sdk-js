import { type FPN } from '../FPN';
import { type Txt } from '../Txt';

export interface Currency {
    get code(): Txt;

    get value(): FPN;
}
