import React from "react";
import Link from "next/link";
import { ArrowLeft, QrCode } from "lucide-react";

export default function PaymentPage() {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
            <div className="absolute top-6 left-6">
                <Link
                    href="/"
                    className="inline-flex items-center text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Home
                </Link>
            </div>

            <div className="max-w-md w-full bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 text-center space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
                        Support the Platform
                    </h1>
                    <p className="text-gray-400">
                        Unlock premium features and support our AI infrastructure.
                    </p>
                </div>

                <div className="relative aspect-square w-64 mx-auto bg-white rounded-xl flex items-center justify-center overflow-hidden">
                    {/* Placeholder for QR Code */}
                    <div className="text-black flex flex-col items-center space-y-2">
                        <QrCode className="w-16 h-16" />
                        <span className="font-bold">Cash App QR</span>
                        <span className="text-xs text-gray-500">Upload your QR code to public/qr.png</span>
                    </div>
                    {/* Uncomment below when you have the image */}
                    {/* <img src="/qr.png" alt="Cash App QR" className="w-full h-full object-contain" /> */}
                </div>

                <div className="space-y-4">
                    <button className="w-full py-3 rounded-lg bg-[#00D632] hover:bg-[#00bd2c] text-white font-bold transition-colors">
                        Pay with Cash App
                    </button>
                    <p className="text-xs text-gray-500">
                        Secure payment processed via Cash App
                    </p>
                </div>
            </div>
        </div>
    );
}
