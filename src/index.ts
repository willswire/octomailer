// src/index.ts

enum OctomailerWorkerOutcome {
	success,
	failure,
	rejected,
	fallback
}

export default {
	async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext): Promise<OctomailerWorkerOutcome> {
		try {
			const user = env.GITHUB_USERNAME;
			const repo = env.GITHUB_REPO;
			const token = env.GITHUB_TOKEN;

			if (message.to === "feedback@afiexplorer.com") {
				const issueTitle = message.headers.get('subject');
				const issueBody = `Email from: ${message.from}\n\n${message.raw}`;

				// Create GitHub issue
				const response = await fetch(`https://api.github.com/repos/${user}/${repo}/issues`, {
					method: 'POST',
					headers: {
						'Authorization': `token ${token}`,
						'Accept': 'application/vnd.github.v3+json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						title: issueTitle,
						body: issueBody
					})
				});

				if (!response.ok) {
					const errorBody = await response.json();
					throw new Error(`GitHub API response status: ${response.status}, message: ${errorBody}`);
				}

				return OctomailerWorkerOutcome.success;
			} else {
				message.setReject("Unknown address");
				return OctomailerWorkerOutcome.rejected;
			}
		} catch (e: any) {
			console.log(`Error: ${e.message}`);
			try {
				await message.forward("w_walker@icloud.com");
				return OctomailerWorkerOutcome.fallback;
			} catch (forwardError: any) {
				console.log(`Forwarding error: ${forwardError.message}`);
			}
			return OctomailerWorkerOutcome.failure;
		}
	},
};