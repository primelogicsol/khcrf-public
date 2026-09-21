"use client";

import React, { forwardRef, useCallback, useEffect, useRef } from "react";
import HTMLFlipBook from 'react-pageflip';
import { FaArrowLeft } from "react-icons/fa";

export interface BookFlipProps {
    children: React.ReactNode;
    width?: number;
    height?: number;
    minWidth?: number;
    maxWidth?: number;
    minHeight?: number;
    maxHeight?: number;
    showControls?: boolean;
    className?: string;
}

// Page Component required by react-pageflip
// We export this so consumers can use it to wrap their page content
export const BookPage = forwardRef<HTMLDivElement, { children: React.ReactNode, number?: number, title?: string, isCover?: boolean, className?: string }>(
    (props, ref) => {
        return (
            <div className={`demoPage bg-[#fdfbf7] h-full shadow-inner ${props.isCover ? 'cover' : ''} ${props.className || ''}`} ref={ref}>
                <div className="h-full border-r border-[#e6e2d3] flex flex-col p-8 md:p-14 overflow-hidden relative">
                    {/* Page Content */}
                    <div className="grow overflow-y-auto custom-scrollbar">
                        {props.children}
                    </div>

                    {/* Footer / Page Number */}
                    {!props.isCover && (
                        <div className="shrink-0 pt-4 mt-auto border-t border-stone-200 flex justify-between items-center text-stone-400 font-sans text-xs tracking-widest uppercase">
                            <span>{props.title}</span>
                            <span>{props.number}</span>
                        </div>
                    )}
                </div>
            </div>
        );
    }
);
BookPage.displayName = 'BookPage';

export default function BookFlip({
    children,
    width = 600,
    height = 850,
    minWidth = 400,
    maxWidth = 800,
    minHeight = 600,
    maxHeight = 1000,
    showControls = true,
    className = ""
}: BookFlipProps) {
    const bookRef = useRef<any>(null);

    // Callbacks for external controls
    const handleNext = useCallback(() => bookRef.current?.pageFlip().flipNext(), []);
    const handlePrev = useCallback(() => bookRef.current?.pageFlip().flipPrev(), []);

    // Keyboard Navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev]);

    return (
        <div className={`flex flex-col items-center justify-center relative ${className}`}>
            <div className="relative shadow-2xl rounded-sm overflow-hidden" style={{ maxWidth: '100vw' }}>
                {/* @ts-ignore */}
                <HTMLFlipBook
                    width={width}
                    height={height}
                    size="stretch"
                    minWidth={minWidth}
                    maxWidth={maxWidth}
                    minHeight={minHeight}
                    maxHeight={maxHeight}
                    maxShadowOpacity={0.4}
                    showCover={true}
                    mobileScrollSupport={true}
                    className="demo-book"
                    ref={bookRef}
                    startPage={0}
                    drawShadow={true}
                    flippingTime={1000}
                    usePortrait={true}
                    startZIndex={0}
                    autoSize={true}
                    clickEventForward={true}
                    useMouseEvents={true}
                    swipeDistance={30}
                    showPageCorners={true}
                    disableFlipByClick={false}
                >
                    {children}
                </HTMLFlipBook>
            </div>

            {/* External Controls */}
            {showControls && (
                <div className="mt-8 flex items-center space-x-8 text-white/80 font-sans text-sm tracking-widest z-10 transition-opacity">
                    <button
                        onClick={handlePrev}
                        className="hover:text-white hover:scale-110 transition-all flex items-center gap-2 group"
                    >
                        <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" /> PREV
                    </button>
                    <div className="text-white/40 text-xs text-center">
                        FLIP TO TURN
                    </div>
                    <button
                        onClick={handleNext}
                        className="hover:text-white hover:scale-110 transition-all flex items-center gap-2 group"
                    >
                        NEXT <FaArrowLeft className="rotate-180 group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )}
        </div>
    );
}
