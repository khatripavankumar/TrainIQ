"use server";

import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type ForgotPasswordActionResult = {
	error: string | null;
	success: string | null;
};

export async function requestPasswordReset(
	prevState: ForgotPasswordActionResult | null,
	formData: FormData
): Promise<ForgotPasswordActionResult | null> {
	const email = formData.get("email") as string;

	if (!email) {
		return { error: "Email is required.", success: null };
	}

	const supabase = await createSupabaseServerClient();
	const headersList = await headers();
	const host = headersList.get("host") || "localhost:3000";
	const protocol = process.env.NODE_ENV === "production" ? "https" : "http";

	const { error } = await supabase.auth.resetPasswordForEmail(email, {
		// Supabase will append the token hash to this URL, which our /auth/confirm handles
		redirectTo: `${protocol}://${host}/auth/confirm?next=/update-password`,
	});

	if (error) {
		console.error("Forgot password error:", error);
		// For security reasons, often it's better to always return success to prevent email enumeration,
		// but for hackathon UX, we'll return the error if it fails to send.
		return { error: error.message, success: null };
	}

	return {
		error: null,
		success: "Check your email for a password reset link.",
	};
}
