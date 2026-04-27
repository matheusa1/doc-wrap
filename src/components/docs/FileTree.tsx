import { FileText, Folder, FolderOpen } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type FileTreeRootProps = ComponentPropsWithoutRef<"div"> & {
	children: ReactNode;
};

type FileTreeFolderProps = ComponentPropsWithoutRef<"div"> & {
	active?: boolean;
	children?: ReactNode;
	defaultOpen?: boolean;
	description?: string;
	name: string;
};

type FileTreeFileProps = ComponentPropsWithoutRef<"div"> & {
	active?: boolean;
	description?: string;
	name: string;
};

type TFileTreeItemContent = {
	active?: boolean;
	description?: string;
	icon: ReactNode;
	name: string;
};

const FileTreeRoot: React.FC<FileTreeRootProps> = (props) => {
	const { children, className, ...rest } = props;
	return (
		<div
			className={cn(
				"my-6 overflow-x-auto rounded-2xl border bg-card p-3 text-card-foreground shadow-sm",
				className,
			)}
			{...rest}
		>
			<div className="min-w-max font-mono text-sm">{children}</div>
		</div>
	);
};

const FileTreeItemContent: React.FC<TFileTreeItemContent> = (props) => {
	const { active, description, icon, name } = props;
	return (
		<div
			className={cn(
				"flex items-start gap-2 rounded-lg px-2 py-1.5",
				active && "bg-secondary text-secondary-foreground",
			)}
		>
			<span className="mt-0.5 shrink-0 text-muted-foreground [&_svg]:size-4">
				{icon}
			</span>
			<span className="min-w-0">
				<span className="block font-medium text-foreground leading-5">
					{name}
				</span>
				{description ? (
					<span className="block font-sans text-muted-foreground text-xs leading-5">
						{description}
					</span>
				) : null}
			</span>
		</div>
	);
};

const FileTreeFolder: React.FC<FileTreeFolderProps> = (props) => {
	const {
		active,
		children,
		className,
		defaultOpen: _defaultOpen,
		description,
		name,
		...rest
	} = props;
	const icon = children ? <FolderOpen /> : <Folder />;

	return (
		<div className={cn("file-tree-folder", className)} {...rest}>
			<FileTreeItemContent
				active={active}
				description={description}
				icon={icon}
				name={name}
			/>
			{children ? (
				<div className="ml-4 border-border/70 border-l pl-3">{children}</div>
			) : null}
		</div>
	);
};

const FileTreeFile: React.FC<FileTreeFileProps> = (props) => {
	const { active, className, description, name, ...rest } = props;
	return (
		<div className={cn("file-tree-file", className)} {...rest}>
			<FileTreeItemContent
				active={active}
				description={description}
				icon={<FileText />}
				name={name}
			/>
		</div>
	);
};

export const FileTree = Object.assign(FileTreeRoot, {
	File: FileTreeFile,
	Folder: FileTreeFolder,
});
