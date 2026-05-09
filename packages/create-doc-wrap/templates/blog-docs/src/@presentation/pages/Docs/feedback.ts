import type { TableOfContentsItem } from "@presentation/components/docs/DocsTableOfContents";
import type { DocPage } from "@presentation/docs-map";

export type DocsFeedbackFormValues = {
	email: string;
	message: string;
	name: string;
	subject: string;
};

export type DocsFeedbackHeadingContext = TableOfContentsItem & {
	isActive: boolean;
};

export type DocsFeedbackPayload = {
	context: {
		activeHeadingIds: string[];
		docFilePath: string;
		docPath: string;
		docTitle: string;
		submittedAt: string;
	};
	email?: string;
	message: string;
	name?: string;
	subject: string;
};

type BuildDocsFeedbackPayloadInput = {
	activeHeadingIds: string[];
	currentDoc: Pick<DocPage, "filePath" | "path" | "title">;
	submittedAt?: string;
	tableOfContents: TableOfContentsItem[];
	values: DocsFeedbackFormValues;
};

const normalizeOptionalField = (value: string) => {
	const normalizedValue = value.trim();

	return normalizedValue;
};

export const buildDocsFeedbackPayload = ({
	activeHeadingIds,
	currentDoc,
	submittedAt = new Date().toISOString(),
	values,
}: BuildDocsFeedbackPayloadInput): DocsFeedbackPayload => ({
	context: {
		activeHeadingIds,
		docFilePath: currentDoc.filePath,
		docPath: currentDoc.path,
		docTitle: currentDoc.title,
		submittedAt,
	},
	email: normalizeOptionalField(values.email),
	message: values.message.trim(),
	name: normalizeOptionalField(values.name),
	subject: values.subject.trim(),
});
