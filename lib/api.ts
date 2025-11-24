const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Question {
    title: string;
    description: string;
    difficulty: "Basic" | "Intermediate" | "Advanced";
    topic: string;
    test_cases: string[];
    solution_template: string;
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
};
