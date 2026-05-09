import { zodResolver } from "@hookform/resolvers/zod";
import type { DocPage } from "@presentation/docs-map";
import { docsService } from "@service/docs";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
	buildDocsTechnicalProblemPayload,
	type DocsTechnicalProblemFormValues,
	getTechnicalProblemFilesTotalSize,
	getTechnicalProblemFileValidationMessage,
	normalizeTechnicalProblemRejectionMessage,
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

const DOCS_TECHNICAL_PROBLEM_SUBMIT_ERROR_MESSAGE =
	"Nao foi possível registrar o problema técnico. Tente novamente em instantes.";
const DOCS_TECHNICAL_PROBLEM_SUBMIT_SUCCESS_MESSAGE =
	"Problema técnico registrado com sucesso.";

export const useDocTechnicalProblemForm = ({
	activeHeadingIds,
	currentDoc,
}: UseDocTechnicalProblemFormProps) => {
	const [attachmentError, setAttachmentError] = useState<string | null>(null);
	const [files, setFiles] = useState<File[]>([]);
	const form = useForm<DocsTechnicalProblemFormValues>({
		defaultValues,
		resolver: zodResolver(docsTechnicalProblemSchema),
	});
	const submitDocsTechnicalProblemMutation = useMutation({
		onError: () => {
			toast.error(DOCS_TECHNICAL_PROBLEM_SUBMIT_ERROR_MESSAGE);
		},
		onSuccess: () => {
			form.reset(defaultValues);
			setAttachmentError(null);
			setFiles([]);
			toast.success(DOCS_TECHNICAL_PROBLEM_SUBMIT_SUCCESS_MESSAGE);
		},
		mutationFn: docsService.submitTechnicalProblem,
		mutationKey: ["docs", "technical-problem", currentDoc.path],
	});

	const resetTechnicalProblemForm = () => {
		form.reset(defaultValues);
		setAttachmentError(null);
		setFiles([]);
		submitDocsTechnicalProblemMutation.reset();
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
		submitDocsTechnicalProblemMutation.reset();

		const payload = buildDocsTechnicalProblemPayload({
			activeHeadingIds,
			currentDoc,
			files,
			values,
		});

		await submitDocsTechnicalProblemMutation.mutateAsync(payload);
	});

	return {
		attachmentError,
		files,
		form,
		isSubmitting: submitDocsTechnicalProblemMutation.isPending,
		isSuccess: submitDocsTechnicalProblemMutation.isSuccess,
		onFileReject,
		onFileValidate,
		onFilesChange,
		onSubmit,
		resetTechnicalProblemForm,
	};
};
