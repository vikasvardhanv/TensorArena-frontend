"use server";

import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";

// Generate a unique subscription code in format XXXX-XXXX-XXXX
function generateCodeString(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Exclude similar looking characters
    const segments = 3;
    const segmentLength = 4;

    const code = Array.from({ length: segments }, () =>
        Array.from({ length: segmentLength }, () =>
            chars.charAt(Math.floor(Math.random() * chars.length))
        ).join("")
    ).join("-");

    return code;
}

// Process payment and generate subscription code
export async function processPaymentAndGenerateCode(subscriptionId: string) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return { success: false, message: "Not authenticated" };
    }

    // In a production environment with Client Secret, we would:
    // 1. Call PayPal API to verify orderId exists and is COMPLETED
    // 2. Verify the amount matches expected price
    // Since we don't have the secret, we trust the client-side onApprove for now,
    // which is still better than an open URL.
    console.log(`Processing subscription: ${subscriptionId} by user: ${session.user.email}`);

    try {
        let code: string;
        let isUnique = false;

        // Keep generating until we get a unique code
        while (!isUnique) {
            code = generateCodeString();
            const existing = await prisma.subscriptionCode.findUnique({
                where: { code }
            });
            if (!existing) {
                isUnique = true;

                // Create the code in database
                await prisma.subscriptionCode.create({
                    data: {
                        code,
                        // potentially store orderId if we added a column for it
                    }
                });

                return { success: true, code };
            }
        }

        return { success: false, message: "Failed to generate unique code" };
    } catch (error) {
        console.error("Code generation error:", error);
        return { success: false, message: "Failed to generate code" };
    }
}

export async function redeemSubscriptionCode(code: string) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return { success: false, message: "Not authenticated" };
    }

    try {
        // Find the user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return { success: false, message: "User not found" };
        }

        // Validate code format
        if (!code || !/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) {
            return { success: false, message: "Invalid code format" };
        }

        // Find the subscription code
        const subscriptionCode = await prisma.subscriptionCode.findUnique({
            where: { code: code.toUpperCase() }
        });

        if (!subscriptionCode) {
            return { success: false, message: "Invalid code" };
        }

        if (subscriptionCode.isUsed) {
            return { success: false, message: "Code has already been used" };
        }

        // Calculate expiry date (30 days from now)
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);

        // Update user subscription and mark code as used
        await prisma.$transaction([
            prisma.user.update({
                where: { id: user.id },
                data: {
                    isSubscribed: true,
                    subscriptionCode: code,
                    subscriptionExpiry: expiryDate,
                },
            }),
            prisma.subscriptionCode.update({
                where: { code: code.toUpperCase() },
                data: {
                    isUsed: true,
                    usedBy: user.id,
                    usedAt: new Date(),
                },
            }),
        ]);

        revalidatePath("/payment");
        revalidatePath("/arena");
        return { success: true, expiryDate: expiryDate.toISOString() };
    } catch (error) {
        console.error("Code redemption error:", error);
        return { success: false, message: "Failed to redeem code" };
    }
}
