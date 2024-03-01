import { describe, expect, test } from '@jest/globals';
import { ErrorsCodeAndClassesMapsFixture } from '../../fixture';
import { assert } from '../../../src';

/**
 * Assertion error handler test
 * @group unit/errors/utils/assert
 */
describe('Assertion test', () => {
    /**
     * Verify all error codes and classes
     */
    ErrorsCodeAndClassesMapsFixture.forEach((errorType) => {
        /**
         * Test for each model
         */
        test(`Verify all error codes and classes for ${errorType.name}`, () => {
            /**
             * Assert for each error code and class
             */
            errorType.elements.forEach((element) => {
                expect(() => {
                    assert('test', false, element.errorCode, 'SOME_MESSAGE');
                }).toThrowError(element.classExpected);
            });
        });
    });
});
