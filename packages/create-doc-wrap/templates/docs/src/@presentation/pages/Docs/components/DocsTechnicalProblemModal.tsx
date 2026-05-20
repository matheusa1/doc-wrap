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
import { useDocTechnicalProblemForm } from "../hooks/use-doc-technical-problem-form";
import { DocsTechnicalProblemButton } from "./DocsTechnicalProblemButton";
import { DocsTechnicalProblemForm } from "./DocsTechnicalProblemForm";

type DocsTechnicalProblemModalProps = {
	activeHeadingIds: string[];
	currentDoc: Pick<DocPage, "filePath" | "path" | "title">;
};

export const DocsTechnicalProblemModal: React.FC<
	DocsTechnicalProblemModalProps
> = ({ activeHeadingIds, currentDoc }) => {
	const [open, setOpen] = useState(false);
	const {
		attachmentError,
		files,
		form,
		isSubmitting,
		isSuccess,
		onFileReject,
		onFileValidate,
		onFilesChange,
		onSubmit,
		resetTechnicalProblemForm,
	} = useDocTechnicalProblemForm({
		activeHeadingIds,
		currentDoc,
	});

	useEffect(() => {
		if (!isSuccess) {
			return;
		}

		setOpen(false);
		resetTechnicalProblemForm();
	}, [isSuccess, resetTechnicalProblemForm]);

	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen);

		if (!nextOpen) {
			resetTechnicalProblemForm();
		}
	};

	return (
		<Dialog onOpenChange={handleOpenChange} open={open}>
			<DialogTrigger render={<DocsTechnicalProblemButton />}>
				Informar problema técnico
			</DialogTrigger>
			<DialogContent className="max-h-[calc(100svh-2rem)] overflow-hidden sm:max-w-2xl">
				<DialogHeader>
					<DialogTitle>Informar problema técnico</DialogTitle>
					<DialogDescription>
						Descreva a falha encontrada na documentação e anexe imagens ou
						videos que ajudem na análise.
					</DialogDescription>
				</DialogHeader>
				<DocsTechnicalProblemForm
					attachmentError={attachmentError}
					files={files}
					form={form}
					isSubmitting={isSubmitting}
					onCancel={() => handleOpenChange(false)}
					onFileReject={onFileReject}
					onFileValidate={onFileValidate}
					onFilesChange={onFilesChange}
					onSubmit={onSubmit}
				/>
			</DialogContent>
		</Dialog>
	);
};
