const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface Question {
    id?: string;
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

    generateSystemDesignQuestion: async (topic: string, difficulty: string): Promise<Question> => {
        const response = await fetch(`${API_BASE_URL}/generate_system_design_question`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic, difficulty }),
        });
        if (!response.ok) throw new Error("Failed to generate system design question");
        return response.json();
    },

    generateProductionQuestion: async (topic: string, difficulty: string): Promise<Question> => {
        const response = await fetch(`${API_BASE_URL}/generate_production_question`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic, difficulty }),
        });
        if (!response.ok) throw new Error("Failed to generate production question");
        return response.json();
    },

    generatePaperQuestion: async (topic: string, difficulty: string): Promise<Question> => {
        const response = await fetch(`${API_BASE_URL}/generate_paper_question`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic, difficulty }),
        });
        if (!response.ok) throw new Error("Failed to generate paper question");
        return response.json();
    },

    generateInterviewQuestion: async (topic: string, difficulty: string): Promise<Question> => {
        const response = await fetch(`${API_BASE_URL}/generate_interview_question`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ topic, difficulty }),
        });
        if (!response.ok) throw new Error("Failed to generate interview question");
        return response.json();
    },

    gradeSubmission: async (code: string, questionTitle: string, questionDescription: string) => {
        const response = await fetch(`${API_BASE_URL}/grade_submission`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                code,
                question_title: questionTitle,
                question_description: questionDescription
            }),
        });
        if (!response.ok) throw new Error("Failed to grade submission");
        return response.json();
    },

    uploadCSV: async (file: File): Promise<{ file_id: string; metadata: CSVMetadata }> => {
        const formData = new FormData();
        formData.append("file", file);
        const response = await fetch(`${API_BASE_URL}/ml/upload`, {
            method: "POST",
            body: formData,
        });
        if (!response.ok) throw new Error("Failed to upload CSV");
        return response.json();
    },

    trainMLModel: async (fileId: string, targetColumn: string, modelType: string, taskType: string = "classification"): Promise<MLTrainingResult> => {
        const response = await fetch(`${API_BASE_URL}/ml/train`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                file_id: fileId,
                target_column: targetColumn,
                model_type: modelType,
                task_type: taskType
            }),
        });
        if (!response.ok) throw new Error("Failed to train model");
        return response.json();
    },

    getMLInsight: async (results: MLTrainingResult, modelType: string): Promise<{ insight: string }> => {
        const response = await fetch(`${API_BASE_URL}/ml/insight`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ results, model_type: modelType }),
        });
        if (!response.ok) throw new Error("Failed to generate insight");
        return response.json();
    },
};

export interface CSVMetadata {
    columns: string[];
    head: Record<string, unknown>[];
    shape: [number, number];
    dtypes: Record<string, string>;
    summary: Record<string, unknown>;
}

export interface MLTrainingResult {
    metrics: {
        accuracy?: number;
        mse?: number;
        r2?: number;
        mae?: number;
        classification_report?: string | Record<string, unknown>;
        confusion_matrix?: number[][];
        [key: string]: unknown;
    };
    feature_importance?: Record<string, number>;
    visualization?: {
        features: string[];
        data: { x: number; y: number; label: string | number; prediction: string | number }[];
        type?: "classification" | "regression";
    };
    error?: string;
    model_type?: string;
}
