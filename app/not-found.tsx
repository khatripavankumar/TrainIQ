"use client";

import Link from "next/link";
import { IconMapOff, IconArrowLeft } from "@tabler/icons-react";

export default function GlobalNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      {/* Decorative Icon 
          Wait, Framer Motion might not be installed. I will use a simple Next.js approach without motion to avoid crashes, but with Tailwind CSS animations if needed. 
          Actually, I will just use standard Tailwind. */}
          
      <div className="relative mb-8 flex items-center justify-center">
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20 blur-xl" />
        <div className="relative flex h-24 w-24 items-center justify-center rounded-2xl border border-border/50 bg-surface-high shadow-2xl backdrop-blur-sm">
          <IconMapOff className="h-10 w-10 text-primary" stroke={1.5} />
        </div>
      </div>

      {/* Text Content */}
      <div className="space-y-3">
        <h1 className="font-serif text-[4rem] font-bold tracking-tight text-foreground leading-none">
          404
        </h1>
        <h2 className="font-sans text-xl font-medium text-foreground tracking-tight">
          Lost in the knowledge terrain
        </h2>
        <p className="mx-auto max-w-[400px] font-sans text-sm text-muted-foreground leading-relaxed">
          The page you're looking for seems to have drifted off the skill map. Let's get you back on your learning path.
        </p>
      </div>

      {/* Call to Action */}
      <div className="mt-10">
        <Link
          href="/student"
          className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-6 py-2.5 font-sans text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95 shadow-[0_0_20px_oklch(var(--primary)/20%)] hover:shadow-[0_0_30px_oklch(var(--primary)/40%)]"
        >
          <IconArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" stroke={2} />
          Return to Dashboard
        </Link>
      </div>
      
      {/* Decorative dots grid at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-[radial-gradient(oklch(var(--ring)/20%)_1px,transparent_1px)] [background-size:16px_16px] [mask-image:linear-gradient(to_top,white,transparent)] -z-10 opacity-50" />
    </div>
  );
}
