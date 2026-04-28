import type { DocPage } from "@presentation/docs-map";

export const TECHNICAL_PROBLEM_EVIDENCE_ACCEPT = "image/*,video/*";
export const TECHNICAL_PROBLEM_MAX_FILES = 5;
export const TECHNICAL_PROBLEM_MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024;
export const TECHNICAL_PROBLEM_MAX_TOTAL_SIZE_BYTES = 100 * 1024 * 1024;

export type DocsTechnicalProblemFormValues = {
	description: string;
};

export type DocsTechnicalProblemEvidence = {
	lastModified: number;
	name: string;
	size: number;
	type: string;
};

export type DocsTechnicalProblemPayload = {
	context: {
		activeHeadingIds: string[];
		docFilePath: string;
		docPath: string;
		docTitle: string;
		submittedAt: string;
	};
	description: string;
	evidenceFiles: File[];
	evidences: DocsTechnicalProblemEvidence[];
};

type BuildDocsTechnicalProblemPayloadInput = {
	activeHeadingIds: string[];
	currentDoc: Pick<DocPage, "filePath" | "path" | "title">;
	files: File[];
	submittedAt?: string;
	values: DocsTechnicalProblemFormValues;
};

export const formatTechnicalProblemFileSize = (bytes: number) => {
	const megabytes = bytes / 1024 / 1024;

	return `${megabytes.toLocaleString("pt-BR", {
		maximumFractionDigits: 0,
	})} MB`;
};

export const getTechnicalProblemFilesTotalSize = (files: File[]) =>
	files.reduce((totalSize, file) => totalSize + file.size, 0);

export const isTechnicalProblemEvidenceFile = (file: File) =>
	file.type.startsWith("image/") || file.type.startsWith("video/");

export const getTechnicalProblemFileValidationMessage = (
	file: File,
	currentFiles: File[],
) => {
	if (!isTechnicalProblemEvidenceFile(file)) {
		return "Anexe apenas imagens ou videos como evidência.";
	}

	if (file.size > TECHNICAL_PROBLEM_MAX_FILE_SIZE_BYTES) {
		return `Cada evidência deve ter no máximo ${formatTechnicalProblemFileSize(
			TECHNICAL_PROBLEM_MAX_FILE_SIZE_BYTES,
		)}.`;
	}

	const nextTotalSize =
		getTechnicalProblemFilesTotalSize(currentFiles) + file.size;

	if (nextTotalSize > TECHNICAL_PROBLEM_MAX_TOTAL_SIZE_BYTES) {
		return `O total dos anexos deve ser de no máximo ${formatTechnicalProblemFileSize(
			TECHNICAL_PROBLEM_MAX_TOTAL_SIZE_BYTES,
		)}.`;
	}

	return null;
};

export const normalizeTechnicalProblemRejectionMessage = (message: string) => {
	if (message.startsWith("Maximum")) {
		return `E possível anexar no máximo ${TECHNICAL_PROBLEM_MAX_FILES} evidências.`;
	}

	if (message === "File too large") {
		return `Cada evidência deve ter no máximo ${formatTechnicalProblemFileSize(
			TECHNICAL_PROBLEM_MAX_FILE_SIZE_BYTES,
		)}.`;
	}

	if (message === "File type not accepted") {
		return "Anexe apenas imagens ou videos como evidência.";
	}

	return message;
};

export const buildDocsTechnicalProblemPayload = ({
	activeHeadingIds,
	currentDoc,
	files,
	submittedAt = new Date().toISOString(),
	values,
}: BuildDocsTechnicalProblemPayloadInput): DocsTechnicalProblemPayload => ({
	context: {
		activeHeadingIds,
		docFilePath: currentDoc.filePath,
		docPath: currentDoc.path,
		docTitle: currentDoc.title,
		submittedAt,
	},
	description: values.description.trim(),
	evidenceFiles: files,
	evidences: files.map((file) => ({
		lastModified: file.lastModified,
		name: file.name,
		size: file.size,
		type: file.type,
	})),
});

export const submitDocsTechnicalProblem = async (
	payload: DocsTechnicalProblemPayload,
) => {
	await Promise.resolve();
	console.info("Docs technical problem submitted", payload);
};
