"use server";

import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";

interface QuestionData {
    title: string;
    description: string;
    difficulty: string;
    topic: string;
    test_cases: string[];
    solution_template: string;
}

export async function saveQuestion(questionData: QuestionData) {
    try {
        // Check if question already exists (by title and topic)
        const existing = await prisma.question.findFirst({
            where: {
                title: questionData.title,
                topic: questionData.topic,
            },
        });

        if (existing) {
            return { success: true, questionId: existing.id, isNew: false };
        }

        // Save new question
        const question = await prisma.question.create({
            data: {
                title: questionData.title,
                description: questionData.description,
                difficulty: questionData.difficulty,
                topic: questionData.topic,
                testCases: questionData.test_cases,
                solutionTemplate: questionData.solution_template,
            },
        });

        return { success: true, questionId: question.id, isNew: true };
    } catch (error) {
        console.error("Error saving question:", error);
        return { success: false, error: "Failed to save question" };
    }
}

export async function getUnseenQuestion(topic: string, difficulty: string) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return { success: false, error: "Not authenticated" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        // Get questions the user hasn't seen yet
        const unseenQuestion = await prisma.question.findFirst({
            where: {
                topic,
                difficulty,
                attempts: {
                    none: {
                        userId: user.id,
                    },
                },
            },
            orderBy: {
                createdAt: "desc", // Get newest questions first
            },
        });

        if (unseenQuestion) {
            return {
                success: true,
                question: {
                    id: unseenQuestion.id,
                    title: unseenQuestion.title,
                    description: unseenQuestion.description,
                    difficulty: unseenQuestion.difficulty,
                    topic: unseenQuestion.topic,
                    test_cases: unseenQuestion.testCases,
                    solution_template: unseenQuestion.solutionTemplate,
                },
            };
        }

        return { success: false, error: "No unseen questions available" };
    } catch (error) {
        console.error("Error getting unseen question:", error);
        return { success: false, error: "Failed to get question" };
    }
}

export async function markQuestionAsSeen(questionId: string) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return { success: false, error: "Not authenticated" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        // Create an attempt record to mark question as "seen"
        // This prevents the question from appearing again for this user
        await prisma.userQuestionAttempt.upsert({
            where: {
                userId_questionId: {
                    userId: user.id,
                    questionId: questionId,
                },
            },
            update: {
                // If already exists, don't change anything
            },
            create: {
                userId: user.id,
                questionId,
                status: "pending",
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Error marking question as seen:", error);
        return { success: false, error: "Failed to mark question as seen" };
    }
}

export async function saveUserAttempt(questionId: string, code: string, status: string = "pending") {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return { success: false, error: "Not authenticated" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        // Upsert user attempt
        const attempt = await prisma.userQuestionAttempt.upsert({
            where: {
                userId_questionId: {
                    userId: user.id,
                    questionId: questionId,
                },
            },
            update: {
                code,
                status,
                completedAt: status === "passed" ? new Date() : null,
            },
            create: {
                userId: user.id,
                questionId,
                code,
                status,
            },
        });

        revalidatePath("/arena");
        return { success: true, attemptId: attempt.id };
    } catch (error) {
        console.error("Error saving attempt:", error);
        return { success: false, error: "Failed to save attempt" };
    }
}

export async function submitSolution(questionId: string, code: string, output: string) {
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.email) {
        return { success: false, error: "Not authenticated" };
    }

    try {
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return { success: false, error: "User not found" };
        }

        // For now, mark as "passed" - you can add test case validation later
        const attempt = await prisma.userQuestionAttempt.upsert({
            where: {
                userId_questionId: {
                    userId: user.id,
                    questionId: questionId,
                },
            },
            update: {
                code,
                status: "passed",
                output,
                completedAt: new Date(),
            },
            create: {
                userId: user.id,
                questionId,
                code,
                status: "passed",
                output,
                completedAt: new Date(),
            },
        });

        revalidatePath("/arena");
        return {
            success: true,
            status: "passed",
            message: "Solution submitted successfully!",
        };
    } catch (error) {
        console.error("Error submitting solution:", error);
        return { success: false, error: "Failed to submit solution" };
    }
}
