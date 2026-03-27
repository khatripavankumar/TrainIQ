"use client";

import { useActionState } from "react";
import { IconKey, IconLoader2 } from "@tabler/icons-react";
import { updatePassword, type UpdatePasswordActionResult } from "./actions";

export default function UpdatePasswordPage() {
	const [state, formAction, isPending] = useActionState<
		UpdatePasswordActionResult | null,
		FormData
	>(updatePassword, null);

	return (
		<div className="flex min-h-screen items-center justify-center bg-surface-low px-4">
			<div className="w-full max-w-md space-y-8">
				{/* Brand */}
				<div className="flex flex-col items-center gap-3">
					<div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
						<IconKey className="size-6" />
					</div>
					<div className="text-center">
						<h1 className="text-2xl font-semibold tracking-tight text-foreground font-serif">
							Set new password
						</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							Please enter your new password below.
						</p>
					</div>
				</div>

				{/* Form Card */}
				<div className="rounded-xl border border-border/40 bg-background p-8 shadow-sm">
					<form action={formAction} className="space-y-5">
						{/* Alerts */}
						{state?.error && (
							<div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
								{state.error}
							</div>
						)}

						<div className="space-y-4">
							{/* New Password */}
							<div className="space-y-2">
								<label
									htmlFor="update-password"
									className="text-sm font-medium text-foreground"
								>
									New Password
								</label>
								<input
									id="update-password"
									name="password"
									type="password"
									required
									minLength={6}
									placeholder="••••••••"
									className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
								/>
							</div>

							{/* Confirm Password */}
							<div className="space-y-2">
								<label
									htmlFor="confirm-password"
									className="text-sm font-medium text-foreground"
								>
									Confirm Password
								</label>
								<input
									id="confirm-password"
									name="confirmPassword"
									type="password"
									required
									minLength={6}
									placeholder="••••••••"
									className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
								/>
							</div>

							{/* Submit */}
							<button
								type="submit"
								disabled={isPending}
								className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isPending ? (
									<>
										<IconLoader2 className="size-4 animate-spin" />
										Updating…
									</>
								) : (
									"Update password"
								)}
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
