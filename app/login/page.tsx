import { Suspense } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import LoginForm from "./login-form";

export default function Page() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center p-4">Loading...</div>}>
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative">
                <div className="absolute top-4 left-4">
                    <Link href="/" className="text-gray-400 hover:text-white flex items-center gap-2 text-sm">
                        <ChevronLeft className="w-4 h-4" />
                        Home
                    </Link>
                </div>
                <div className="w-full max-w-md p-8 bg-gray-900 rounded-lg shadow-xl border border-gray-800">
                    <LoginForm />
                </div>
            </div>
        </Suspense>
    );
}
