import type { DocsFeedbackPayload } from "@presentation/pages/Docs/feedback";
import type { DocsTechnicalProblemPayload } from "@presentation/pages/Docs/technical-problem";

const submitFeedback = async (payload: DocsFeedbackPayload) => {
	await new Promise((promise) => {
		setTimeout(promise, 2000);
	});
	console.info(payload);
};

const submitTechnicalProblem = async (payload: DocsTechnicalProblemPayload) => {
	await new Promise((promise) => {
		setTimeout(promise, 2000);
	});
	console.info(payload);
};

export const docsService = {
	submitFeedback,
	submitTechnicalProblem,
};
