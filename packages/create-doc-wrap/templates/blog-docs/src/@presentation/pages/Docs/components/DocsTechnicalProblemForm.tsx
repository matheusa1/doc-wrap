import { Button } from "@presentation/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@presentation/components/ui/field";
import { Separator } from "@presentation/components/ui/separator";
import { Textarea } from "@presentation/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";
import type { DocsTechnicalProblemFormValues } from "../technical-problem";
import { DocsTechnicalProblemEvidenceUpload } from "./DocsTechnicalProblemEvidenceUpload";

type DocsTechnicalProblemFormProps = {
	attachmentError: string | null;
	files: File[];
	form: UseFormReturn<DocsTechnicalProblemFormValues>;
	isSubmitting: boolean;
	onCancel: () => void;
	onFileReject: (file: File, message: string) => void;
	onFileValidate: (file: File) => string | null;
	onFilesChange: (files: File[]) => void;
	onSubmit: () => void;
};

export const DocsTechnicalProblemForm: React.FC<
	DocsTechnicalProblemFormProps
> = ({
	attachmentError,
	files,
	form,
	isSubmitting,
	onCancel,
	onFileReject,
	onFileValidate,
	onFilesChange,
	onSubmit,
}) => {
	const {
		formState: { errors },
		register,
	} = form;

	return (
		<form className="contents" onSubmit={onSubmit}>
			<div className="flex max-h-[min(68svh,42rem)] flex-col gap-5 overflow-y-auto px-6 pb-6">
				<FieldGroup>
					<Field data-invalid={Boolean(errors.description)}>
						<FieldLabel htmlFor="docs-technical-problem-description">
							Descrição do problema
						</FieldLabel>
						<Textarea
							{...register("description")}
							aria-invalid={Boolean(errors.description)}
							id="docs-technical-problem-description"
							placeholder="Descreva o que aconteceu, o que voce esperava e como reproduzir o problema."
							rows={6}
						/>
						<FieldDescription>
							A descrição ajuda o time a entender o contexto e priorizar a
							análise.
						</FieldDescription>
						<FieldError errors={[errors.description]} />
					</Field>

					<Field data-invalid={Boolean(attachmentError)}>
						<FieldLabel>Evidências</FieldLabel>
						<DocsTechnicalProblemEvidenceUpload
							disabled={isSubmitting}
							files={files}
							invalid={Boolean(attachmentError)}
							onFileReject={onFileReject}
							onFileValidate={onFileValidate}
							onFilesChange={onFilesChange}
						/>
						<FieldDescription>
							Anexe imagens ou videos que mostrem a falha. Os anexos são
							opcionais.
						</FieldDescription>
						<FieldError>{attachmentError}</FieldError>
					</Field>
				</FieldGroup>
			</div>

			<Separator />

			<div className="flex flex-col-reverse gap-2 px-6 py-4 sm:flex-row sm:justify-end">
				<Button
					disabled={isSubmitting}
					onClick={onCancel}
					type="button"
					variant="ghost"
				>
					Cancelar
				</Button>
				<Button disabled={isSubmitting} type="submit">
					{isSubmitting ? "Enviando..." : "Registrar problema"}
				</Button>
			</div>
		</form>
	);
};
