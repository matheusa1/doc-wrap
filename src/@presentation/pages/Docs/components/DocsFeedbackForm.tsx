import { Alert, AlertTitle } from "@presentation/components/ui/alert";
import { Button } from "@presentation/components/ui/button";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@presentation/components/ui/field";
import { Input } from "@presentation/components/ui/input";
import { Textarea } from "@presentation/components/ui/textarea";
import type { UseFormReturn } from "react-hook-form";
import type { DocsFeedbackFormValues } from "../feedback";

type DocsFeedbackFormProps = {
	form: UseFormReturn<DocsFeedbackFormValues>;
	isSubmitting: boolean;
	isSuccess: boolean;
	onCancel: () => void;
	onSubmit: () => void;
};

export const DocsFeedbackForm: React.FC<DocsFeedbackFormProps> = ({
	form,
	isSubmitting,
	isSuccess,
	onCancel,
	onSubmit,
}) => {
	const {
		formState: { errors },
		register,
	} = form;

	return (
		<form className="contents" onSubmit={onSubmit}>
			<div className="space-y-5 px-6 pb-6">
				{isSuccess && (
					<Alert variant={"default"}>
						<AlertTitle>Feedback registrado</AlertTitle>
					</Alert>
				)}

				<FieldGroup>
					<Field data-invalid={Boolean(errors.subject)}>
						<FieldLabel htmlFor="docs-feedback-subject">Assunto</FieldLabel>
						<Input
							{...register("subject")}
							aria-invalid={Boolean(errors.subject)}
							id="docs-feedback-subject"
							placeholder="Ex.: trecho confuso ou informação faltando"
						/>
						<FieldError errors={[errors.subject]} />
					</Field>

					<Field data-invalid={Boolean(errors.message)}>
						<FieldLabel htmlFor="docs-feedback-message">Mensagem</FieldLabel>
						<Textarea
							{...register("message")}
							aria-invalid={Boolean(errors.message)}
							id="docs-feedback-message"
							placeholder="Conte o que funcionou bem ou o que precisa melhorar."
							rows={6}
						/>
						<FieldDescription>
							Seu feedback fica mais util quando voce descreve o contexto do
							problema.
						</FieldDescription>
						<FieldError errors={[errors.message]} />
					</Field>

					<Field data-invalid={Boolean(errors.name)}>
						<FieldLabel htmlFor="docs-feedback-name">Nome</FieldLabel>
						<Input
							{...register("name")}
							aria-invalid={Boolean(errors.name)}
							id="docs-feedback-name"
							placeholder="Opcional"
						/>
						<FieldError errors={[errors.name]} />
					</Field>

					<Field data-invalid={Boolean(errors.email)}>
						<FieldLabel htmlFor="docs-feedback-email">E-mail</FieldLabel>
						<Input
							{...register("email")}
							aria-invalid={Boolean(errors.email)}
							id="docs-feedback-email"
							placeholder="Opcional"
							type="email"
						/>
						<FieldError errors={[errors.email]} />
					</Field>
				</FieldGroup>
			</div>

			<div className="flex flex-col-reverse gap-2 border-t px-6 py-4 sm:flex-row sm:justify-end">
				<Button
					disabled={isSubmitting}
					onClick={onCancel}
					type="button"
					variant="ghost"
				>
					Cancelar
				</Button>
				<Button disabled={isSubmitting} type="submit">
					{isSubmitting ? "Enviando..." : "Enviar feedback"}
				</Button>
			</div>
		</form>
	);
};
