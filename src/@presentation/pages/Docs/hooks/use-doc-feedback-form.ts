import { zodResolver } from "@hookform/resolvers/zod";
import type { TableOfContentsItem } from "@presentation/components/docs/DocsTableOfContents";
import type { DocPage } from "@presentation/docs-map";
import { docsService } from "@service/docs";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import {
	buildDocsFeedbackPayload,
	type DocsFeedbackFormValues,
} from "../feedback";

const docsFeedbackSchema = z.object({
	email: z.union([z.literal(""), z.email("Informe um e-mail valido.").trim()]),
	message: z
		.string()
		.trim()
		.min(1, "Descreva o seu feedback.")
		.max(2000, "A mensagem deve ter no máximo 2000 caracteres."),
	name: z.string().trim().max(80, "O nome deve ter no máximo 80 caracteres."),
	subject: z
		.string()
		.trim()
		.min(1, "Informe o assunto do feedback.")
		.max(120, "O assunto deve ter no máximo 120 caracteres."),
});

type UseDocFeedbackFormProps = {
	activeHeadingIds: string[];
	currentDoc: Pick<DocPage, "filePath" | "path" | "title">;
	tableOfContents: TableOfContentsItem[];
};

const defaultValues: DocsFeedbackFormValues = {
	email: "",
	message: "",
	name: "",
	subject: "",
};

const DOCS_FEEDBACK_SUBMIT_ERROR_MESSAGE =
	"Nao foi possível registrar o feedback. Tente novamente em instantes.";
const DOCS_FEEDBACK_SUBMIT_SUCCESS_MESSAGE = "Feedback registrado com sucesso.";

export const useDocFeedbackForm = ({
	activeHeadingIds,
	currentDoc,
	tableOfContents,
}: UseDocFeedbackFormProps) => {
	const form = useForm<DocsFeedbackFormValues>({
		defaultValues,
		resolver: zodResolver(docsFeedbackSchema),
	});
	const submitDocsFeedbackMutation = useMutation({
		onError: () => {
			toast.error(DOCS_FEEDBACK_SUBMIT_ERROR_MESSAGE);
		},
		onSuccess: () => {
			form.reset(defaultValues);
			toast.success(DOCS_FEEDBACK_SUBMIT_SUCCESS_MESSAGE);
		},
		mutationFn: docsService.submitFeedback,
		mutationKey: ["docs", "feedback", currentDoc.path],
	});

	const resetFeedbackForm = () => {
		form.reset(defaultValues);
		submitDocsFeedbackMutation.reset();
	};

	const onSubmit = form.handleSubmit(async (values) => {
		submitDocsFeedbackMutation.reset();

		const payload = buildDocsFeedbackPayload({
			activeHeadingIds,
			currentDoc,
			tableOfContents,
			values,
		});

		await submitDocsFeedbackMutation.mutateAsync(payload);
	});

	return {
		form,
		isSubmitting: submitDocsFeedbackMutation.isPending,
		isSuccess: submitDocsFeedbackMutation.isSuccess,
		onSubmit,
		resetFeedbackForm,
	};
};
