import React from "react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Info, CheckCircle2, Code } from "lucide-react";

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

            {/* Instructions Panel */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2 text-blue-400">
                    <Info className="w-5 h-5" />
                    <h3 className="font-semibold">How to Solve</h3>
                </div>
                <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-start space-x-2">
                        <Code className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                        <p><strong>1. Write your solution</strong> in the code editor on the right</p>
                    </div>
                    <div className="flex items-start space-x-2">
                        <Code className="w-4 h-4 mt-0.5 text-blue-400 flex-shrink-0" />
                        <p><strong>2. Test your code</strong> by clicking "Run Code" to see the output</p>
                    </div>
                    <div className="flex items-start space-x-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-green-400 flex-shrink-0" />
                        <p><strong>3. Submit</strong> when ready - your solution will be evaluated against test cases</p>
                    </div>
                </div>
                <div className="pt-2 border-t border-blue-500/20">
                    <p className="text-xs text-gray-400">
                        💡 <strong>Tip:</strong> The code template includes all necessary imports.
                        You can run the code directly in your Python CLI or use the "Run Code" button.
                    </p>
                </div>
            </div>

            {/* Problem Description */}
            <div className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-white prose-code:text-blue-300 prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-800">
                <ReactMarkdown>{description}</ReactMarkdown>
            </div>

            {/* Expected Output Info */}
            <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">What Happens When You Submit?</h4>
                <ul className="text-sm text-gray-400 space-y-1 list-disc list-inside">
                    <li>Your code will be tested against multiple test cases</li>
                    <li>You'll receive immediate feedback on correctness</li>
                    <li>Performance metrics (time/space complexity) will be shown</li>
                    <li>Hints will be provided if your solution doesn't pass</li>
                </ul>
            </div>
        </div>
    );
};
