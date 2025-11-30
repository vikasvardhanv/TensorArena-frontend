"use client";

import { useState } from "react";
import { simulatePaymentSuccess, redeemSubscriptionCode } from "../actions/payment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CheckCircle, DollarSign, Loader2, Key } from "lucide-react";

export default function PaymentPage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState("");
    const [codeError, setCodeError] = useState("");
    const router = useRouter();

    const handleSimulatePayment = async () => {
        setLoading(true);
        try {
            const result = await simulatePaymentSuccess();
            if (result.success) {
                await update();
                router.refresh();
            }
        } catch (error) {
            console.error("Payment failed", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRedeemCode = async () => {
        setCodeError("");
        setLoading(true);
        try {
            const result = await redeemSubscriptionCode(code);
            if (result.success) {
                await update();
                router.refresh();
            } else {
                setCodeError(result.message || "Invalid code");
            }
        } catch (error) {
            setCodeError("Failed to redeem code");
        } finally {
            setLoading(false);
        }
    };

    if (session?.user?.isSubscribed) {
        return (
            <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
                <div className="text-center space-y-4 animate-fade-in">
                    <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500">
                        <CheckCircle className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold">Premium Active</h1>
                    <p className="text-gray-400">Thank you for your support! You have unlimited access.</p>
                    <button
                        onClick={() => router.push("/arena")}
                        className="px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors"
                    >
                        Go to Arena
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8 p-8 bg-gray-900/50 rounded-2xl border border-gray-800">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-500 mb-6">
                        <DollarSign className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold">Unlock Premium</h2>
                    <p className="mt-2 text-gray-400">Get unlimited access to AI challenges and code execution.</p>
                    <div className="mt-4 text-2xl font-bold text-blue-500">$9.99/month</div>
                </div>

                <div className="space-y-6 pt-4">
                    {/* Cash App Payment */}
                    <div className="space-y-3">
                        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Payment Options</h3>
                        <a
                            href="https://cash.app/$YourCashtag"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full"
                        >
                            <button
                                style={{
                                    padding: "10px 20px",
                                    background: "#00d632",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    fontSize: "16px",
                                    width: "100%",
                                    cursor: "pointer",
                                    fontWeight: "bold",
                                }}
                            >
                                Pay with Cash App
                            </button>
                        </a>

                        {/* Placeholder for other payment methods */}
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                className="py-3 px-4 border border-gray-700 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 transition-colors"
                                disabled
                            >
                                PayPal (Coming Soon)
                            </button>
                            <button
                                className="py-3 px-4 border border-gray-700 rounded-lg text-sm font-medium text-gray-400 hover:bg-gray-800 transition-colors"
                                disabled
                            >
                                Stripe (Coming Soon)
                            </button>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-800"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-900 text-gray-500">After Payment</span>
                        </div>
                    </div>

                    {/* Code Redemption */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-gray-400">
                            <Key className="w-4 h-4 inline mr-2" />
                            Enter Subscription Code
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.toUpperCase())}
                            placeholder="XXXX-XXXX-XXXX"
                            className="w-full px-3 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                        />
                        {codeError && (
                            <p className="text-red-500 text-sm">{codeError}</p>
                        )}
                        <button
                            onClick={handleRedeemCode}
                            disabled={loading || !code}
                            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 flex items-center justify-center"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Activating...
                                </>
                            ) : (
                                "Activate Subscription"
                            )}
                        </button>
                    </div>

                </div>

                <div className="text-center text-xs text-gray-500 pt-4">
                    <p>After payment, you'll receive a code via email</p>
                    <p className="mt-1">Enter the code above to activate your subscription</p>
                </div>
            </div>
        </div>
    );
}
