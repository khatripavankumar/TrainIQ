"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface AuthActionResult {
	error?: string;
}

export async function loginWithEmailAndPassword(
	_previousState: AuthActionResult | null,
	formData: FormData,
): Promise<AuthActionResult> {
	const supabase = await createSupabaseServerClient();

	const email = formData.get("email") as string;
	const password = formData.get("password") as string;

	if (!email || !password) {
		return { error: "Email and password are required." };
	}

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	});

	if (error) {
		return { error: error.message };
	}

	revalidatePath("/", "layout");
	redirect("/");
}
