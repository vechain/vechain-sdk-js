import { describe, expect, test } from '@jest/globals';
import { assertInput } from '../src';
import { ErrorsCodeAndClassesMapsFixture } from './fixture';

/**
 * Assertion error handler test
 * @group unit/errors/assertion
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
                    assertInput(false, element.errorCode, 'SOME_MESSAGE');
                }).toThrowError(element.classExpected);
            });
        });
    });
});
