    // refer to nextauth.js docs -> Configuration -> Next.js -> advanced usage -> wrap middleware

import { withAuth } from "next-auth/middleware"
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import { NextRequest, NextResponse } from "next/server";
// middleware function will only be invoked if the authorized callback returns true.
//  in the authorized inside callbacks, whatever page we are checking if is returned true,
//  then it will go to middleware function
// in our middleware function we are just letting them passby. 
// So we have to mark all the pages that are not supposed to behind the authorization.
// Hence public urls can be passed here
export default withAuth(
  function middleware() {
    return NextResponse.next()
  },
  {
    callbacks: {
        // all public url will go here, which need not be
      authorized: ({ token,req }) => {
        const {pathname} = req.nextUrl

        // All webhook endpoints
        if(pathname.startsWith("/api/webhook")){
            return true
        }
        // Allow auth-related routes
        if(
            pathname.startsWith("/api/auth") ||
            pathname === "/login" ||
            pathname === "/register" ){
            return true
        }
        // Allow public routes
        if(
            pathname === "/" ||
            pathname.startsWith("/api/products") ||
            pathname.startsWith("/products") 
        ){
            return true
        }
        // Admin routes require admin role
        if(pathname.startsWith("/admin")){
            return token?.role === "admin"
        }
        // All other routes require authentication
        return !!token
    },
    },
  },
)

export const config = {
    // Match all request paths except:
    //  1. _next/static (static files)
    //  2. _next/image (image optimization files)
    //  3. favicon.ico (favicon file)
    //  4. public folder
    matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"] }