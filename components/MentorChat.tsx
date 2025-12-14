"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, Sparkles, User, RefreshCcw } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { incrementQuestionUsage } from "@/app/actions/questions";
import { PaymentModal } from "@/components/PaymentModal";

interface Message {
    role: 'user' | 'model';
    parts: string[];
}

export default function MentorChat() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Usage tracking
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [usageStats, setUsageStats] = useState({ used: 0, subscribed: false });
    const [sessionAllowed, setSessionAllowed] = useState(false);

    useEffect(() => {
        // Check limit on mount
        const checkLimit = async () => {
            const result = await incrementQuestionUsage();
            if (!result.success && result.requiresPayment) {
                setShowPaymentModal(true);
                setUsageStats({ used: 5, subscribed: false }); // Assume max used if blocked
            } else {
                setSessionAllowed(true);
                // Optional: You could fetch actual usage here if needed for display, 
                // but incrementQuestionUsage returns it in result.questionsUsed
                if (result.success) {
                    setUsageStats({
                        used: result.questionsUsed || 0,
                        subscribed: false // We assume false if we are checking usage, but result doesn't explicitly return isSubscribed boolean in the same way always, checks logic
                    });
                }
            }
        };

        checkLimit();
    }, []);

    const suggestedTopics = [
        "Teach me Machine Learning",
        "Explain Neural Networks",
        "How do LLMs work?",
        "Python for Data Science path"
    ];

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSend = async (text: string = input) => {
        if (!text.trim() || isLoading) return;

        // Final gate check
        if (!sessionAllowed) {
            setShowPaymentModal(true);
            return;
        }

        const userMessage: Message = { role: 'user', parts: [text] };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const apiHistory = messages.map(m => ({
                role: m.role,
                parts: m.parts
            }));

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/mentor/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: apiHistory
                })
            });

            if (!response.ok) throw new Error('Failed to get response');

            const data = await response.json();
            const botMessage: Message = { role: 'model', parts: [data.response] };
            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            // Optional: add error message to chat
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden shadow-2xl relative">
            {/* Header */}
            <div className="p-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center text-purple-400">
                    <Bot className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-white">Adaptive AI Mentor</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${sessionAllowed ? "bg-green-500 animate-pulse" : "bg-red-500"}`} />
                        {sessionAllowed ? "Online & Ready to Teach" : "Limit Reached"}
                    </p>
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent" ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="text-center py-12">
                        <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4 opacity-50" />
                        <h4 className="text-xl font-bold text-white mb-2">What would you like to learn?</h4>
                        <p className="text-gray-400 mb-8 max-w-md mx-auto">
                            I can help you master AI concepts, design learning paths, or explain complex algorithms from scratch.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-lg mx-auto">
                            {suggestedTopics.map((topic) => (
                                <button
                                    key={topic}
                                    onClick={() => handleSend(topic)}
                                    // Disable if session not allowed
                                    disabled={!sessionAllowed}
                                    className={`p-3 text-sm text-left bg-gray-800/50 border border-gray-700 rounded-xl transition-all ${sessionAllowed
                                        ? "hover:bg-gray-800 hover:border-purple-500/50 text-gray-300 hover:text-white"
                                        : "opacity-50 cursor-not-allowed"
                                        }`}
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'model' && (
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex-shrink-0 flex items-center justify-center text-purple-400 mt-1">
                                <Bot className="w-4 h-4" />
                            </div>
                        )}
                        <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user'
                            ? 'bg-purple-600 text-white rounded-br-none'
                            : 'bg-gray-800/80 text-gray-200 rounded-bl-none border border-gray-700'
                            }`}>
                            <div className="prose prose-invert prose-sm max-w-none">
                                <ReactMarkdown>{msg.parts[0]}</ReactMarkdown>
                            </div>
                        </div>
                        {msg.role === 'user' && (
                            <div className="w-8 h-8 rounded-full bg-blue-500/20 flex-shrink-0 flex items-center justify-center text-blue-400 mt-1">
                                <User className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex gap-4">
                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex-shrink-0 flex items-center justify-center text-purple-400">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="bg-gray-800/80 rounded-2xl rounded-bl-none p-4 border border-gray-700 flex gap-1 items-center h-10">
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-900 border-t border-gray-800">
                <div className="relative flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={sessionAllowed ? "Ask anything about AI..." : "Usage limit reached."}
                        className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-purple-500 focus:border-purple-500 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isLoading || !sessionAllowed}
                    />
                    <button
                        onClick={() => handleSend()}
                        disabled={isLoading || !input.trim() || !sessionAllowed}
                        className="p-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white transition-colors"
                    >
                        {isLoading ? <RefreshCcw className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </div>

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)} // User can close modal but session remains disallowed
                questionsUsed={usageStats.used}
            />
        </div>
    );
}
