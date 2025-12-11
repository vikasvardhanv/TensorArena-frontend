"use client";

import React, { useState, useEffect } from "react";
import { Code2, Network, Brain, MessageSquare, Clock, Building2, Zap, Play, Home } from "lucide-react";
import Link from "next/link";

interface InterviewType {
    id: string;
    title: string;
    icon: typeof Code2;
    description: string;
    duration: string;
    color: string;
    bg: string;
}

const interviewTypes: InterviewType[] = [
    {
        id: "coding",
        title: "Coding Interview",
        icon: Code2,
        description: "Algorithm and data structure problems with code execution",
        duration: "45-60 min",
        color: "text-blue-400",
        bg: "bg-blue-400/10"
    },
    {
        id: "system-design",
        title: "ML System Design",
        icon: Network,
        description: "Design scalable ML systems and architectures",
        duration: "60-90 min",
        color: "text-purple-400",
        bg: "bg-purple-400/10"
    },
    {
        id: "ml-theory",
        title: "ML Theory & Concepts",
        icon: Brain,
        description: "Deep dive into ML algorithms, math, and fundamentals",
        duration: "30-45 min",
        color: "text-green-400",
        bg: "bg-green-400/10"
    },
    {
        id: "behavioral",
        title: "Behavioral Interview",
        icon: MessageSquare,
        description: "STAR method practice and leadership principles",
        duration: "30-45 min",
        color: "text-yellow-400",
        bg: "bg-yellow-400/10"
    }
];

const companies = [
    "Google", "Meta", "Amazon", "Apple", "Netflix", "Microsoft",
    "OpenAI", "Anthropic", "DeepMind", "Tesla", "NVIDIA"
];

const difficulties = ["Easy", "Medium", "Hard"];

