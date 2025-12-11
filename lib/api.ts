const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Question {
    title: string;
    description: string;
    difficulty: "Basic" | "Intermediate" | "Advanced";
    topic: string;
    test_cases: string[];
    solution_template: string;
    answer?: string;
    explanation?: string;
}

export type QuestionType = "multiple-choice" | "fill-in-blank" | "output-selection" | "coding";

export interface RoleBasedQuestion {
    id?: string;
    title: string;
    scenario: string;
    type: QuestionType;
    role: string;
    options?: string[];
    correctAnswer?: number | string;
    explanation?: string;
    codeSnippet?: string;
    expectedOutput?: string;
    blanks?: string[];
}

export const api = {
    generateQuestion: async (
        topic: string,
        difficulty: string,
        userContext?: string
    ): Promise<Question> => {
        const response = await fetch(`${API_BASE_URL}/generate_question`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ topic, difficulty, user_context: userContext }),
        });

        if (!response.ok) {
            throw new Error("Failed to generate question");
        }

        return response.json();
    },

    executeCode: async (code: string): Promise<{ output: string; error: string | null }> => {
        const response = await fetch(`${API_BASE_URL}/execute_code`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
        });

        if (!response.ok) {
            throw new Error("Failed to execute code");
        }

        return response.json();
    },

    generateRoleBasedQuestions: async (
        role: string,
        count: number = 3
    ): Promise<RoleBasedQuestion[]> => {
        const response = await fetch(`${API_BASE_URL}/generate_role_questions`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ role, count }),
        });

        if (!response.ok) {
            let errorMessage = "Failed to generate role-based questions";
            try {
                const errorData = await response.json();
                if (errorData.detail) {
                    errorMessage = errorData.detail;
                }
            } catch {
                // If we can't parse the error, use the default message
            }
            throw new Error(errorMessage);
        }

        return response.json();
    },
};
