import type { TableOfContentsItem } from "@presentation/components/docs/DocsTableOfContents";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@presentation/components/ui/dialog";
import type { DocPage } from "@presentation/docs-map";
import { useEffect, useState } from "react";
import { useDocFeedbackForm } from "../hooks/use-doc-feedback-form";
import { DocsFeedbackButton } from "./DocsFeedbackButton";
import { DocsFeedbackForm } from "./DocsFeedbackForm";

type DocsFeedbackModalProps = {
	activeHeadingIds: string[];
	currentDoc: Pick<DocPage, "filePath" | "path" | "title">;
	tableOfContents: TableOfContentsItem[];
};

export const DocsFeedbackModal: React.FC<DocsFeedbackModalProps> = ({
	activeHeadingIds,
	currentDoc,
	tableOfContents,
}) => {
	const [open, setOpen] = useState(false);
	const { form, isSubmitting, isSuccess, onSubmit, resetFeedbackForm } =
		useDocFeedbackForm({
			activeHeadingIds,
			currentDoc,
			tableOfContents,
		});

	useEffect(() => {
		if (!isSuccess) {
			return;
		}

		const timeoutId = globalThis.setTimeout(() => {
			setOpen(false);
			resetFeedbackForm();
		}, 1200);

		return () => globalThis.clearTimeout(timeoutId);
	}, [isSuccess, resetFeedbackForm]);

	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen);

		if (!nextOpen) {
			resetFeedbackForm();
		}
	};

	return (
		<Dialog onOpenChange={handleOpenChange} open={open}>
			<DialogTrigger render={<DocsFeedbackButton />}>
				Enviar feedback
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Enviar feedback sobre esta página</DialogTitle>
					<DialogDescription>
						Use este formulário para relatar dúvidas, inconsistências ou
						sugestões sobre o documento atual.
					</DialogDescription>
				</DialogHeader>
				<DocsFeedbackForm
					form={form}
					isSubmitting={isSubmitting}
					isSuccess={isSuccess}
					onCancel={() => handleOpenChange(false)}
					onSubmit={onSubmit}
				/>
			</DialogContent>
		</Dialog>
	);
};
