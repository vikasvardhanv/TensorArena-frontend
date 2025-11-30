"use server";

import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";

export async function redeemSubscriptionCode(code: string) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return { success: false, message: "Not authenticated" };
    }

    try {
        // Validate code format (simple validation - you can make this more complex)
        if (!code || code.length < 8) {
            return { success: false, message: "Invalid code format" };
        }

        // Calculate expiry date (1 month from now)
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);

        // Update user subscription
        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                isSubscribed: true,
                subscriptionCode: code,
                subscriptionExpiry: expiryDate,
            },
        });

        revalidatePath("/payment");
        revalidatePath("/arena");
        return { success: true, expiryDate: expiryDate.toISOString() };
    } catch (error) {
        console.error("Code redemption error:", error);
        return { success: false, message: "Failed to redeem code" };
    }
}

export async function simulatePaymentSuccess() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return { success: false, message: "Not authenticated" };
    }

    try {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + 1);

        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                isSubscribed: true,
                subscriptionExpiry: expiryDate,
            },
        });

        revalidatePath("/payment");
        revalidatePath("/arena");
        return { success: true };
    } catch (error) {
        console.error("Payment simulation error:", error);
        return { success: false, message: "Failed to update subscription" };
    }
}
