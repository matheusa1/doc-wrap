import { zodResolver } from "@hookform/resolvers/zod";
import type { DocPage } from "@presentation/docs-map";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
	buildDocsTechnicalProblemPayload,
	type DocsTechnicalProblemFormValues,
	getTechnicalProblemFilesTotalSize,
	getTechnicalProblemFileValidationMessage,
	normalizeTechnicalProblemRejectionMessage,
	submitDocsTechnicalProblem,
	TECHNICAL_PROBLEM_MAX_FILES,
	TECHNICAL_PROBLEM_MAX_TOTAL_SIZE_BYTES,
} from "../technical-problem";

const docsTechnicalProblemSchema = z.object({
	description: z
		.string()
		.trim()
		.min(1, "A descrição do problema é obrigatória.")
		.max(2000, "A descrição deve ter no máximo 2000 caracteres."),
});

type UseDocTechnicalProblemFormProps = {
	activeHeadingIds: string[];
	currentDoc: Pick<DocPage, "filePath" | "path" | "title">;
};

const defaultValues: DocsTechnicalProblemFormValues = {
	description: "",
};

export const useDocTechnicalProblemForm = ({
	activeHeadingIds,
	currentDoc,
}: UseDocTechnicalProblemFormProps) => {
	const [attachmentError, setAttachmentError] = useState<string | null>(null);
	const [files, setFiles] = useState<File[]>([]);
	const [isSuccess, setIsSuccess] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);
	const form = useForm<DocsTechnicalProblemFormValues>({
		defaultValues,
		resolver: zodResolver(docsTechnicalProblemSchema),
	});

	const resetTechnicalProblemForm = () => {
		form.reset(defaultValues);
		setAttachmentError(null);
		setFiles([]);
		setIsSuccess(false);
		setSubmitError(null);
	};

	const onFilesChange = (nextFiles: File[]) => {
		if (nextFiles.length > TECHNICAL_PROBLEM_MAX_FILES) {
			setAttachmentError(
				`É possível anexar no máximo ${TECHNICAL_PROBLEM_MAX_FILES} evidências.`,
			);
			setFiles((currentFiles) => [...currentFiles]);
			return;
		}

		if (
			getTechnicalProblemFilesTotalSize(nextFiles) >
			TECHNICAL_PROBLEM_MAX_TOTAL_SIZE_BYTES
		) {
			setAttachmentError("O total dos anexos deve ser de no máximo 100 MB.");
			setFiles((currentFiles) => [...currentFiles]);
			return;
		}

		setFiles(nextFiles);
		setAttachmentError(null);
	};

	const onFileValidate = (file: File) =>
		getTechnicalProblemFileValidationMessage(file, files);

	const onFileReject = (_file: File, message: string) => {
		setAttachmentError(normalizeTechnicalProblemRejectionMessage(message));
	};

	const onSubmit = form.handleSubmit(async (values) => {
		setIsSuccess(false);
		setSubmitError(null);

		try {
			const payload = buildDocsTechnicalProblemPayload({
				activeHeadingIds,
				currentDoc,
				files,
				values,
			});

			await submitDocsTechnicalProblem(payload);

			form.reset(defaultValues);
			setAttachmentError(null);
			setFiles([]);
			setIsSuccess(true);
		} catch {
			setSubmitError(
				"Nao foi possível registrar o problema técnico. Tente novamente em instantes.",
			);
		}
	});

	return {
		attachmentError,
		files,
		form,
		isSubmitting: form.formState.isSubmitting,
		isSuccess,
		onFileReject,
		onFileValidate,
		onFilesChange,
		onSubmit,
		resetTechnicalProblemForm,
		submitError,
	};
};
