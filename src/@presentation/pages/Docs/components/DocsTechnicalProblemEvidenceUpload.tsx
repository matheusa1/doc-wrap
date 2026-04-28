import { Button } from "@presentation/components/ui/button";
import {
	FileUpload,
	FileUploadDropzone,
	FileUploadItem,
	FileUploadItemDelete,
	FileUploadItemMetadata,
	FileUploadItemPreview,
	FileUploadList,
	FileUploadTrigger,
} from "@presentation/components/ui/file-upload";
import { UploadCloudIcon, XIcon } from "lucide-react";
import {
	formatTechnicalProblemFileSize,
	TECHNICAL_PROBLEM_EVIDENCE_ACCEPT,
	TECHNICAL_PROBLEM_MAX_FILE_SIZE_BYTES,
	TECHNICAL_PROBLEM_MAX_FILES,
} from "../technical-problem";

type DocsTechnicalProblemEvidenceUploadProps = {
	disabled: boolean;
	files: File[];
	invalid: boolean;
	onFileReject: (file: File, message: string) => void;
	onFileValidate: (file: File) => string | null;
	onFilesChange: (files: File[]) => void;
};

export const DocsTechnicalProblemEvidenceUpload: React.FC<
	DocsTechnicalProblemEvidenceUploadProps
> = ({
	disabled,
	files,
	invalid,
	onFileReject,
	onFileValidate,
	onFilesChange,
}) => {
	return (
		<FileUpload
			accept={TECHNICAL_PROBLEM_EVIDENCE_ACCEPT}
			disabled={disabled}
			invalid={invalid}
			label="Evidências do problema técnico"
			maxFiles={TECHNICAL_PROBLEM_MAX_FILES}
			maxSize={TECHNICAL_PROBLEM_MAX_FILE_SIZE_BYTES}
			multiple
			onFileReject={onFileReject}
			onFileValidate={onFileValidate}
			onValueChange={onFilesChange}
			value={files}
		>
			<FileUploadDropzone className="min-h-40">
				<div className="flex flex-col items-center gap-1 text-center">
					<div className="flex items-center justify-center rounded-full border p-2.5 text-muted-foreground">
						<UploadCloudIcon />
					</div>
					<p className="font-medium text-sm">Arraste imagens ou videos aqui</p>
					<p className="max-w-sm text-muted-foreground text-xs">
						Ou selecione ate {TECHNICAL_PROBLEM_MAX_FILES} evidências, com{" "}
						{formatTechnicalProblemFileSize(
							TECHNICAL_PROBLEM_MAX_FILE_SIZE_BYTES,
						)}{" "}
						por arquivo.
					</p>
				</div>

				<FileUploadTrigger asChild>
					<Button disabled={disabled} size="sm" variant="outline">
						<UploadCloudIcon data-icon="inline-start" />
						Selecionar evidências
					</Button>
				</FileUploadTrigger>
			</FileUploadDropzone>

			<FileUploadList>
				{files.map((file) => (
					<FileUploadItem
						key={`${file.name}-${file.size}-${file.lastModified}`}
						value={file}
					>
						<FileUploadItemPreview />
						<FileUploadItemMetadata />
						<FileUploadItemDelete asChild>
							<Button disabled={disabled} size="icon-sm" variant="ghost">
								<XIcon />
								<span className="sr-only">Remover {file.name}</span>
							</Button>
						</FileUploadItemDelete>
					</FileUploadItem>
				))}
			</FileUploadList>
		</FileUpload>
	);
};
