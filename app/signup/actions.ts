"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface SignupActionResult {
	error?: string;
	success?: string;
}

export async function signUpAsStudent(
	_previousState: SignupActionResult | null,
	formData: FormData,
): Promise<SignupActionResult> {
	const supabase = await createSupabaseServerClient();

	const fullName = formData.get("fullName") as string;
	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	if (!fullName || !email || !password) {
		return { error: "All fields are required." };
	}

	if (password.length < 6) {
		return { error: "Password must be at least 6 characters." };
	}

	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				full_name: fullName,
			},
		},
	});

	if (error) {
		return { error: error.message };
	}

	revalidatePath("/", "layout");
	redirect("/");
}
