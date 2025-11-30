"use server";

import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";

export async function incrementQuestionUsage() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return { success: false, message: "Not authenticated" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return { success: false, message: "User not found" };
        }

        // Check if user can generate questions
        if (!user.isSubscribed && user.questionsUsed >= user.freeQuestionLimit) {
            return {
                success: false,
                message: "Free question limit reached",
                requiresPayment: true,
            };
        }

        // Increment usage
        await prisma.user.update({
            where: { email: session.user.email },
            data: {
                questionsUsed: user.questionsUsed + 1,
            },
        });

        revalidatePath("/arena");
        return {
            success: true,
            questionsUsed: user.questionsUsed + 1,
            questionsRemaining: user.isSubscribed
                ? -1
                : user.freeQuestionLimit - (user.questionsUsed + 1),
        };
    } catch (error) {
        console.error("Question tracking error:", error);
        return { success: false, message: "Failed to track question usage" };
    }
}

export async function checkQuestionLimit() {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return { canGenerate: false, message: "Not authenticated" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return { canGenerate: false, message: "User not found" };
        }

        const canGenerate =
            user.isSubscribed || user.questionsUsed < user.freeQuestionLimit;

        return {
            canGenerate,
            questionsUsed: user.questionsUsed,
            questionsRemaining: user.isSubscribed
                ? -1
                : user.freeQuestionLimit - user.questionsUsed,
            isSubscribed: user.isSubscribed,
        };
    } catch (error) {
        console.error("Question limit check error:", error);
        return { canGenerate: false, message: "Failed to check limit" };
    }
}
