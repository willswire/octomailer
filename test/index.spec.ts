// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

function stringToReadableStream(str: string): ReadableStream<Uint8Array> {
	const encoder = new TextEncoder();
	const uint8Array = encoder.encode(str);

	return new ReadableStream({
		start(controller) {
		controller.enqueue(uint8Array);
		controller.close();
		}
	});
}

let exampleEmail: ForwardableEmailMessage = {
	from: "test@willswire.com",
	to: "octomailer@afiexplorer.com",
	raw: stringToReadableStream("Hello World!"),
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

describe('Octomailer worker', () => {
	it('creates a GitHub issue', async () => {
		// Create an empty context to pass to `worker.email()`.
		const ctx = createExecutionContext();
		const response = await worker.email(exampleEmail, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);

		// TODO: query GitHub API with issue number to verify the creation of an email
		
		// expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
	});
});
