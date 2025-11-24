import React from "react";
import { ArrowLeft, BookOpen, CheckCircle2, Code, Cpu, Database, Brain, Network, Bot, Layers } from "lucide-react";
import Link from "next/link";

const curriculum = [
    {
        title: "Phase 1: Python Foundations",
        icon: Code,
        description: "Master the language of AI. From syntax to advanced functional programming.",
        topics: [
            "Variables, Data Types, and Control Flow",
            "Functions, Modules, and Packages",
            "Object-Oriented Programming (OOP)",
            "File Handling & Error Management",
            "AsyncIO and Concurrency",
        ],
        color: "text-green-400",
        bg: "bg-green-400/10",
        border: "border-green-400/20",
    },
    {
        title: "Phase 2: Data Structures & Algorithms",
        icon: Database,
        description: "Build the problem-solving skills necessary for efficient code.",
        topics: [
            "Arrays, Linked Lists, Stacks, Queues",
            "Trees, Graphs, and Heaps",
            "Sorting and Searching Algorithms",
            "Dynamic Programming",
            "Time & Space Complexity Analysis",
        ],
        color: "text-blue-400",
        bg: "bg-blue-400/10",
        border: "border-blue-400/20",
    },
    {
        title: "Phase 3: Machine Learning Basics",
        icon: Cpu,
        description: "Understand the core algorithms that drive intelligent systems.",
        topics: [
            "Supervised vs Unsupervised Learning",
            "Linear/Logistic Regression",
            "Decision Trees & Random Forests",
            "Support Vector Machines (SVM)",
            "Model Evaluation Metrics",
        ],
        color: "text-yellow-400",
        bg: "bg-yellow-400/10",
        border: "border-yellow-400/20",
    },
    {
        title: "Phase 4: Deep Learning & Neural Networks",
        icon: Network,
        description: "Dive deep into neural architectures with PyTorch.",
        topics: [
            "Perceptrons & Multi-Layer Perceptrons",
            "Backpropagation & Gradient Descent",
            "Convolutional Neural Networks (CNNs)",
            "Recurrent Neural Networks (RNNs) & LSTMs",
            "Transfer Learning",
        ],
        color: "text-orange-400",
        bg: "bg-orange-400/10",
        border: "border-orange-400/20",
    },
    {
        title: "Phase 5: NLP & Transformers",
        icon: Brain,
        description: "Teach machines to understand and generate human language.",
        topics: [
            "Tokenization & Embeddings (Word2Vec, GloVe)",
            "Attention Mechanisms",
            "Transformer Architecture (BERT, GPT)",
            "HuggingFace Transformers Library",
            "Fine-tuning Pre-trained Models",
        ],
        color: "text-purple-400",
        bg: "bg-purple-400/10",
        border: "border-purple-400/20",
    },
    {
        title: "Phase 6: GenAI & LLM Agents",
        icon: Bot,
        description: "Build the future with Large Language Models and Autonomous Agents.",
        topics: [
            "Prompt Engineering Strategies",
            "Retrieval Augmented Generation (RAG)",
            "Vector Databases (Pinecone, Weaviate)",
            "LangChain & LlamaIndex",
            "Building Autonomous Agents",
        ],
        color: "text-pink-400",
        bg: "bg-pink-400/10",
        border: "border-pink-400/20",
    },
    {
        title: "Phase 7: MLOps & Deployment",
        icon: Layers,
        description: "Take your models from notebook to production.",
        topics: [
            "Model Serving (FastAPI, Ray Serve)",
            "Containerization (Docker, Kubernetes)",
            "CI/CD for ML Pipelines",
            "Model Monitoring & Observability",
            "Cloud Deployment (AWS/GCP)",
        ],
        color: "text-cyan-400",
        bg: "bg-cyan-400/10",
        border: "border-cyan-400/20",
    },
];

export default function CurriculumPage() {
    return (
        <div className="min-h-screen bg-black text-white selection:bg-blue-500/30">
            <div className="container mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        href="/"
                        className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-6"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Home
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-4">
                        AI Engineering Curriculum
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl">
                        A comprehensive roadmap designed to take you from writing your first Python script to deploying autonomous AI agents.
                    </p>
                </div>

                {/* Timeline/Grid */}
                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-800 before:to-transparent">
                    {curriculum.map((phase, index) => (
                        <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                            {/* Icon */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-gray-800 bg-gray-900 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                <phase.icon className={`w-5 h-5 ${phase.color}`} />
                            </div>

                            {/* Content Card */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-6 rounded-2xl border border-gray-800 bg-gray-900/50 backdrop-blur-sm hover:border-gray-700 transition-all hover:shadow-2xl hover:shadow-blue-900/10">
                                <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-4 ${phase.bg} ${phase.color} ${phase.border} border`}>
                                    {phase.title}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{phase.description}</h3>
                                <ul className="space-y-2">
                                    {phase.topics.map((topic, i) => (
                                        <li key={i} className="flex items-start text-gray-400 text-sm">
                                            <CheckCircle2 className="w-4 h-4 mr-2 mt-0.5 text-gray-600 shrink-0" />
                                            {topic}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-20 text-center">
                    <h2 className="text-2xl font-bold mb-6">Ready to start your journey?</h2>
                    <Link
                        href="/arena"
                        className="inline-flex items-center px-8 py-4 bg-white text-black rounded-full font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105"
                    >
                        <BookOpen className="w-5 h-5 mr-2" />
                        Start Learning Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
