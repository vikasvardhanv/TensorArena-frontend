import { withAuth } from "next-auth/middleware"

export default withAuth({
    pages: {
        signIn: "/login",
    },
})

export const config = {
    matcher: [
        "/arena/:path*",
        "/payment/:path*",
        "/system-design/:path*",
        "/mentor/:path*",
        "/papers/:path*",
        "/mock-interview/:path*",
        "/production/:path*"
    ],
}
