import React from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

interface QuestionDisplayProps {
    title: string;
    description: string;
    difficulty: "Basic" | "Intermediate" | "Advanced";
    topic: string;
}

export const QuestionDisplay: React.FC<QuestionDisplayProps> = ({
    title,
    description,
    difficulty,
    topic,
}) => {
    const difficultyColor = {
        Basic: "text-green-400 border-green-400/30 bg-green-400/10",
        Intermediate: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10",
        Advanced: "text-red-400 border-red-400/30 bg-red-400/10",
    };

    return (
        <div className="h-full flex flex-col space-y-6 p-6 bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-y-auto">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
                    <span
                        className={cn(
                            "px-3 py-1 rounded-full text-xs font-medium border",
                            difficultyColor[difficulty] || difficultyColor.Basic
                        )}
                    >
                        {difficulty}
                    </span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span className="px-2 py-0.5 rounded bg-gray-800 border border-gray-700">
                        {topic}
                    </span>
                </div>
            </div>

            <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-code:text-blue-300 prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-800">
                <ReactMarkdown>{description}</ReactMarkdown>
            </div>
        </div>
    );
};
