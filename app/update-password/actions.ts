"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type UpdatePasswordActionResult = {
	error: string | null;
};

export async function updatePassword(
	prevState: UpdatePasswordActionResult | null,
	formData: FormData
): Promise<UpdatePasswordActionResult | null> {
	const password = formData.get("password") as string;
	const confirmPassword = formData.get("confirmPassword") as string;

	if (!password || !confirmPassword) {
		return { error: "Both password fields are required." };
	}

	if (password !== confirmPassword) {
		return { error: "Passwords do not match." };
	}

	if (password.length < 6) {
		return { error: "Password must be at least 6 characters long." };
	}

	const supabase = await createSupabaseServerClient();

	const { error } = await supabase.auth.updateUser({
		password: password,
	});

	if (error) {
		console.error("Update password error:", error);
		return { error: error.message };
	}

	// Password updated successfully. The user is already logged in at this point via the recovery link.
	redirect("/student");
}
