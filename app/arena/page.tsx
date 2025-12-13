"use client";

import React, { useState, useEffect } from "react";
import { CodeEditor } from "@/components/CodeEditor";
import { QuestionDisplay } from "@/components/QuestionDisplay";
import { PaymentModal } from "@/components/PaymentModal";
import { api, Question } from "@/lib/api";
import { incrementQuestionUsage, checkQuestionLimit } from "@/app/actions/questions";
import { saveQuestion, getUnseenQuestion, submitSolution, markQuestionAsSeen } from "@/app/actions/questionPersistence";
import { Loader2, Play, RefreshCw, Send, Sparkles, LogOut, Code2, ArrowLeft } from "lucide-react";
import { useSession, signOut, signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

import { Suspense } from "react";
import { InterviewPanel } from "@/components/InterviewPanel";

function ArenaContent() {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const mode = searchParams.get("mode");

    const [question, setQuestion] = useState<Question | null>(null);
    const [code, setCode] = useState<string>(`# Welcome to AI LeetCode Arena!
# 
# Instructions:
# 1. Select your difficulty and topic from the dropdowns above
# 2. Click "Start" to generate a question
# 3. Write your solution below
# 4. Click "Run Code" to test
# 5. Click "Submit" when ready
#
# Your code will appear here once a question is loaded...
`);
    const [loading, setLoading] = useState(false);

    const [sessionState, setSessionState] = useState<'intro' | 'active'>(mode ? 'active' : 'intro');

    // Determine initial topic based on mode
    const getInitialTopic = () => {
        switch (mode) {
            case "system-design": return "System Design";
            case "production": return "Production Engineering";
            case "papers": return "Paper Implementation";
            case "mentor": return "Python";
            case "mock-interview": return "Algorithms";
            default: return "Python";
        }
    };

    const [topic, setTopic] = useState(getInitialTopic());
    const [difficulty, setDifficulty] = useState("Basic");
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [submitMessage, setSubmitMessage] = useState<string>("");
    const [questionStats, setQuestionStats] = useState({
        questionsUsed: 0,
        questionsRemaining: 5,
        isSubscribed: false,
    });

    const loadQuestionStats = async () => {
        const stats = await checkQuestionLimit();
        if (stats.canGenerate !== undefined) {
            setQuestionStats({
                questionsUsed: stats.questionsUsed || 0,
                questionsRemaining: stats.questionsRemaining || 0,
                isSubscribed: stats.isSubscribed || false,
            });
        }
    };

    const generateNewQuestion = async () => {
        setLoading(true);
        setSubmitMessage("");
        try {
            // Check and increment usage
            const result = await incrementQuestionUsage();

            if (!result.success) {
                if (result.requiresPayment) {
                    setShowPaymentModal(true);
                }
                setLoading(false);
                return;
            }

            // Update stats
            await loadQuestionStats();

            // First, try to get an unseen question from database
            // Only for standard modes where we might have pre-generated questions
            // For special modes, we might want fresh generation or need to handle separately
            let questionToUse: Question | null = null;

            // Check DB for standard topics
            if (!["System Design", "Production Engineering", "Paper Implementation"].includes(topic)) {
                const unseenResult = await getUnseenQuestion(topic, difficulty);
                if (unseenResult.success && unseenResult.question) {
                    questionToUse = unseenResult.question as Question;
                    // Mark as seen
                    await markQuestionAsSeen(unseenResult.question.id);
                }
            }

            if (questionToUse) {
                setQuestion(questionToUse);
                setCode(questionToUse.solution_template);
                setCurrentQuestionId(questionToUse.id || null);
            } else {
                // Generate new question from AI
                let newQuestion: Question;

                // Route to correct endpoint based on mode/topic
                if (mode === "system-design" || topic === "System Design") {
                    newQuestion = await api.generateSystemDesignQuestion(topic, difficulty);
                } else if (mode === "production" || topic === "Production Engineering") {
                    newQuestion = await api.generateProductionQuestion(topic, difficulty);
                } else if (mode === "papers" || topic === "Paper Implementation") {
                    newQuestion = await api.generatePaperQuestion(topic, difficulty);
                } else if (mode === "mock-interview") {
                    newQuestion = await api.generateInterviewQuestion(topic, difficulty);
                } else {
                    // Standard generation
                    const context = mode ? `User is in ${mode} mode.` : undefined;
                    newQuestion = await api.generateQuestion(topic, difficulty, context);
                }

                setQuestion(newQuestion);
                setCode(newQuestion.solution_template);
                setCurrentQuestionId(null); // New AI questions might not be instantly persisted via this flow unless changed

                // Save to database
                const saveResult = await saveQuestion(newQuestion);
                if (saveResult.success && saveResult.questionId) {
                    setCurrentQuestionId(saveResult.questionId);
                    await markQuestionAsSeen(saveResult.questionId);
                }
            }
        } catch (error) {
            console.error("Failed to generate question:", error);
        } finally {
            setLoading(false);
        }
    };

    const [output, setOutput] = useState<string>("");
    const [executing, setExecuting] = useState(false);

    const runCode = async () => {
        setExecuting(true);
        setOutput("");
        setSubmitMessage("");
        try {
            const result = await api.executeCode(code);

            if (result.error) {
                setOutput(`Error:\n${result.error}`);
                setSubmitMessage("❌ Execution failed");
            } else {
                setOutput(result.output);
                setSubmitMessage("✅ Code executed successfully");
            }
        } catch (error) {
            console.error("Execution error:", error);
            setOutput("Failed to execute code. Please check your backend connection.");
            setSubmitMessage("❌ Execution failed");
        } finally {
            setExecuting(false);
        }
    };

    const [feedback, setFeedback] = useState<{
        correctness_score: number;
        efficiency_score: number;
        style_score: number;
        feedback: string;
        time_complexity: string;
        space_complexity: string;
    } | null>(null);

    const handleSubmit = async () => {
        if (!currentQuestionId) {
            setSubmitMessage("No question loaded");
            return;
        }

        // Check if user has written any code
        const trimmedCode = code.trim();
        if (!trimmedCode || trimmedCode.length < 10) {
            setSubmitMessage("⚠️ Please write your solution before submitting");
            return;
        }

        setSubmitting(true);
        setSubmitMessage("");
        setFeedback(null); // Clear previous feedback

        try {
            // Execute the code first
            const result = await api.executeCode(code);

            let executionMessage = "";
            if (result.error) {
                executionMessage = `Execution Error:\n${result.error}`;
                setOutput(executionMessage);
            } else {
                executionMessage = result.output;
                setOutput(result.output);
            }

            // Then submit the solution
            const submitResult = await submitSolution(currentQuestionId, code, executionMessage);

            if (submitResult.success) {
                setSubmitMessage("✅ " + (submitResult.message || "Solution submitted successfully!"));

                // Trigger AI Grading (especially for mock interviews, but good for all)
                // We do this in background or await it
                setSubmitMessage("🤖 AI is grading your submission...");
                try {
                    const gradingResult = await api.gradeSubmission(code, question?.title || "", question?.description || "");
                    setFeedback(gradingResult);
                    setSubmitMessage("✅ Graded! See feedback below.");
                } catch (gradeError) {
                    console.error("Grading failed:", gradeError);
                    setSubmitMessage("✅ Submitted, but grading failed.");
                }

            } else {
                setSubmitMessage("❌ " + (submitResult.error || "Submission failed"));
            }
        } catch (error) {
            console.error("Submission failed:", error);
            setSubmitMessage("❌ Error submitting solution");
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        if (mode) {
            setSessionState('active'); // Force active for specific modes if needed, though initial state handles it
        }
    }, [mode]);

    if (sessionState === 'intro') {
        return (
            <div className="h-screen w-full bg-black text-white flex flex-col items-center justify-center p-4">
                <div className="max-w-3xl mx-auto text-center space-y-8 animate-fade-in-up">
                    <div className="w-24 h-24 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Code2 className="w-12 h-12 text-blue-500" />
                    </div>

                    <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-br from-blue-400 to-white bg-clip-text text-transparent">
                        Adaptive Coding Arena
                    </h1>

                    <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        From Python basics to advanced GenAI agents, we generate the perfect challenge for your skill level.
                    </p>

                    <button
                        onClick={() => {
                            if (!session) {
                                signIn(undefined, { callbackUrl: "/arena" });
                            } else {
                                setSessionState('active');
                            }
                        }}
                        className="group relative px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 flex items-center gap-2 mx-auto"
                    >
                        Start Challenge
                        <Play className="w-5 h-5 fill-current" />
                    </button>
                    <p className="mt-4 text-sm text-gray-500">
                        *Requires login to access the arena
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-full bg-black text-white flex flex-col overflow-hidden">
            {/* Header */}
            <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6 bg-gray-900/50 backdrop-blur">
                <div className="flex items-center space-x-4">
                    <Link href="/" className="p-2 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                        {mode ? mode.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') + " Arena" : "AI LeetCode Arena"}
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    {/* User Info */}
                    {session?.user?.email && (
                        <div className="flex items-center space-x-3 px-3 py-1.5 bg-gray-800 rounded-lg border border-gray-700">
                            <span className="text-sm text-gray-400">{session.user.email}</span>
                            <button
                                onClick={() => signOut({ callbackUrl: "/" })}
                                className="flex items-center space-x-1 text-sm text-red-400 hover:text-red-300 transition-colors"
                                title="Logout"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Logout</span>
                            </button>
                        </div>
                    )}

                    {/* Question Counter */}
                    <div className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700">
                        {questionStats.isSubscribed ? (
                            <div className="flex items-center space-x-2">
                                <Sparkles className="w-4 h-4 text-yellow-500" />
                                <span className="text-sm font-medium text-yellow-500">Premium</span>
                            </div>
                        ) : (
                            <div className="text-sm">
                                <span className="text-gray-400">Questions: </span>
                                <span className="font-bold text-blue-500">
                                    {questionStats.questionsRemaining} / 5
                                </span>
                                <span className="text-gray-500 ml-1">free</span>
                            </div>
                        )}
                    </div>

                    <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        {mode === "system-design" && <option>System Design</option>}
                        {mode === "production" && <option>Production Engineering</option>}
                        {mode === "papers" && <option>Paper Implementation</option>}
                        <option>Python</option>
                        <option>Data Structures</option>
                        <option>Algorithms</option>
                        <option>Machine Learning</option>
                        <option>Neural Networks</option>
                    </select>
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                        <option>Basic</option>
                        <option>Intermediate</option>
                        <option>Advanced</option>
                    </select>
                    <button
                        onClick={generateNewQuestion}
                        disabled={loading}
                        className="flex items-center space-x-2 px-4 py-1.5 bg-blue-600 hover:bg-blue-500 rounded text-sm font-medium transition-colors disabled:opacity-50"
                    >
                        {loading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <RefreshCw className="w-4 h-4" />
                        )}
                        <span>{question ? "Next Question" : "Start"}</span>
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex overflow-hidden">
                {/* Left Panel: Question */}
                <div className="w-1/2 h-full p-4 border-r border-gray-800 overflow-hidden">
                    {loading ? (
                        <div className="h-full flex items-center justify-center text-gray-400">
                            <div className="flex flex-col items-center space-y-4">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                <p>Generating {difficulty} level {topic} question...</p>
                            </div>
                        </div>
                    ) : question ? (
                        mode === "mock-interview" ? (
                            <InterviewPanel question={question} feedback={feedback} />
                        ) : (
                            <QuestionDisplay
                                title={question.title}
                                description={question.description}
                                difficulty={question.difficulty}
                                topic={question.topic}
                                answer={question.answer}
                                explanation={question.explanation}
                            />
                        )
                    ) : (
                        <div className="h-full flex items-center justify-center">
                            {mode === "mock-interview" ? (
                                <div className="text-center space-y-6 max-w-md">
                                    <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-purple-500/20">
                                        <Sparkles className="w-10 h-10 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-2">Technical Interview Session</h2>
                                        <p className="text-gray-400">
                                            Click &quot;Start&quot; to begin your mock interview with our AI interviewer. You&apos;ll be assessed on correctness, efficiency, and code style.
                                        </p>
                                    </div>
                                    <button
                                        onClick={generateNewQuestion}
                                        disabled={loading}
                                        className="px-8 py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-all transform hover:scale-105 disabled:opacity-50 disabled:scale-100 flex items-center justify-center space-x-2 mx-auto"
                                    >
                                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                                        <span>{loading ? "Connecting..." : "Start Interview"}</span>
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center space-y-6 max-w-md">
                                    <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-500">
                                        <Code2 className="w-10 h-10" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-white mb-2">Ready to Code?</h2>
                                        <p className="text-gray-400">
                                            Click &quot;Start&quot; to generate a <span className="text-blue-400 font-medium">{difficulty}</span> level <span className="text-blue-400 font-medium">{topic}</span> challenge.
                                        </p>
                                    </div>
                                    <button
                                        onClick={generateNewQuestion}
                                        disabled={loading}
                                        className="px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors disabled:opacity-50"
                                    >
                                        {loading ? "Generating..." : "Start Coding"}
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right Panel: Editor */}
                <div className="w-1/2 h-full flex flex-col">
                    <div className="flex-1 p-4 pb-0 flex flex-col min-h-0">
                        <div className="flex-1 min-h-0">
                            <CodeEditor code={code} onChange={(val) => setCode(val || "")} />
                        </div>
                        {/* Output / Feedback Area */}
                        <div className="h-1/3 mt-4 bg-gray-900 border-t border-gray-800 p-4 font-mono text-sm overflow-auto">
                            <div className="flex items-center space-x-4 border-b border-gray-800 pb-2 mb-2">
                                <span className={`text-xs uppercase tracking-wider cursor-pointer ${!feedback ? "text-white font-bold" : "text-gray-500"}`} onClick={() => setFeedback(null)}>Output</span>
                                {feedback && <span className="text-xs uppercase tracking-wider text-green-400 font-bold">Feedback Enclosed</span>}
                            </div>

                            {feedback ? (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="flex space-x-6">
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-green-400">{feedback.correctness_score}/10</div>
                                            <div className="text-xs text-gray-400 uppercase">Correctness</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-blue-400">{feedback.efficiency_score}/10</div>
                                            <div className="text-xs text-gray-400 uppercase">Efficiency</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-purple-400">{feedback.style_score}/10</div>
                                            <div className="text-xs text-gray-400 uppercase">Style</div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-gray-400 mb-1">Complexity:</div>
                                        <div className="flex space-x-4 text-sm">
                                            <span className="px-2 py-1 bg-gray-800 rounded">Time: {feedback.time_complexity}</span>
                                            <span className="px-2 py-1 bg-gray-800 rounded">Space: {feedback.space_complexity}</span>
                                        </div>
                                    </div>
                                    <div className="prose prose-invert prose-sm">
                                        <p className="whitespace-pre-wrap">{feedback.feedback}</p>
                                    </div>
                                </div>
                            ) : (
                                <pre className="whitespace-pre-wrap text-gray-300">{output || "Run code to see output..."}</pre>
                            )}
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="h-16 border-t border-gray-800 flex items-center justify-between px-6 bg-gray-900/30">
                        {submitMessage && (
                            <div className="text-sm font-medium animate-pulse text-blue-400">
                                {submitMessage}
                            </div>
                        )}
                        <div className="flex items-center space-x-4 ml-auto">
                            <button
                                onClick={runCode}
                                disabled={executing}
                                className="flex items-center space-x-2 px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-300 transition-colors disabled:opacity-50"
                            >
                                {executing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                                <span>Run Code</span>
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={submitting || !currentQuestionId}
                                className="flex items-center space-x-2 px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-white font-medium transition-colors shadow-lg shadow-green-900/20 disabled:opacity-50"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                <span>Submit</span>
                            </button>
                        </div>
                    </div>
                </div>
            </main>

            {/* Payment Modal */}
            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                questionsUsed={questionStats.questionsUsed}
            />
        </div>
    );
}

export default function ArenaPage() {
    return (
        <Suspense fallback={
            <div className="h-screen w-full bg-black flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        }>
            <ArenaContent />
        </Suspense>
    );
}
