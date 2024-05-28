// src/index.ts

enum OctomailerWorkerOutcome {
	success,
	failure,
	rejected
}

export default {
	async email(message: ForwardableEmailMessage, env: Env, ctx: ExecutionContext): Promise<OctomailerWorkerOutcome> {
		try {
			switch (message.to) {
				case "feedback@afiexplorer.com":
					await fetch("https://octogram/api", {
						body: `What is up homie? From ${message.from}, with subject of :${message.headers.get('subject')}`
					});
					await message.forward("w_walker@icloud.com");
					return OctomailerWorkerOutcome.success
				default:
					message.setReject("Unkown address")
					return OctomailerWorkerOutcome.rejected
			}
		} catch (e: any) {
			console.log(e.message) // errors
			return OctomailerWorkerOutcome.failure
		}
	},
};
