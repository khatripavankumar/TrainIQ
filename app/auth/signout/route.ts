import { type NextRequest, NextResponse } from "next/server";

/** Fallback GET handler — redirects to login if someone navigates here directly. */
export function GET(request: NextRequest) {
	return NextResponse.redirect(new URL("/login", request.url));
}
