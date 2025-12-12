import React, { useState, useEffect, useRef } from "react";
import { Question } from "@/lib/api";
import { Send, User, Bot, Loader2 } from "lucide-react";

interface InterviewPanelProps {
    question: Question;
    feedback: {
        correctness_score: number;
        efficiency_score: number;
        style_score: number;
        feedback: string;
        time_complexity: string;
        space_complexity: string;
    } | null;
}

interface Message {
    id: string;
    role: "system" | "user" | "assistant";
    content: string;
    timestamp: number;
}

export const InterviewPanel: React.FC<InterviewPanelProps> = ({ question, feedback }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [typing, setTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const hasInitialized = useRef(false);

    // Initial greeting and problem presentation
    useEffect(() => {
        if (hasInitialized.current || !question) return;
        hasInitialized.current = true;

        const initialMessages: Message[] = [
            {
                id: "1",
                role: "assistant",
                content: `Hi there! I'm your AI Interviewer today. We'll be working on a ${question.difficulty} level problem in ${question.topic}.`,
                timestamp: Date.now(),
            },
        ];

        setMessages(initialMessages);

        // Simulate typing for the problem description
        setTimeout(() => {
            setTyping(true);
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: "2",
                        role: "assistant",
                        content: `**${question.title}**\n\n${question.description}`,
                        timestamp: Date.now(),
                    },
                ]);
                setTyping(false);
            }, 1500);
        }, 800);
    }, [question]);

    // Handle Feedback Updates (User "submitted" code externally)
    useEffect(() => {
        if (feedback) {
            setTyping(true);
            setTimeout(() => {
                setMessages((prev) => [
                    ...prev,
                    {
                        id: Date.now().toString(),
                        role: "user",
                        content: "I've submitted my solution. Can you review it?",
                        timestamp: Date.now(),
                    },
                ]);

                setTimeout(() => {
                    const score = Math.round((feedback.correctness_score + feedback.efficiency_score + feedback.style_score) / 3);
                    const feedbackMsg = `
### Score: ${score}/10

**Correctness**: ${feedback.correctness_score}/10
**Efficiency**: ${feedback.efficiency_score}/10
**Style**: ${feedback.style_score}/10

**Time Complexity**: ${feedback.time_complexity}
**Space Complexity**: ${feedback.space_complexity}

${feedback.feedback}
                    `;

                    setMessages((prev) => [
                        ...prev,
                        {
                            id: (Date.now() + 1).toString(),
                            role: "assistant",
                            content: feedbackMsg,
                            timestamp: Date.now(),
                        },
                    ]);
                    setTyping(false);
                }, 2000);
            }, 500);
        }
    }, [feedback]);


    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, typing]);

    return (
        <div className="flex flex-col h-full bg-gray-900/50 rounded-xl border border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="h-14 bg-gray-900 border-b border-gray-800 flex items-center px-4 justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 flex items-center justify-center">
                        <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <div className="font-bold text-sm text-white">AI Interviewer</div>
                        <div className="text-xs text-green-400 flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                            Online
                        </div>
                    </div>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                        <div
                            className={`max-w-[85%] rounded-2xl p-4 ${msg.role === "user"
                                    ? "bg-blue-600 text-white rounded-br-none"
                                    : "bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700"
                                }`}
                        >
                            <div className="prose prose-invert prose-sm max-w-none">
                                {/* Simple markdown rendering for now */}
                                {msg.content.split('\n').map((line, i) => (
                                    <p key={i} className="mb-1 last:mb-0 break-words">{line}</p>
                                ))}
                            </div>
                            <div className={`text-[10px] mt-2 opacity-50 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}

                {typing && (
                    <div className="flex justify-start">
                        <div className="bg-gray-800 rounded-2xl rounded-bl-none p-4 border border-gray-700 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area (Placeholder for V1, since interactions are via code submit) */}
            <div className="p-4 bg-gray-900 border-t border-gray-800">
                <div className="relative">
                    <input
                        type="text"
                        disabled
                        placeholder="Submit your code to get feedback from the interviewer..."
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-4 pr-10 py-3 text-sm text-gray-400 cursor-not-allowed"
                    />
                    <button disabled className="absolute right-2 top-2 p-1 text-gray-500">
                        <Send className="w-4 h-4" />
                    </button>
                </div>
                <div className="text-center mt-2">
                    <p className="text-xs text-gray-500">
                        Write your solution in the editor and click <span className="text-green-400 font-bold">Submit</span> to respond.
                    </p>
                </div>
            </div>
        </div>
    );
};
