/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler deploy src/index.ts --name my-worker` to deploy your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { clauseBuilder, networkInfo, secp256k1, TransactionHandler, TransactionUtils } from "@vechain/sdk-core";

export interface Env {
	// Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
	// MY_KV_NAMESPACE: KVNamespace;
	//
	// Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
	// MY_DURABLE_OBJECT: DurableObjectNamespace;
	//
	// Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
	// MY_BUCKET: R2Bucket;
	//
	// Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
	// MY_SERVICE: Fetcher;
}

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		const clauses = [
			clauseBuilder.transferVET(
				'0x7567d83b7b8d80addcb281a71d54fc7b3364ffed', 0
			)
		];

		// 2 - Calculate intrinsic gas of clauses
		const gas = TransactionUtils.intrinsicGas(clauses);

		// 3 - Body of transaction
		const body = {
			chainTag: networkInfo.mainnet.chainTag,
			blockRef: '0x0000000000000000',
			expiration: 0,
			clauses,
			gasPriceCoef: 128,
			gas,
			dependsOn: null,
			nonce: 12345678
		};

		// Create private key
		const privateKey = secp256k1.generatePrivateKey();

		// 4 - Sign transaction
		const signedTransaction = TransactionHandler.sign(
			body,
			Buffer.from(privateKey)
		);

		// 5 - Encode transaction
		const encodedRaw = signedTransaction.encoded;

		// 6 - Decode transaction
		const decodedTx = TransactionHandler.decode(encodedRaw, true);
		return new Response(JSON.stringify(decodedTx))
	},
};
