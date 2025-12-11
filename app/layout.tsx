import type { Metadata } from "next";
import { ReactNode } from "react";

import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "TensorArena - Master AI Engineering",
  description: "Level up your AI engineering skills with adaptive coding challenges. Practice TensorFlow, PyTorch, and machine learning concepts in a real-world environment.",
  keywords: [
    "AI Engineering",
    "Machine Learning",
    "TensorFlow",
    "PyTorch",
    "Coding Challenges",
    "LeetCode for AI",
    "Data Science",
    "AI Interview Prep",
    "LLM Engineering",
    "System Design for AI",
    "Machine Learning Interview",
    "Prompt Engineering"
  ],
  authors: [{ name: "TensorArena Team" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.tensorarena.com',
  },
  openGraph: {
    title: "TensorArena - Master AI Engineering",
    description: "The premier platform for AI engineering coding challenges. Master machine learning concepts through practice.",
    type: "website",
    locale: "en_US",
    siteName: "TensorArena",
    url: "https://www.tensorarena.com",
    images: [
      {
        url: '/og-image.png', // Assuming we might add one later, or just a placeholder for now
        width: 1200,
        height: 630,
        alt: 'TensorArena Preview',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "TensorArena - Master AI Engineering",
    description: "Level up your AI engineering skills with adaptive coding challenges.",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans min-h-screen flex flex-col">
        <Providers>

          <main className="flex-grow">
            {children}
          </main>
          <footer className="bg-black border-t border-gray-800 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                    TensorArena
                  </span>
                  <p className="text-gray-500 text-sm mt-1">
                    © {new Date().getFullYear()} TensorArena. All rights reserved.
                  </p>
                </div>
                <div className="flex space-x-6">
                  <a href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Privacy Policy
                  </a>
                  <a href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                    Terms of Service
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
