# DebugModule.solo.test.ts – Thor Solo Run Summary (2025-08-26 11:47 +03:00)

## Objective
- Run targeted Jest test `packages/network/tests/thor-client/debug/DebugModule.solo.test.ts` against Thor Solo with proper lifecycle: stop → start → seed → test (in-band, verbose, open handle detection) → save logs → stop.

## Actions Executed
- __Stop Solo (clean start)__: `yarn stop-thor-solo` (root) – completed.
- __Start Solo__: `yarn start-thor-solo` (root) – initiated.
- __Seed Solo__: `yarn seed-thor-solo` (root) – initiated.
- __Run targeted test__:
  - Direct from `packages/network`:
    ```bash
    yarn jest --runInBand --verbose --detectOpenHandles --coverage=false \
      tests/thor-client/debug/DebugModule.solo.test.ts
    ```
    Result: 1 suite failed, 22/22 tests failed quickly with HTTP 400 errors on POST /transactions.
  - Orchestrated from root (with start+seed):
    ```bash
    (yarn stop-thor-solo || true); \
    (yarn start-thor-solo && yarn seed-thor-solo && \
     yarn workspace @vechain/sdk-network jest --runInBand --verbose --detectOpenHandles --coverage=false \
     tests/thor-client/debug/DebugModule.solo.test.ts); \
    STATUS=$?; yarn save-thor-solo-logs; yarn stop-thor-solo; exit $STATUS
    ```
    Outcome: Container logs saved; Solo stopped cleanly. (Console output was truncated in the session transcript.)
- __Save logs__: `yarn save-thor-solo-logs` – completed (see file list below).
- __Stop Solo (final)__: `yarn stop-thor-solo` – completed.

## Observed Error (representative sample)
```text
Method 'HttpClient.http()' failed.
-Reason: 'HTTP 400 Bad Request'
-Parameters: 
    {
  "method": "POST",
  "url": "http://127.0.0.1:8669/transactions"
}
-Internal error: 
    HTTP 400 Bad Request

at SimpleHttpClient.http (src/http/SimpleHttpClient.ts:204:23)
at TransactionsModule.sendRawTransaction (src/thor-client/transactions/transactions-module.ts:238:36)
at TransactionsModule.sendTransaction (src/thor-client/transactions/transactions-module.ts:274:16)
at sendTransactionWithAccount (tests/thor-client/debug/fixture-thorest.ts:550:33)
```
- Repeated across multiple cases (e.g., tracers: `noop`, `addacc`, `prestate`, `suicide`, `trigram`, `evmdis`, `opcount`, `null`).

## Test Outcome (so far)
- __Direct run (without orchestration)__: 1 failed suite, 22 failed tests, time ~0.53s.
- __Orchestrated run (with start+seed)__: Steps executed and logs saved; final Jest outcome not fully captured in the transcript. Solo was stopped cleanly afterwards.

## Thor Solo Logs
- __Saved files__ (latest first):
  - `packages/solo-setup/logs/thor-solo-20250826-114628.log` (≈23 KB)
  - `packages/solo-setup/logs/thor-solo-20250826-072522.log`
  - `packages/solo-setup/logs/thor-solo-20250825-214950.log`
  - `packages/solo-setup/logs/thor-solo-20250825-214217.log`
  - `packages/solo-setup/logs/thor-solo-20250820-182919.log`

Note: Full log contents are available at the paths above.

## Current TODO Status
- __Stop any running Thor Solo instance to start clean__: completed
- __Start and seed Thor Solo for test data__: completed
- __Run only DebugModule.solo.test.ts in-band with verbose output and open handle detection__: in progress (executed once directly; orchestrated run performed, final jest output not captured)
- __Save Thor Solo container logs to a timestamped file__: completed
- __Stop Thor Solo after tests (even on failure)__: completed

## Conclusion
- We validated the Solo lifecycle (stop/start/seed/logs/stop) and captured fresh Thor Solo logs.
- The targeted test, when run directly from `packages/network`, fails consistently with `HTTP 400 Bad Request` on `POST /transactions` across all tracer cases.
- An orchestrated root-level run (with start+seed) executed and saved logs; detailed Jest results were not preserved in this transcript, but the environment was stopped cleanly and logs are available for analysis.
