"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Copy, Check } from "lucide-react";

function SuccessContent() {
    const [copied, setCopied] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const code = searchParams.get("code");

    useEffect(() => {
        if (!code) {
            // Redirect back to payment if no code is present
            const timer = setTimeout(() => {
                router.push("/payment");
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [code, router]);

    const copyToClipboard = () => {
        if (code) {
            navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!code) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
                    <p className="mt-4 text-red-400">Invalid access. Redirecting...</p>
                </div>
            </div>
        );
    }



    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8 p-8 bg-gray-900/50 rounded-2xl border border-gray-800">
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold">Payment Successful!</h1>
                    <p className="text-gray-400">Thank you for your purchase. Here is your unique subscription code:</p>
                </div>

                <div className="bg-gray-800/50 rounded-lg p-6 space-y-4">
                    <div className="text-center">
                        <p className="text-sm text-gray-400 mb-2">Your Subscription Code</p>
                        <div className="flex items-center justify-center space-x-2">
                            <code className="text-2xl font-mono font-bold text-blue-400 tracking-wider">
                                {code}
                            </code>
                            <button
                                onClick={copyToClipboard}
                                className="p-2 hover:bg-gray-700 rounded transition-colors"
                                title="Copy to clipboard"
                            >
                                {copied ? (
                                    <Check className="w-5 h-5 text-green-500" />
                                ) : (
                                    <Copy className="w-5 h-5 text-gray-400" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                        <p className="text-sm text-yellow-400 font-medium">⚠️ Important</p>
                        <ul className="text-xs text-gray-300 mt-2 space-y-1">
                            <li>• Save this code - it will only be shown once</li>
                            <li>• This code can only be used once</li>
                            <li>• Valid for 30 days of premium access</li>
                        </ul>
                    </div>
                </div>

                <div className="space-y-3">
                    <p className="text-sm text-gray-400 text-center">
                        Go to the payment page and enter this code to activate your subscription.
                    </p>
                    <button
                        onClick={() => router.push("/payment")}
                        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
                    >
                        Activate Subscription
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black text-white flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        }>
            <SuccessContent />
        </Suspense>
    );
}
