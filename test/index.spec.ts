// test/index.spec.ts
import { env, createExecutionContext, waitOnExecutionContext } from 'cloudflare:test';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import worker from '../src/index';
import { Octokit } from '@octokit/core';

declare module 'cloudflare:test' {
	interface ProvidedEnv extends Env {}
}

function stringToReadableStream(str: string): ReadableStream<Uint8Array> {
	const encoder = new TextEncoder();
	const uint8Array = encoder.encode(str);

	return new ReadableStream({
		start(controller) {
			controller.enqueue(uint8Array);
			controller.close();
		},
	});
}

let exampleEmail: ForwardableEmailMessage = {
	from: 'test@willswire.com',
	to: 'octomailer@afiexplorer.com',
	raw: stringToReadableStream('Hello World!'),
	headers: new Headers(),
	rawSize: 10,
	setReject(reason) {
		console.log(`Rejected because ${reason}`);
	},
	forward(rcptTo, headers) {
		console.log(`Forwarding to ${rcptTo}`);
		return Promise.resolve();
	},
};

describe('Octomailer worker', () => {
	let octokit: Octokit;
	let issueNumber: number;

	beforeAll(() => {
		octokit = new Octokit({
			auth: env.GITHUB_TOKEN,
		});
	});

	it('creates a GitHub issue', async () => {
		// Create an empty context to pass to `worker.email()`.
		const ctx = createExecutionContext();
		await worker.email(exampleEmail, env, ctx);
		// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
		await waitOnExecutionContext(ctx);

		// Verify the creation of the GitHub issue
		const issues = await octokit.request('GET /repos/{owner}/{repo}/issues', {
			owner: env.GITHUB_USERNAME,
			repo: env.GITHUB_REPO,
			labels: 'feedback',
		});

		// Find the issue with the expected title
		const createdIssue = issues.data.find((issue) => issue.title === 'User feedback' && issue.body === 'Hello World!');
		expect(createdIssue).toBeDefined();
		if (createdIssue) {
			issueNumber = createdIssue.number;
		}
	});

	afterAll(async () => {
		if (issueNumber) {
			// Close the created issue to keep the repo clean
			await octokit.request('PATCH /repos/{owner}/{repo}/issues/{issue_number}', {
				owner: env.GITHUB_USERNAME,
				repo: env.GITHUB_REPO,
				issue_number: issueNumber,
				state: 'closed',
			});
		}
	});
});
