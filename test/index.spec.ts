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
	it('rejects a bad email', async () => {
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
		const ctx = createExecutionContext();
		const result = await worker.email(badEmail, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(result).toMatchInlineSnapshot(OctomailerWorkerOutcome.rejected);
	});

	it('forwards a good email', async () => {
		let goodEmail: ForwardableEmailMessage = {
			from: "test@willswire.com",
			to: "feedback@afiexplorer.com",
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
		const ctx = createExecutionContext();
		const result = await worker.email(goodEmail, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(result).toMatchInlineSnapshot(OctomailerWorkerOutcome.rejected);
	});
});
