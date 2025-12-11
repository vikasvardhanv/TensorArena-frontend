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
    answer?: string;
    explanation?: string;
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
                answer: questionData.answer,
                explanation: questionData.explanation,
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
                    answer: unseenQuestion.answer,
                    explanation: unseenQuestion.explanation,
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
        await prisma.userQuestionAttempt.upsert({
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

// Role-based question persistence
interface RoleBasedQuestionData {
    title: string;
    scenario: string;
    type: string;
    role: string;
    options?: string[];
    correctAnswer?: number | string;
    explanation?: string;
    codeSnippet?: string;
    expectedOutput?: string;
}

export async function saveRoleBasedQuestion(questionData: RoleBasedQuestionData) {
    try {
        // Check if question already exists
        const existing = await prisma.question.findFirst({
            where: {
                title: questionData.title,
                topic: `role-based:${questionData.role}`,
            },
        });

        if (existing) {
            return { success: true, questionId: existing.id, isNew: false };
        }

        // Store role-based question using existing schema
        // Use testCases array to store structured data as JSON strings
        const structuredData = {
            type: questionData.type,
            options: questionData.options,
            correctAnswer: questionData.correctAnswer,
            codeSnippet: questionData.codeSnippet,
            expectedOutput: questionData.expectedOutput,
        };

        const question = await prisma.question.create({
            data: {
                title: questionData.title,
                description: questionData.scenario,
                difficulty: "Intermediate", // Default for role-based
                topic: `role-based:${questionData.role}`,
                testCases: [JSON.stringify(structuredData)],
                solutionTemplate: questionData.codeSnippet || "",
                answer: String(questionData.correctAnswer || ""),
                explanation: questionData.explanation,
            },
        });

        return { success: true, questionId: question.id, isNew: true };
    } catch (error) {
        console.error("Error saving role-based question:", error);
        return { success: false, error: "Failed to save question" };
    }
}

export async function getUnseenRoleBasedQuestions(role: string, count: number = 3) {
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

        // Get unseen role-based questions
        const unseenQuestions = await prisma.question.findMany({
            where: {
                topic: `role-based:${role}`,
                attempts: {
                    none: {
                        userId: user.id,
                    },
                },
            },
            take: count,
            orderBy: {
                createdAt: "desc",
            },
        });

        if (unseenQuestions.length > 0) {
            // Transform back to RoleBasedQuestion format
            const questions = unseenQuestions.map(q => {
                const structuredData = q.testCases[0] ? JSON.parse(q.testCases[0]) : {};
                return {
                    id: q.id,
                    title: q.title,
                    scenario: q.description,
                    type: structuredData.type || "multiple-choice",
                    role: role,
                    options: structuredData.options,
                    correctAnswer: q.answer ? (isNaN(Number(q.answer)) ? q.answer : Number(q.answer)) : undefined,
                    explanation: q.explanation,
                    codeSnippet: structuredData.codeSnippet,
                    expectedOutput: structuredData.expectedOutput,
                };
            });

            return { success: true, questions };
        }

        return { success: false, error: "No unseen questions available" };
    } catch (error) {
        console.error("Error getting unseen role-based questions:", error);
        return { success: false, error: "Failed to get questions" };
    }
}

export async function submitRoleBasedAnswer(questionId: string, answer: number | string) {
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

        // Record the attempt
        await prisma.userQuestionAttempt.upsert({
            where: {
                userId_questionId: {
                    userId: user.id,
                    questionId: questionId,
                },
            },
            update: {
                code: String(answer),
                status: "completed",
                completedAt: new Date(),
            },
            create: {
                userId: user.id,
                questionId,
                code: String(answer),
                status: "completed",
                completedAt: new Date(),
            },
        });

        revalidatePath("/role-arena");
        return { success: true };
    } catch (error) {
        console.error("Error submitting answer:", error);
        return { success: false, error: "Failed to submit answer" };
    }
}
