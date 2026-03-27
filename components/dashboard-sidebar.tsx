"use client";

import {
	IconGridDots,
	IconBook,
	IconHelp,
	IconChartBar,
	IconLogout,
	IconUser,
	IconMessage,
} from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/auth/signout/actions";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

interface NavigationItem {
	label: string;
	icon: typeof IconGridDots;
	href: string;
}

const NAVIGATION_ITEMS: NavigationItem[] = [
	{ label: "Skill Matrix",    icon: IconGridDots, href: "/student" },
	{ label: "Learning Paths",  icon: IconBook,     href: "/student/learning-paths" },
	{ label: "Chat",            icon: IconMessage,  href: "/student/chat" },
	{ label: "Support",         icon: IconHelp,     href: "/student/support" },
];

interface DashboardSidebarProperties {
	userName: string | null;
	userEmail: string;
}

export function DashboardSidebar({ userName, userEmail }: DashboardSidebarProperties) {
	const currentPathname = usePathname();
	const activeNavigationHref = NAVIGATION_ITEMS.reduce<string | null>((matchedHref, navigationItem) => {
		const matchesCurrentPath =
			currentPathname === navigationItem.href ||
			currentPathname.startsWith(`${navigationItem.href}/`);

		if (!matchesCurrentPath) {
			return matchedHref;
		}

		if (!matchedHref || navigationItem.href.length > matchedHref.length) {
			return navigationItem.href;
		}

		return matchedHref;
	}, null);

	return (
		<Sidebar
			className="bg-surface-low text-foreground"
			variant="floating"
			collapsible="icon"
		>
			<SidebarHeader className="group-data-[collapsible=icon]:p-0 px-4 pt-3 pb-3">
				{/* Expanded: full brand row */}
				<div className="flex items-center gap-3 group-data-[collapsible=icon]:hidden">
					<div className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-md">
						<Image src="/logo.png" alt="TrainIQ Logo" width={32} height={32} className="object-cover" />
					</div>
					<div className="grid text-left leading-tight">
						<span className="truncate font-semibold text-sm">TrainIQ</span>
						<span className="truncate text-xs text-muted-foreground">Student</span>
					</div>
				</div>
				{/* Collapsed icon */}
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							className="hidden group-data-[collapsible=icon]:flex hover:bg-transparent cursor-default p-0"
							tooltip="TrainIQ"
						>
							<div className="flex size-8 items-center justify-center overflow-hidden rounded-md">
								<Image src="/logo.png" alt="TrainIQ Logo" width={24} height={24} className="object-cover" />
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent className="group-data-[collapsible=icon]:p-0 px-1.5">
				<SidebarGroup className="group-data-[collapsible=icon]:p-0">
					<SidebarGroupContent>
						<SidebarMenu className="space-y-0.5 group-data-[collapsible=icon]:items-center">
							{NAVIGATION_ITEMS.map((navigationItem) => {
								const isActiveRoute = activeNavigationHref === navigationItem.href;

								return (
									<SidebarMenuItem key={navigationItem.label}>
										<SidebarMenuButton
											asChild
											isActive={isActiveRoute}
											tooltip={navigationItem.label}
											className={
												isActiveRoute
													? "bg-primary/10 text-primary font-medium hover:bg-primary/20 hover:text-primary data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
													: "text-muted-foreground hover:bg-surface-high hover:text-foreground"
											}
										>
											<Link href={navigationItem.href}>
												<navigationItem.icon stroke={1.5} />
												<span>{navigationItem.label}</span>
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className="border-t border-border/15 group-data-[collapsible=icon]:p-0 px-3 py-3">
				<SidebarMenu className="space-y-1">
					{/* Sign out */}
					<SidebarMenuItem>
						<form action={signOutAction}>
							<SidebarMenuButton
								asChild
								tooltip="Sign out"
								className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
							>
								<button type="submit" className="w-full">
									<IconLogout stroke={1.5} />
									<span>Sign out</span>
								</button>
							</SidebarMenuButton>
						</form>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</Sidebar>
	);
}
