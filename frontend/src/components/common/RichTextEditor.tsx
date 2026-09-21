"use client";

import React, { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
}

const TOOLBAR_OPTIONS = [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
    ['link', 'image'],
    ['clean']
];

export default function RichTextEditor({ value, onChange, placeholder, label, className }: RichTextEditorProps & { className?: string }) {
    const editorRef = useRef<HTMLDivElement>(null);
    const quillRef = useRef<Quill | null>(null);

    useEffect(() => {
        if (editorRef.current && !quillRef.current) {
            quillRef.current = new Quill(editorRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: TOOLBAR_OPTIONS,
                },
                placeholder: placeholder || 'Write something...',
            });

            quillRef.current.on('text-change', () => {
                if (quillRef.current) {
                    const html = quillRef.current.root.innerHTML;
                    onChange(html === '<p><br></p>' ? '' : html);
                }
            });
        }
    }, [placeholder]);

    useEffect(() => {
        if (quillRef.current && value !== quillRef.current.root.innerHTML) {
            const currentContent = quillRef.current.root.innerHTML;
            const newContent = value || '';
            if (newContent !== currentContent) {
                quillRef.current.root.innerHTML = newContent;
            }
        }
    }, [value]);

    return (
        <div className="w-full flex flex-col h-full">
            {label && <label className="block text-sm font-bold text-gray-900 mb-2">{label}</label>}
            <div className={`bg-white rounded-lg overflow-hidden border border-gray-200 flex-1 flex flex-col ${className || 'h-64'}`}>
                {/* Container for Quill - needs to grow */}
                <div ref={editorRef} className="flex-1 overflow-y-auto" style={{ border: 'none' }} />
            </div>
            <style jsx global>{`
                .ql-toolbar {
                    border-top: none !important;
                    border-left: none !important;
                    border-right: none !important;
                    border-bottom: 1px solid #e5e7eb !important;
                    background-color: #f9fafb;
                    flex-shrink: 0;
                }
                .ql-container {
                    border: none !important;
                    font-family: inherit !important;
                    font-size: 1rem !important;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    overflow: hidden; /* Let ql-editor scroll */
                }
                .ql-editor {
                    flex: 1;
                    overflow-y: auto;
                    color: #111827 !important;
                    padding: 1.5rem;
                }
            `}</style>
        </div>
    );
}
