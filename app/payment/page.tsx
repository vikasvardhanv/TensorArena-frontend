"use client";

import { useState } from "react";
import { redeemSubscriptionCode, processPaymentAndGenerateCode } from "../actions/payment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CheckCircle, DollarSign, Loader2, Key } from "lucide-react";
import Script from "next/script";
import Image from "next/image";

declare global {
    interface Window {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        paypal?: any;
    }
}

export default function PaymentPage() {
    const { data: session, update } = useSession();
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState("");
    const [codeError, setCodeError] = useState("");
    const router = useRouter();



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
        } catch {
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
            <Script
                src="https://www.paypal.com/sdk/js?client-id=AdiUHvKx07wVXr33YRXPrAFxVD11UaYCQVOhfKUBmZwx5xo9Uj0sMEdok7eRBIPv4QxOFtU5aKNZOlR1&vault=true&intent=subscription"
                strategy="afterInteractive"
                data-sdk-integration-source="button-factory"
                onLoad={() => {
                    if (window.paypal) {
                        try {
                            window.paypal.Buttons({
                                style: {
                                    shape: 'pill',
                                    color: 'blue',
                                    layout: 'horizontal',
                                    label: 'subscribe'
                                },
                                createSubscription: (data: any, actions: any) => {
                                    return actions.subscription.create({
                                        /* Creates the subscription */
                                        plan_id: 'P-36J38125SY7265158NE3YEXA'
                                    });
                                },
                                onApprove: async (data: any, actions: any) => {
                                    try {
                                        console.log("Subscription successful, ID:", data.subscriptionID);

                                        setLoading(true);
                                        // Call server action to generate code
                                        const result = await processPaymentAndGenerateCode(data.subscriptionID);

                                        if (result.success && result.code) {
                                            router.push(`/payment/success?code=${result.code}`);
                                        } else {
                                            alert("Payment successful but failed to generate code. Please contact support.");
                                            setLoading(false);
                                        }
                                    } catch (err) {
                                        console.error("Payment processing error:", err);
                                        alert("An error occurred while processing your payment.");
                                        setLoading(false);
                                    }
                                },
                                onError: (err: any) => {
                                    console.error("PayPal error:", err);
                                    alert("There was an error with PayPal.");
                                }
                            }).render("#paypal-button-container-P-36J38125SY7265158NE3YEXA");
                        } catch (error) {
                            console.error("PayPal button render error:", error);
                        }
                    }
                }}
            />
            <div className="max-w-md w-full space-y-8 p-8 bg-gray-900/50 rounded-2xl border border-gray-800">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-500 mb-6">
                        <DollarSign className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl font-bold">Unlock Premium</h2>
                    <div className="mt-4 flex flex-col items-center justify-center space-y-1">
                        <div className="flex items-center space-x-2 text-lg">
                            <span className="text-gray-400">Get unlimited access to AI challenges</span>
                        </div>
                        <div className="flex items-baseline space-x-2">
                            <span className="text-gray-500 line-through text-lg">$29.99</span>
                            <span className="text-blue-500 font-bold text-2xl">$19.99/month</span>
                        </div>
                        <p className="text-xs text-red-400 font-medium pt-2">Payments are non-refundable</p>
                    </div>
                </div>

                <div className="space-y-6 pt-4">
                    {/* Payment Options */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-gray-400 uppercase tracking-wider">Payment Options</h3>

                        {/* PayPal Button Container */}
                        <div id="paypal-button-container-P-36J38125SY7265158NE3YEXA" className="w-full min-h-[45px]" style={{ display: 'block' }}></div>

                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-gray-800"></div>
                            <span className="flex-shrink-0 mx-4 text-gray-500 text-xs">OR USE QR CODE</span>
                            <div className="flex-grow border-t border-gray-800"></div>
                        </div>

                        {/* QR Code Section */}
                        <div className="flex flex-col items-center space-y-2 p-4 bg-white/5 rounded-lg border border-gray-800/50">
                            <div className="relative w-48 h-48 bg-white p-2 rounded-lg">
                                <Image
                                    src="/qr-code.png"
                                    alt="Payment QR Code"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <p className="text-xs text-gray-400 text-center">Scan to pay via supported apps</p>
                        </div>

                        <a
                            href="https://cash.app/$YourCashtag"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block w-full hidden" // Hidden but kept for reference if needed
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
                    <p>After payment, you&apos;ll receive a code via email</p>
                    <p className="mt-1">Enter the code above to activate your subscription</p>
                </div>
            </div>
        </div>
    );
}
