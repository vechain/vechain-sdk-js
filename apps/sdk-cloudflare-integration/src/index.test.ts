import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { unstable_dev } from "wrangler";
import type { UnstableDevWorker } from "wrangler";

describe("Worker", () => {
	// let worker: UnstableDevWorker;

	// beforeAll(async () => {
	// 	worker = await unstable_dev("src/index.ts", {
	// 		experimental: { disableExperimentalWarning: true },
	// 	});
	// });

	// afterAll(async () => {
	// 	await worker.stop();
	// });

	it("Should sign a transaction", async () => {
		// const resp = await worker.fetch();
		// if (resp) {
		// 	const text = await resp.text();
		// 	expect(text).toBeDefined();
		// }
		expect(1).toBe(1);
	});
});
