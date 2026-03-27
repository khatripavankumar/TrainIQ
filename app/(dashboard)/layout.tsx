import type { ReactNode } from "react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { getCurrentUserProfile } from "@/lib/auth/role-guard";

interface DashboardLayoutProperties {
  children: ReactNode;
}

export default async function DashboardLayout({ children }: DashboardLayoutProperties) {
  const userProfile = await getCurrentUserProfile();

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-surface-low text-foreground">
        <DashboardSidebar userName={userProfile.fullName} userEmail={userProfile.email} />
        <SidebarInset className="flex flex-col overflow-hidden bg-background my-1 mr-1 rounded-xl border border-border/10 shadow-sm">
          <DashboardNavbar userName={userProfile.fullName} />
          <div className="flex-1 overflow-y-auto">
            <div className="mx-auto w-full max-w-[1280px] px-5 py-5">
              {children}
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