export default function MockInterviewPage() {
    const [selectedType, setSelectedType] = useState<string>("");
    const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Medium");
    const [selectedCompany, setSelectedCompany] = useState<string>("");
    const [timeLimit, setTimeLimit] = useState<boolean>(true);

    const [isVoiceMode, setIsVoiceMode] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");
    const [aiSpeaking, setAiSpeaking] = useState(false);

    // Speech to Text (Web Speech API)
    useEffect(() => {
        if (!('webkitSpeechRecognition' in window)) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recognition.onresult = (event: any) => {
            let finalTranscript = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript;
                }
            }
            if (finalTranscript) {
                setTranscript(prev => prev + " " + finalTranscript);
            }
        };

        if (isListening) {
            recognition.start();
        } else {
            recognition.stop();
        }

        return () => recognition.stop();
    }, [isListening]);

    const speak = (text: string) => {
        if (!isVoiceMode) return;
        setAiSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onend = () => setAiSpeaking(false);
        window.speechSynthesis.speak(utterance);
    };

    const toggleVoiceMode = () => {
        setIsVoiceMode(!isVoiceMode);
        if (isVoiceMode) {
            setIsListening(false);
            window.speechSynthesis.cancel();
        } else {
            speak("Voice mode activated. I am your AI interviewer. Ready to begin?");
        }
    };



    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <div className="container mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-800 hover:border-gray-700 text-gray-400 hover:text-white transition-all mb-6"
                        >
                            <Home className="w-4 h-4" />
                            Return to Hub
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                            Mock Interview Practice
                        </h1>
                        <p className="text-xl text-gray-400 max-w-3xl">
                            Simulate real interview conditions. Now with <span className="text-blue-400 font-bold">Voice Mode</span>.
                        </p>
                    </div>

                    {/* Voice Mode Toggle */}
                    <button
                        onClick={toggleVoiceMode}
                        className={`flex items-center gap-3 px-6 py-4 rounded-xl border transition-all ${isVoiceMode
                            ? "bg-red-500/20 border-red-500 text-red-400 animate-pulse"
                            : "bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700"
                            }`}
                    >
                        <div className={`p-2 rounded-full ${isVoiceMode ? 'bg-red-500 text-white' : 'bg-gray-800'}`}>
                            {isVoiceMode ? <Zap className="w-5 h-5 fill-current" /> : <MessageSquare className="w-5 h-5" />}
                        </div>
                        <div className="text-left">
                            <div className="text-sm font-bold">Voice Mode</div>
                            <div className="text-xs opacity-70">{isVoiceMode ? "Active (Rec/Play)" : "Click to Enable"}</div>
                        </div>
                    </button>
                </div>

                {isVoiceMode && (
                    <div className="mb-8 p-6 rounded-2xl bg-gray-900/80 border border-blue-500/30 backdrop-blur-md relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />

                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            {/* AI Visualizer */}
                            <div className="flex flex-col items-center gap-4 min-w-[150px]">
                                <div className={`w-24 h-24 rounded-full flex items-center justify-center border-4 transition-all ${aiSpeaking ? "border-blue-500 shadow-[0_0_30px_rgba(59,130,246,0.5)] scale-110" : "border-gray-700 bg-black"
                                    }`}>
                                    <Brain className={`w-10 h-10 ${aiSpeaking ? "text-blue-400 animate-bounce" : "text-gray-600"}`} />
                                </div>
                                <span className="text-xs font-bold text-gray-500 tracking-widest uppercase">AI Interviewer</span>
                            </div>

                            {/* Transcript Area */}
                            <div className="flex-1 h-32 bg-black/50 rounded-xl p-4 overflow-y-auto border border-white/5 text-sm font-mono text-gray-300">
                                {transcript || <span className="text-gray-600 italic">Listening to your answer... (Speak clearly)</span>}
                            </div>

                            {/* Controls */}
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => setIsListening(!isListening)}
                                    className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isListening ? "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-900/20" : "bg-gray-800 text-white hover:bg-gray-700"
                                        }`}
                                >
                                    {isListening ? (
                                        <div className="flex gap-1">
                                            <div className="w-1 h-4 bg-white animate-[bounce_1s_infinite]" />
                                            <div className="w-1 h-4 bg-white animate-[bounce_1s_infinite_0.1s]" />
                                            <div className="w-1 h-4 bg-white animate-[bounce_1s_infinite_0.2s]" />
                                        </div>
                                    ) : (
                                        <div className="w-4 h-4 rounded-sm bg-current" /> // Stop icon equivalent or mic
                                    )}
                                    {/* Using svg directly for mic icon simplicity if needed, or lucide equivalent */}
                                </button>
                                <span className="text-center text-xs font-bold text-gray-500">
                                    {isListening ? "Mute" : "Speak"}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Column - Interview Types */}
                    <div className="lg:col-span-2 space-y-6">
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Select Interview Type</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                {interviewTypes.map((type) => (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedType(type.id)}
                                        className={`p-6 rounded-2xl border transition-all text-left ${selectedType === type.id
                                            ? "border-blue-500 bg-blue-500/10"
                                            : "border-gray-800 bg-gray-900/50 hover:border-gray-700"
                                            }`}
                                    >
                                        <div className={`w-12 h-12 rounded-lg ${type.bg} flex items-center justify-center ${type.color} mb-4`}>
                                            <type.icon className="w-6 h-6" />
                                        </div>
                                        <h3 className="text-lg font-bold mb-2">{type.title}</h3>
                                        <p className="text-sm text-gray-400 mb-3">{type.description}</p>
                                        <div className="flex items-center text-xs text-gray-500">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {type.duration}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Difficulty Selection */}
                        <div>
                            <h3 className="text-xl font-bold mb-4">Difficulty Level</h3>
                            <div className="flex gap-3">
                                {difficulties.map((diff) => (
                                    <button
                                        key={diff}
                                        onClick={() => setSelectedDifficulty(diff)}
                                        className={`px-6 py-3 rounded-lg font-medium transition-all ${selectedDifficulty === diff
                                            ? diff === "Easy"
                                                ? "bg-green-500/20 text-green-400 border border-green-500/50"
                                                : diff === "Medium"
                                                    ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/50"
                                                    : "bg-red-500/20 text-red-400 border border-red-500/50"
                                            : "bg-gray-800/50 text-gray-400 border border-gray-800 hover:border-gray-700"
                                            }`}
                                    >
                                        {diff}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Company Selection */}
                        <div>
                            <h3 className="text-xl font-bold mb-4">
                                <Building2 className="w-5 h-5 inline mr-2" />
                                Company-Specific Prep (Optional)
                            </h3>
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                                {companies.map((company) => (
                                    <button
                                        key={company}
                                        onClick={() => setSelectedCompany(selectedCompany === company ? "" : company)}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCompany === company
                                            ? "bg-blue-500/20 text-blue-400 border border-blue-500/50"
                                            : "bg-gray-800/50 text-gray-400 border border-gray-800 hover:border-gray-700"
                                            }`}
                                    >
                                        {company}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Configuration & Start */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50 sticky top-6">
                            <h3 className="text-xl font-bold mb-6">Interview Configuration</h3>

                            <div className="space-y-4 mb-6">
                                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                                    <span className="text-sm text-gray-400">Interview Type</span>
                                    <span className="text-sm font-medium">
                                        {selectedType ? interviewTypes.find(t => t.id === selectedType)?.title : "Not selected"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                                    <span className="text-sm text-gray-400">Difficulty</span>
                                    <span className={`text-sm font-medium ${selectedDifficulty === "Easy" ? "text-green-400" :
                                        selectedDifficulty === "Medium" ? "text-yellow-400" :
                                            "text-red-400"
                                        }`}>
                                        {selectedDifficulty}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                                    <span className="text-sm text-gray-400">Company Focus</span>
                                    <span className="text-sm font-medium">
                                        {selectedCompany || "General"}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                                    <span className="text-sm text-gray-400">Time Limit</span>
                                    <button
                                        onClick={() => setTimeLimit(!timeLimit)}
                                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${timeLimit
                                            ? "bg-blue-500/20 text-blue-400"
                                            : "bg-gray-700 text-gray-400"
                                            }`}
                                    >
                                        {timeLimit ? "Enabled" : "Disabled"}
                                    </button>
                                </div>
                            </div>

                            <Link
                                href="/arena?mode=interview"
                                className={`w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 ${!selectedType ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}`}
                            >
                                <Play className="w-5 h-5" />
                                Start Interview
                            </Link>

                            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <Zap className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                    <div className="text-sm text-gray-300">
                                        <p className="font-medium text-blue-400 mb-1">Pro Tip</p>
                                        <p className="text-gray-400">
                                            Treat this like a real interview. Use a timer, speak your thought process aloud, and ask clarifying questions.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stats Preview */}
                        <div className="p-6 rounded-2xl border border-gray-800 bg-gray-900/50">
                            <h4 className="text-sm font-medium text-gray-400 mb-4">Your Interview Stats</h4>
                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Completed</span>
                                    <span className="text-lg font-bold">0</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Success Rate</span>
                                    <span className="text-lg font-bold text-green-400">--%</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-400">Avg. Score</span>
                                    <span className="text-lg font-bold text-blue-400">--</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
