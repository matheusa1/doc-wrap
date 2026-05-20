import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@presentation/components/ui/table.tsx";
import { cn } from "@presentation/lib/utils";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

export type DataTableAlign = "center" | "left" | "right";

export type DataTableRow = Record<string, ReactNode>;

export type DataTableColumn = {
	align?: DataTableAlign;
	cellClassName?: string;
	header: ReactNode;
	headerClassName?: string;
	key: string;
	render?: (row: DataTableRow, index: number) => ReactNode;
};

export type DataTableProps = ComponentPropsWithoutRef<"div"> & {
	caption?: ReactNode;
	columns: DataTableColumn[];
	emptyMessage?: ReactNode;
	getRowKey?: (row: DataTableRow, index: number) => string | number;
	rows: DataTableRow[];
};

const alignClasses: Record<DataTableAlign, string> = {
	center: "text-center",
	left: "text-left",
	right: "text-right",
};

const getDefaultRowKey = (row: DataTableRow, index: number) => {
	const rowKey = row.id ?? row.key;

	return typeof rowKey === "number" || typeof rowKey === "string"
		? rowKey
		: index;
};

const getCellContent = (
	column: DataTableColumn,
	row: DataTableRow,
	index: number,
) => column.render?.(row, index) ?? row[column.key];

export const DataTable: React.FC<DataTableProps> = (props) => {
	const {
		caption,
		className,
		columns,
		emptyMessage = "Nenhum registro encontrado.",
		getRowKey = getDefaultRowKey,
		rows,
		...rest
	} = props;
	const colSpan = Math.max(columns.length, 1);

	return (
		<div
			className={cn(
				"my-6 overflow-hidden rounded-2xl border bg-card pb-4 shadow-sm",
				className,
			)}
			{...rest}
		>
			<Table>
				{caption ? <TableCaption>{caption}</TableCaption> : null}
				<TableHeader>
					<TableRow>
						{columns.map((column) => (
							<TableHead
								className={cn(
									alignClasses[column.align ?? "left"],
									column.headerClassName,
								)}
								key={column.key}
							>
								{column.header}
							</TableHead>
						))}
					</TableRow>
				</TableHeader>
				<TableBody>
					{rows.length > 0 ? (
						rows.map((row, rowIndex) => (
							<TableRow key={getRowKey(row, rowIndex)}>
								{columns.map((column) => (
									<TableCell
										className={cn(
											alignClasses[column.align ?? "left"],
											column.cellClassName,
										)}
										key={column.key}
									>
										{getCellContent(column, row, rowIndex)}
									</TableCell>
								))}
							</TableRow>
						))
					) : (
						<TableRow>
							<TableCell
								className="h-24 text-center text-muted-foreground"
								colSpan={colSpan}
							>
								{emptyMessage}
							</TableCell>
						</TableRow>
					)}
				</TableBody>
			</Table>
		</div>
	);
};
