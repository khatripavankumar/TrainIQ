import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PUBLIC_ROUTES = ["/login", "/signup", "/forgot-password"];

/** Always let these through regardless of auth state. */
const PASS_THROUGH_ROUTES = ["/auth/signout", "/auth/confirm", "/update-password", "/api/"];

function isPublicRoute(pathname: string): boolean {
	return PUBLIC_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	);
}

function isPassThroughRoute(pathname: string): boolean {
	return PASS_THROUGH_ROUTES.some(
		(route) => pathname === route || pathname.startsWith(`${route}/`),
	);
}

export async function updateSession(request: NextRequest) {
	let supabaseResponse = NextResponse.next({ request });

	const supabase = createServerClient(
		process.env.NEXT_PUBLIC_SUPABASE_URL!,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
		{
			cookies: {
				getAll() {
					return request.cookies.getAll();
				},
				setAll(cookiesToSet) {
					for (const { name, value } of cookiesToSet) {
						request.cookies.set(name, value);
					}
					supabaseResponse = NextResponse.next({ request });
					for (const { name, value, options } of cookiesToSet) {
						supabaseResponse.cookies.set(name, value, options);
					}
				},
			},
		},
	);

	// IMPORTANT: Do not add code between createServerClient and getClaims().
	const { data } = await supabase.auth.getClaims();
	const isAuthenticated = !!data?.claims;

	const { pathname } = request.nextUrl;

	// Always let signout/confirm through
	if (isPassThroughRoute(pathname)) {
		return supabaseResponse;
	}

	// Unauthenticated → redirect to /login (except public routes)
	if (!isAuthenticated) {
		if (!isPublicRoute(pathname) && pathname !== "/") {
			const loginUrl = request.nextUrl.clone();
			loginUrl.pathname = "/login";
			return NextResponse.redirect(loginUrl);
		}
		return supabaseResponse;
	}

	// Authenticated on login/signup or root → redirect to /student
	if (isPublicRoute(pathname) || pathname === "/") {
		const studentUrl = request.nextUrl.clone();
		studentUrl.pathname = "/student";
		return NextResponse.redirect(studentUrl);
	}

	return supabaseResponse;
}
