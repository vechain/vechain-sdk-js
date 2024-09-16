import { type FPN } from '../FPN';
import { type Txt } from '../Txt';
import { type VeChainDataModel } from '../VeChainDataModel';

export interface Currency extends VeChainDataModel<Currency> {
    get code(): Txt;

    get value(): FPN;
}
