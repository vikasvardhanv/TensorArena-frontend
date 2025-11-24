"use client";

import React from "react";
import Editor from "@monaco-editor/react";

interface CodeEditorProps {
    code: string;
    onChange: (value: string | undefined) => void;
    language?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
    code,
    onChange,
    language = "python",
}) => {
    return (
        <div className="h-full w-full rounded-lg overflow-hidden border border-gray-700 shadow-2xl">
            <Editor
                height="100%"
                defaultLanguage={language}
                defaultValue={code}
                theme="vs-dark"
                onChange={onChange}
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                }}
            />
        </div>
    );
};
