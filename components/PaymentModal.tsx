"use client";

import { useRouter } from "next/navigation";
import { X, Lock, Zap } from "lucide-react";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    questionsUsed: number;
}

export function PaymentModal({ isOpen, onClose, questionsUsed }: PaymentModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="relative max-w-md w-full bg-gray-900 rounded-2xl border border-gray-800 p-8 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="text-center space-y-6">
                    <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-500">
                        <Lock className="w-8 h-8" />
                    </div>

                    <div>
                        <h2 className="text-2xl font-bold mb-2">Free Questions Exhausted</h2>
                        <p className="text-gray-400">
                            You&apos;ve used all {questionsUsed} free questions. Upgrade to Premium for unlimited access!
                        </p>
                    </div>

                    <div className="bg-gray-800/50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center space-x-3">
                            <Zap className="w-5 h-5 text-blue-500" />
                            <span className="text-sm">Unlimited AI-generated questions</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Zap className="w-5 h-5 text-blue-500" />
                            <span className="text-sm">Code execution & testing</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Zap className="w-5 h-5 text-blue-500" />
                            <span className="text-sm">MIT/Harvard level challenges</span>
                        </div>
                    </div>

                    <div className="text-3xl font-bold text-blue-500">$9.99/month</div>

                    <button
                        onClick={() => router.push("/payment")}
                        className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors"
                    >
                        Upgrade to Premium
                    </button>

                    <button
                        onClick={onClose}
                        className="w-full py-2 text-gray-400 hover:text-white transition-colors text-sm"
                    >
                        Maybe later
                    </button>
                </div>
            </div>
        </div>
    );
}
