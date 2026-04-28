import { zodResolver } from "@hookform/resolvers/zod";
import type { TableOfContentsItem } from "@presentation/components/docs/DocsTableOfContents";
import type { DocPage } from "@presentation/docs-map";
import { useState } from "react";
import { useForm } from "react-hook-form";
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

export const useDocFeedbackForm = ({
	activeHeadingIds,
	currentDoc,
	tableOfContents,
}: UseDocFeedbackFormProps) => {
	const [isSuccess, setIsSuccess] = useState(false);
	const form = useForm<DocsFeedbackFormValues>({
		defaultValues,
		resolver: zodResolver(docsFeedbackSchema),
	});

	const resetFeedbackForm = () => {
		form.reset(defaultValues);
		setIsSuccess(false);
	};

	const onSubmit = form.handleSubmit(async (values) => {
		setIsSuccess(false);

		const payload = buildDocsFeedbackPayload({
			activeHeadingIds,
			currentDoc,
			tableOfContents,
			values,
		});

		await Promise.resolve();
		console.info("Docs feedback submitted", payload);

		form.reset(defaultValues);
		setIsSuccess(true);
	});

	return {
		form,
		isSubmitting: form.formState.isSubmitting,
		isSuccess,
		onSubmit,
		resetFeedbackForm,
	};
};
