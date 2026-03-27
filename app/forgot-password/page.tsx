"use client";

import { useActionState } from "react";
import Link from "next/link";
import { IconKey, IconLoader2, IconArrowLeft } from "@tabler/icons-react";
import { requestPasswordReset, type ForgotPasswordActionResult } from "./actions";

export default function ForgotPasswordPage() {
	const [state, formAction, isPending] = useActionState<
		ForgotPasswordActionResult | null,
		FormData
	>(requestPasswordReset, null);

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
							Reset your password
						</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							Enter your email to receive a reset link
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
						{state?.success && (
							<div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-600 dark:text-emerald-400">
								{state.success}
							</div>
						)}

						{/* Email */}
						{!state?.success && (
							<div className="space-y-4">
								<div className="space-y-2">
									<label
										htmlFor="forgot-email"
										className="text-sm font-medium text-foreground"
									>
										Email
									</label>
									<input
										id="forgot-email"
										name="email"
										type="email"
										autoComplete="email"
										required
										placeholder="you@example.com"
										className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
									/>
								</div>

								{/* Submit */}
								<button
									type="submit"
									disabled={isPending}
									className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-primary text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{isPending ? (
										<>
											<IconLoader2 className="size-4 animate-spin" />
											Sending link…
										</>
									) : (
										"Send reset link"
									)}
								</button>
							</div>
						)}
					</form>

					<div className="mt-6 flex justify-center">
						<Link
							href="/login"
							className="group flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
						>
							<IconArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
							Back to login
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
