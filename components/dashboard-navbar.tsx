"use client";

import { IconBell, IconSearch, IconUser } from "@tabler/icons-react";
import { usePathname } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

const ROUTE_LABELS: Record<string, string> = {
	"/student":                "Skill Map",
	"/student/learning-paths": "Learning Paths",
	"/student/support":        "Support",
};

interface DashboardNavbarProperties {
	userName: string | null;
}

export function DashboardNavbar({ userName }: DashboardNavbarProperties) {
	const currentPathname = usePathname();
	const pageLabel = ROUTE_LABELS[currentPathname] ?? "Dashboard";

	return (
		<header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background/80 backdrop-blur-[12px] px-4">
			{/* Toggle + breadcrumb */}
			<div className="flex items-center gap-2 flex-1 min-w-0">
				<SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground" />
				<Separator orientation="vertical" className="h-4 bg-border" />
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem>
							<span className="font-mono text-[0.6875rem] text-muted-foreground uppercase tracking-widest">
								TrainIQ
							</span>
						</BreadcrumbItem>
						<BreadcrumbItem>
							<span className="text-muted-foreground/40 select-none px-1">·</span>
						</BreadcrumbItem>
						<BreadcrumbItem>
							<BreadcrumbPage className="font-sans text-sm text-foreground font-medium">
								{pageLabel}
							</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			{/* Right-side controls */}
			<div className="flex items-center gap-1">
				<Button
					variant="ghost"
					size="icon-sm"
					className="text-muted-foreground hover:text-foreground"
					aria-label="Search"
				>
					<IconSearch className="size-4" stroke={1.5} />
				</Button>
				<Button
					variant="ghost"
					size="icon-sm"
					className="text-muted-foreground hover:text-foreground"
					aria-label="Notifications"
				>
					<IconBell className="size-4" stroke={1.5} />
				</Button>
				{userName && (
					<>
						<Separator orientation="vertical" className="h-4 bg-border mx-2" />
						<div className="flex items-center gap-2 pr-1">
							<div className="flex aspect-square size-7 items-center justify-center rounded-full bg-surface-highest text-muted-foreground border border-border/10">
								<IconUser className="size-3.5" stroke={1.5} />
							</div>
							<span className="text-sm font-medium text-foreground hidden sm:block">
								{userName}
							</span>
						</div>
					</>
				)}
			</div>
		</header>
	);
}
