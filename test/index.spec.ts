// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

enum OctomailerWorkerOutcome {
	success,
	failure,
	rejected
}

describe('Octomailer worker', () => {
	it('rejects an email', async () => {
		let badEmail: ForwardableEmailMessage = {
			from: "test@willswire.com",
			to: "badjuju@afiexplorer.com",
			raw: new ReadableStream(),
			headers: new Headers(),
			rawSize: 10,
			setReject(reason) {
				console.log(`Rejected because ${reason}`)
			},
			forward(rcptTo, headers) {
				console.log(`Forwarding to ${rcptTo}`)
				return Promise.resolve();
			},
		};
		// Create an empty context to pass to `worker.fetch()`.
		const ctx = createExecutionContext();
		const result = await worker.email(badEmail, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);
		expect(await result).toMatchInlineSnapshot(OctomailerWorkerOutcome.rejected);
	});

	// it('responds with Hello World! (integration style)', async () => {
	// 	const response = await SELF.fetch('https://example.com');
	// 	expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
	// });
});
