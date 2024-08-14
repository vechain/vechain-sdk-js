import { describe, expect, it } from 'vitest';
import { SELF } from 'cloudflare:test';

describe('Worker', () => {
    it('should sign a transaction)', async () => {
        const response = await SELF.fetch('http://example.com');
        expect(await response.text()).contains('blockRef');
    });
})