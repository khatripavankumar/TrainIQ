/**
 * Seed script — creates the student test account.
 * Run with: pnpm exec tsx scripts/seed-users.ts
 *
 * Account:  Pavan Kumar  /  pavankhatri@gmail.com  /  Seed@12345
 */

import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const DEFAULT_PASSWORD = "Seed@12345";

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
	auth: { autoRefreshToken: false, persistSession: false },
});

async function main(): Promise<void> {
	console.log("🌱 TrainIQ — Seeding student account\n" + "=".repeat(40));

	const { data, error } = await supabaseAdmin.auth.admin.createUser({
		email: "pavankhatri@gmail.com",
		password: DEFAULT_PASSWORD,
		email_confirm: true,
		user_metadata: { full_name: "Pavan Kumar" },
	});

	if (error) {
		if (error.message.includes("already been registered")) {
			console.log("ℹ Student account already exists.");
		} else {
			console.error("✗ Failed:", error.message);
			process.exit(1);
		}
	} else {
		console.log(`✓ Auth user created: ${data.user.id}`);
	}

	// Ensure full_name is set on the profile
	const { data: users } = await supabaseAdmin.auth.admin.listUsers();
	const student = users?.users.find((u) => u.email === "pavankhatri@gmail.com");

	if (student) {
		await supabaseAdmin
			.from("profiles")
			.update({ full_name: "Pavan Kumar", role: "student" })
			.eq("id", student.id);
		console.log("✓ Profile updated");
	}

	console.log("\n✅ Done!");
	console.log(`  Email:    pavankhatri@gmail.com`);
	console.log(`  Password: ${DEFAULT_PASSWORD}`);
}

main().catch((err) => {
	console.error("Seed failed:", err);
	process.exit(1);
});
