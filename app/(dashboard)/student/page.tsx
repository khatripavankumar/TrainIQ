import { getCurrentUserProfile } from "@/lib/auth/role-guard";

interface EmptyStatePanelProperties {
	title: string;
	description: string;
}

function EmptyStatePanel({
	title,
	description,
}: EmptyStatePanelProperties) {
	return (
		<div className="rounded-lg border border-dashed border-border bg-surface-high p-6">
			<div className="flex items-center justify-between gap-3">
				<h3 className="font-sans text-sm font-medium text-foreground">{title}</h3>
				<span className="rounded bg-muted px-2 py-0.5 font-mono text-[0.6875rem] uppercase tracking-wider text-muted-foreground">
					No Data
				</span>
			</div>
			<p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
				{description}
			</p>
		</div>
	);
}

export default async function StudentSkillMapPage() {
	const currentUserProfile = await getCurrentUserProfile();
	const studentDisplayName = currentUserProfile.fullName ?? "Student";

	return (
		<div className="space-y-8">
			<div>
				<div className="mb-1 flex items-center gap-3">
					<span className="font-sans text-sm text-muted-foreground">
						{studentDisplayName}
					</span>
					<span className="rounded bg-primary/15 px-2 py-0.5 font-mono text-[0.6875rem] text-primary">
						Student Dashboard
					</span>
				</div>
				<h1 className="font-serif text-[2.25rem] font-semibold leading-tight tracking-tight text-foreground">
					Your Skill Map
				</h1>
				<p className="mt-2 max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
					Your skill analytics will appear here after TrainIQ records your
					first diagnostic results and learning milestones.
				</p>
			</div>

			<div className="rounded-lg bg-surface-high p-6">
				<h2 className="font-sans text-xs font-medium uppercase tracking-widest text-muted-foreground">
					Skill Health
				</h2>
				<p className="mt-3 font-serif text-2xl font-semibold text-foreground">
					No skill analytics yet
				</p>
				<p className="mt-3 max-w-2xl font-sans text-sm leading-relaxed text-muted-foreground">
					We have not recorded any diagnostic performance, cohort ranking, or
					mastery trends for this account yet.
				</p>
			</div>

			<section className="space-y-4">
				<div>
					<h2 className="font-serif text-xl font-semibold text-foreground">
						Knowledge Terrain
					</h2>
					<p className="mt-1 font-sans text-xs text-muted-foreground">
						No verified skill-level breakdown is available yet.
					</p>
				</div>
				<EmptyStatePanel
					title="Awaiting diagnostic results"
					description="This section will list assessed skills and proficiency levels once the student completes a diagnostic and TrainIQ stores the results."
				/>
			</section>

			<section className="space-y-4 rounded-lg bg-surface-high p-6">
				<div>
					<h2 className="font-serif text-xl font-semibold text-foreground">
						Progress Trajectory
					</h2>
					<p className="mt-1 font-sans text-xs text-muted-foreground">
						No historical progress data has been captured yet.
					</p>
				</div>
				<EmptyStatePanel
					title="Awaiting progress history"
					description="The trajectory chart will render once TrainIQ has enough historical assessment data to show progress over time."
				/>
			</section>

			<section className="space-y-4">
				<div>
					<h2 className="font-serif text-xl font-semibold text-foreground">
						Your Learning Path
					</h2>
					<p className="mt-1 font-sans text-xs text-muted-foreground">
						No personalized learning path has been generated yet.
					</p>
				</div>
				<EmptyStatePanel
					title="Awaiting recommended next steps"
					description="Learning path milestones will appear here after TrainIQ can derive recommendations from completed diagnostics or assigned coursework."
				/>
			</section>
		</div>
	);
}
