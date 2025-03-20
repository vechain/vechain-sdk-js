import { afterEach, beforeEach, describe, test } from '@jest/globals';
import { MozillaWebSocketClient } from '../../src/ws/MozillaWebSocketClient';
import log from 'loglevel';

const logger = log.getLogger(
    'TEST:UNIT!packages/thorest/tests/ws/MozillaWebSocketClient.solo.test.ts'
);

describe('MozillaWebSocketClient solo tests', () => {
    let wsc: MozillaWebSocketClient;
    beforeEach(() => {
        wsc = new MozillaWebSocketClient('ws://localhost:8669');
    });

    test('data <- open', (done) => {
        wsc.addListener({
            onClose: () => {},
            onError: () => {},
            onMessage: (message) => {
                logger.debug(message.data);
                done();
            },
            onOpen: () => {}
        }).open({
            path: '/subscriptions/beat2'
        });
    }, 30000);

    afterEach(() => {
        wsc.close();
    });
});
