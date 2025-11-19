"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const cloudflare_test_1 = require("cloudflare:test");
(0, vitest_1.describe)('Worker', () => {
    (0, vitest_1.it)('should sign a transaction)', async () => {
        const response = await cloudflare_test_1.SELF.fetch('http://example.com');
        (0, vitest_1.expect)(await response.text()).contains('blockRef');
    });
});
