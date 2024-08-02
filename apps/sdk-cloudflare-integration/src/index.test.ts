import { describe, expect, it } from 'vitest';
import { SELF } from 'cloudflare:test';
import '../src';

describe('Worker', () => {
    it('should sign a transaction)', async () => {
        const response = await SELF.fetch('http://example.com/?a=3&b=4');
        expect(await response.text()).toBe('Hello World!');
    });
})
