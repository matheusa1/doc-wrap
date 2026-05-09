import { cn } from "@presentation/lib/utils";
import {
	Children,
	isValidElement,
	type KeyboardEvent,
	type ReactElement,
	type ReactNode,
	useEffect,
	useId,
	useState,
} from "react";

type TabValueConfig = {
	attributes?: Record<string, unknown>;
	label: ReactNode;
	value: string;
};

type TabsProps = {
	children: ReactNode;
	className?: string;
	defaultValue?: string | null;
	groupId?: string;
	lazy?: boolean;
	queryString?: boolean | string;
	values?: TabValueConfig[];
};

type TabItemProps = {
	attributes?: Record<string, unknown>;
	children: ReactNode;
	default?: boolean;
	label?: ReactNode;
	value: string;
};

type ResolvedTab = {
	attributes: Record<string, unknown> | undefined;
	children: ReactNode;
	label: ReactNode;
	value: string;
};

const TAB_SYNC_EVENT = "docgest:tabs-sync";

const getTabItems = (children: ReactNode) =>
	Children.toArray(children).filter(
		(child): child is ReactElement<TabItemProps> =>
			isValidElement<TabItemProps>(child) && child.type === TabItem,
	);

const getQueryParamName = (
	queryString: TabsProps["queryString"],
	groupId?: string,
) => {
	if (!queryString) {
		return undefined;
	}

	return typeof queryString === "string" ? queryString : groupId;
};

const getInitialValue = ({
	defaultValue,
	groupId,
	queryParamName,
	tabs,
}: {
	defaultValue?: string | null;
	groupId?: string;
	queryParamName?: string;
	tabs: ResolvedTab[];
}) => {
	const values = new Set(tabs.map((tab) => tab.value));

	if (queryParamName && typeof globalThis !== "undefined") {
		const queryValue = new URLSearchParams(globalThis.location.search).get(
			queryParamName,
		);

		if (queryValue && values.has(queryValue)) {
			return queryValue;
		}
	}

	if (groupId && typeof globalThis !== "undefined") {
		const storedValue = globalThis.localStorage.getItem(
			`docgest-tabs:${groupId}`,
		);

		if (storedValue && values.has(storedValue)) {
			return storedValue;
		}
	}

	if (defaultValue === null) {
		return undefined;
	}

	if (defaultValue && values.has(defaultValue)) {
		return defaultValue;
	}

	return tabs[0]?.value;
};

const resolveTabs = (
	children: ReactNode,
	values?: TabValueConfig[],
): ResolvedTab[] => {
	const items = getTabItems(children);

	if (!values) {
		return items.map((item) => ({
			attributes: item.props.attributes,
			children: item.props.children,
			label: item.props.label ?? item.props.value,
			value: item.props.value,
		}));
	}

	return values
		.map((valueConfig) => {
			const item = items.find(
				(child) => child.props.value === valueConfig.value,
			);

			if (!item) {
				return null;
			}

			return {
				attributes: valueConfig.attributes ?? item.props.attributes,
				children: item.props.children,
				label: valueConfig.label,
				value: valueConfig.value,
			};
		})
		.filter((tab): tab is ResolvedTab => tab !== null);
};

export const Tabs: React.FC<TabsProps> = (props) => {
	const {
		children,
		className,
		defaultValue,
		groupId,
		lazy = false,
		queryString,
		values,
	} = props;
	const reactId = useId();
	const tabs = resolveTabs(children, values);
	const itemDefaults = getTabItems(children);
	const queryParamName = getQueryParamName(queryString, groupId);
	const defaultTabValue =
		defaultValue ??
		itemDefaults.find((item) => item.props.default)?.props.value;
	const [selectedValue, setSelectedValue] = useState<string | undefined>(() =>
		getInitialValue({
			defaultValue: defaultTabValue,
			groupId,
			queryParamName,
			tabs,
		}),
	);
	const selectedTab = tabs.find((tab) => tab.value === selectedValue);
	const selectedIndex = Math.max(
		tabs.findIndex((tab) => tab.value === selectedValue),
		0,
	);

	useEffect(() => {
		if (!selectedValue || !tabs.some((tab) => tab.value === selectedValue)) {
			setSelectedValue(tabs[0]?.value);
		}
	}, [selectedValue, tabs]);

	useEffect(() => {
		if (!groupId) {
			return;
		}

		const handleSync = (event: Event) => {
			const detail = (event as CustomEvent<{ groupId: string; value: string }>)
				.detail;

			if (
				detail?.groupId === groupId &&
				tabs.some((tab) => tab.value === detail.value)
			) {
				setSelectedValue(detail.value);
			}
		};

		globalThis.addEventListener(TAB_SYNC_EVENT, handleSync);

		return () => globalThis.removeEventListener(TAB_SYNC_EVENT, handleSync);
	}, [groupId, tabs]);

	const selectTab = (value: string) => {
		setSelectedValue(value);

		if (groupId) {
			globalThis.localStorage.setItem(`docgest-tabs:${groupId}`, value);
			globalThis.dispatchEvent(
				new CustomEvent(TAB_SYNC_EVENT, { detail: { groupId, value } }),
			);
		}

		if (queryParamName) {
			const url = new URL(globalThis.location.href);
			url.searchParams.set(queryParamName, value);
			globalThis.history.replaceState(null, "", url);
		}
	};

	const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
		const keyOffset =
			event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;

		if (keyOffset === 0 || tabs.length === 0) {
			return;
		}

		event.preventDefault();
		const nextIndex = (selectedIndex + keyOffset + tabs.length) % tabs.length;
		selectTab(tabs[nextIndex].value);
	};

	return (
		<div className={cn("my-6 rounded-2xl border bg-card shadow-sm", className)}>
			<div
				aria-label="Abas de conteúdo"
				className="flex gap-1 overflow-x-auto border-b p-2"
				onKeyDown={handleKeyDown}
				role="tablist"
			>
				{tabs.map((tab) => {
					const isSelected = tab.value === selectedValue;
					const attributes = tab.attributes ?? {};
					const attributeClassName =
						typeof attributes.className === "string"
							? attributes.className
							: undefined;

					return (
						<button
							aria-controls={`${reactId}-${tab.value}-panel`}
							aria-selected={isSelected}
							className={cn(
								"shrink-0 rounded-xl px-3 py-1.5 font-medium text-muted-foreground text-sm outline-none transition hover:bg-muted hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
								isSelected &&
									"bg-secondary text-secondary-foreground shadow-sm",
								attributeClassName,
							)}
							id={`${reactId}-${tab.value}-tab`}
							key={tab.value}
							onClick={() => selectTab(tab.value)}
							role="tab"
							tabIndex={isSelected ? 0 : -1}
							type="button"
						>
							{tab.label}
						</button>
					);
				})}
			</div>

			<div className="p-4 leading-7">
				{lazy ? (
					<div
						aria-labelledby={`${reactId}-${selectedTab?.value}-tab`}
						id={`${reactId}-${selectedTab?.value}-panel`}
						role="tabpanel"
					>
						{selectedTab?.children}
					</div>
				) : (
					tabs.map((tab) => {
						const isSelected = tab.value === selectedValue;

						return (
							<div
								aria-labelledby={`${reactId}-${tab.value}-tab`}
								hidden={!isSelected}
								id={`${reactId}-${tab.value}-panel`}
								key={tab.value}
								role="tabpanel"
							>
								{tab.children}
							</div>
						);
					})
				)}
			</div>
		</div>
	);
};

export const TabItem: React.FC<Readonly<TabItemProps>> = ({ children }) => {
	return <>{children}</>;
};
