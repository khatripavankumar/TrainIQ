"use client";

import { useActionState } from "react";
import Link from "next/link";
import { IconChartBar, IconLoader2 } from "@tabler/icons-react";
import { loginWithEmailAndPassword, type AuthActionResult } from "./actions";

export default function LoginPage() {
	const [state, formAction, isPending] = useActionState<
		AuthActionResult | null,
		FormData
	>(loginWithEmailAndPassword, null);

	return (
		<div className="flex min-h-screen items-center justify-center bg-surface-low px-4">
			<div className="w-full max-w-md space-y-8">
				{/* Brand */}
				<div className="flex flex-col items-center gap-3">
					<div className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
						<IconChartBar className="size-6" />
					</div>
					<div className="text-center">
						<h1 className="text-2xl font-semibold tracking-tight text-foreground font-serif">
							Welcome back
						</h1>
						<p className="mt-1 text-sm text-muted-foreground">
							Sign in to your TrainIQ account
						</p>
					</div>
				</div>

				{/* Form Card */}
				<div className="rounded-xl border border-border/40 bg-background p-8 shadow-sm">
					<form action={formAction} className="space-y-5">
						{/* Error alert */}
						{state?.error && (
							<div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
								{state.error}
							</div>
						)}

						{/* Email */}
						<div className="space-y-2">
							<label
								htmlFor="login-email"
								className="text-sm font-medium text-foreground"
							>
								Email
							</label>
							<input
								id="login-email"
								name="email"
								type="email"
								autoComplete="email"
								required
								placeholder="you@example.com"
								className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
							/>
						</div>

						{/* Password */}
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<label
									htmlFor="login-password"
									className="text-sm font-medium text-foreground"
								>
									Password
								</label>
								<Link
									href="/forgot-password"
									className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
								>
									Forgot password?
								</Link>
							</div>
							<input
								id="login-password"
								name="password"
								type="password"
								autoComplete="current-password"
								required
								placeholder="••••••••"
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
									Signing in…
								</>
							) : (
								"Sign in"
							)}
						</button>
					</form>

					{/* Divider + Signup link */}
					<div className="mt-6 flex items-center gap-3">
						<div className="h-px flex-1 bg-border/60" />
						<span className="text-xs text-muted-foreground">or</span>
						<div className="h-px flex-1 bg-border/60" />
					</div>

					<p className="mt-4 text-center text-sm text-muted-foreground">
						Don&apos;t have an account?{" "}
						<Link
							href="/signup"
							className="font-medium text-primary hover:text-primary/80 transition-colors"
						>
							Create one
						</Link>
					</p>
				</div>

				{/* Footer */}
				<p className="text-center text-xs text-muted-foreground/70">
					TrainIQ — AI-Powered Training Companion
				</p>
			</div>
		</div>
	);
}
