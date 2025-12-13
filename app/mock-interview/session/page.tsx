"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, MicOff, Send, User, Volume2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { incrementQuestionUsage } from "@/app/actions/questions";
import { PaymentModal } from "@/components/PaymentModal";

// Mock Avatars (can be replaced with real images)
// Using simple color/gradient placeholders or external text-to-image placeholders if allowed, 
// for now a nice UI placeholder.



export default function MockInterviewSession() {
    const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
    const [inputText, setInputText] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [subject, setSubject] = useState<string | null>(null);

    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            setIsPlaying(true);
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.onend = () => setIsPlaying(false);
            window.speechSynthesis.speak(utterance);
        }
    };


    // Use environment variable for API URL in production
    const API_URL = process.env.NEXT_PUBLIC_API_URL;

    const handleSendMessage = useCallback(async (text: string = inputText) => {
        if (!text.trim()) return;

        // Add User Message
        const newMessages: { role: 'user' | 'ai'; text: string }[] = [...messages, { role: 'user', text }];
        setMessages(newMessages);
        setInputText('');

        try {
            // Call Backend API
            const response = await fetch(`${API_URL}/mock-interview/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: messages.map(m => ({ role: m.role === 'ai' ? 'model' : 'user', text: m.text })),
                    topic: subject || "General"
                })
            });

            if (!response.ok) throw new Error("Failed to fetch response");

            const data = await response.json();
            const aiResponse = data.response;

            // Update UI and Speak
            setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
            speak(aiResponse);

            // Set subject slightly lazily if not set
            if (!subject) {
                setSubject(text.substring(0, 20) + "...");
            }

        } catch (error) {
            console.error("Error calling backend:", error);
            const errorMsg = "I'm having trouble connecting to the server. Please try again.";
            setMessages(prev => [...prev, { role: 'ai', text: errorMsg }]);
            speak(errorMsg);
        }
    }, [inputText, messages, subject, API_URL]);

    // Deepgram Integration
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

    const startDeepgram = async () => {
        if (!sessionAllowed) return; // Block
        try {
            const response = await fetch(`${API_URL}/deepgram/token`);
            const data = await response.json();
            const apiKey = data.key;

            if (!apiKey) {
                alert("Could not retrieve Deepgram API key.");
                return;
            }

            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Open WebSocket to Deepgram
            const socket = new WebSocket('wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=16000&model=nova-2-general');
            socketRef.current = socket;

            socket.onopen = () => {
                const mediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = mediaRecorder;

                mediaRecorder.addEventListener('dataavailable', (event) => {
                    if (event.data.size > 0 && socket.readyState === 1) {
                        socket.send(event.data);
                    }
                });

                mediaRecorder.start(250); // Send chunks every 250ms
            };

            socket.onmessage = (message) => {
                const received = JSON.parse(message.data);
                const transcript = received.channel?.alternatives[0]?.transcript;
                if (transcript && received.is_final) {
                    setInputText(prev => prev + " " + transcript);
                    handleSendMessage(transcript);
                }
            };

            setIsRecording(true);

        } catch (error) {
            console.error("Error starting Deepgram:", error);
            alert("Error accessing microphone or connecting to Deepgram.");
        }
    };

    const stopDeepgram = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
        }
        if (socketRef.current) {
            socketRef.current.close();
        }
        setIsRecording(false);
    };

    const toggleRecording = () => {
        if (!sessionAllowed) {
            setShowPaymentModal(true); // Re-show modal if clicked
            return;
        }

        if (isRecording) {
            stopDeepgram();
        } else {
            startDeepgram();
        }
    };

    // Usage tracking
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [usageStats, setUsageStats] = useState({ used: 0, subscribed: false });
    const [sessionAllowed, setSessionAllowed] = useState(false);

    // Removed legacy Web Speech Init effect
    useEffect(() => {
        // Check limit on mount
        const checkLimit = async () => {
            const result = await incrementQuestionUsage();
            if (!result.success && result.requiresPayment) {
                setShowPaymentModal(true);
                setUsageStats({ used: 5, subscribed: false });
            } else {
                setSessionAllowed(true);
                // Initialize Greeting only if allowed
                const initialGreeting = "Hello. I am your AI Interviewer. Please tell me what subject you would like to interview for today (e.g., System Design, Python, Cultural Fit).";
                setMessages([{ role: 'ai', text: initialGreeting }]);
                speak(initialGreeting);
            }
        };

        checkLimit();

        return () => {
            stopDeepgram();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);



    return (
        <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 font-sans">
            <header className="fixed top-0 w-full z-50 bg-black/50 backdrop-blur-xl border-b border-gray-800">
                <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                    <Link href="/mock-interview" className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span>End Interview</span>
                    </Link>
                    <div className="text-sm font-mono text-gray-400">
                        {subject ? `Subject: ${subject}` : "Selecting Subject..."}
                    </div>
                </div>
            </header>

            <main className="pt-24 pb-24 container mx-auto px-4 max-w-4xl h-screen flex flex-col">

                {/* Avatar / Visualizer Area */}
                <div className="flex-1 flex flex-col items-center justify-center relative mb-8">
                    {/* Pulsing Avatar Circle */}
                    <div className={`relative w-48 h-48 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${isPlaying ? 'border-purple-500 shadow-[0_0_50px_rgba(168,85,247,0.4)] scale-105' : 'border-gray-700'}`}>
                        {/* Static Image or Placeholder */}
                        <div className="w-40 h-40 rounded-full bg-gradient-to-br from-gray-800 to-black overflow-hidden flex items-center justify-center relative">
                            <User className="w-20 h-20 text-gray-600" />
                            {/* Overlay for speaking animation */}
                            {isPlaying && (
                                <div className="absolute inset-0 bg-purple-500/20 animate-pulse" />
                            )}
                        </div>
                    </div>

                    <div className="mt-6 text-center space-y-2">
                        <h2 className="text-2xl font-bold">AI Interviewer</h2>
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isPlaying ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'}`}>
                            {isPlaying ? <><Volume2 className="w-3 h-3 animate-bounce" /> Speaking</> : "Listening / Idle"}
                        </div>
                    </div>
                </div>

                {/* Chat Transcript (Auto-scroll) */}
                <div className="flex-1 overflow-y-auto bg-gray-900/30 rounded-2xl p-6 border border-gray-800 mb-6 space-y-4 max-h-[300px]">
                    {messages.length === 0 && (
                        <div className="text-center text-gray-500 italic">Waiting for connection...</div>
                    )}
                    {messages.map((msg, idx) => (
                        <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-gray-800 text-gray-300 rounded-tl-sm'}`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4 bg-gray-900 p-4 rounded-2xl border border-gray-800">
                    <button
                        onClick={toggleRecording}
                        className={`p-4 rounded-full transition-all duration-300 flex-shrink-0 ${isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                    >
                        {isRecording ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>

                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder={isRecording ? "Listening..." : "Type your answer..."}
                            className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 pr-12"
                            disabled={isRecording}
                        />
                        <button
                            onClick={() => handleSendMessage()}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-white"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>

            </main>

            <PaymentModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                questionsUsed={usageStats.used}
            />
        </div>
    );
}
