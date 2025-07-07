import { type FixedPointNumber } from '../FixedPointNumber';
import { type Txt } from '../Txt';
import { type VeChainDataModel } from '../VeChainDataModel';

/**
 * Interface representing the properties for currency implementation
 * that extends from VeChainDataModel.
 *
 * @interface Currency
 * @extends {VeChainDataModel<Currency>}
 */
export interface Currency extends VeChainDataModel<Currency> {
    /**
     * Return the code as a Txt object.
     *
     * @return {Txt} The code object
     *
     * @remarks Since currency codes likely use Unicode composite symbols,
     * {@link Txt} type enforce the reresentation of the code is normalized.
     */
    get code(): Txt;

    /**
     * Return the current value as an FixedPointNumber (Fixed-Point Number).
     *
     * @return {FixedPointNumber} The current value in Fixed-Point Number format.
     */
    get value(): FixedPointNumber;
}
