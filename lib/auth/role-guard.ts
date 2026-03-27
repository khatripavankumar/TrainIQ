import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AppRole = "student" | "trainer" | "admin";

export interface UserProfile {
	id: string;
	email: string;
	fullName: string | null;
	avatarUrl: string | null;
	role: AppRole;
}

const ROLE_DEFAULT_ROUTES: Record<AppRole, string> = {
	student: "/student",
	trainer: "/trainer",
	admin: "/management",
};

/**
 * Fetches the authenticated user's profile from the profiles table.
 * Redirects to /login if not authenticated.
 */
export async function getCurrentUserProfile(): Promise<UserProfile> {
	const supabase = await createSupabaseServerClient();

	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/login");
	}

	const { data: profile } = await supabase
		.from("profiles")
		.select("id, full_name, avatar_url, role")
		.eq("id", user.id)
		.single();

	return {
		id: user.id,
		email: user.email ?? "",
		fullName: profile?.full_name ?? user.user_metadata?.full_name ?? null,
		avatarUrl: profile?.avatar_url ?? null,
		role: (profile?.role as AppRole) ?? "student",
	};
}

/**
 * Ensures the current user has one of the specified roles.
 * Redirects to their role's default route if unauthorized.
 */
export async function requireRole(
	allowedRoles: AppRole[],
): Promise<UserProfile> {
	const userProfile = await getCurrentUserProfile();

	if (!allowedRoles.includes(userProfile.role)) {
		redirect(getRoleDefaultRoute(userProfile.role));
	}

	return userProfile;
}

/** Maps a role to its default dashboard path. */
export function getRoleDefaultRoute(role: AppRole): string {
	return ROLE_DEFAULT_ROUTES[role] ?? "/student";
}
