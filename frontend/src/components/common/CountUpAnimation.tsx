"use client";

import { useEffect, useState, useRef } from "react";

interface CountUpAnimationProps {
    target: number | string;
    duration?: number;
    className?: string;
    prefix?: string;
    suffix?: string;
}

export default function CountUpAnimation({
    target,
    duration = 2000,
    className = "",
    prefix = "",
    suffix: propSuffix = ""
}: CountUpAnimationProps) {
    const [count, setCount] = useState(0);
    const elementRef = useRef<HTMLSpanElement>(null);
    const hasAnimated = useRef(false);

    // Parse target to separate number from potential suffix in the string itself if not provided as prop
    let numericTarget = 0;
    let computedSuffix = propSuffix;

    if (typeof target === 'number') {
        numericTarget = target;
    } else {
        // Simple parsing: extract first sequence of digits
        const match = target.toString().match(/(\d+)(.*)/);
        if (match) {
            numericTarget = parseInt(match[1], 10);
            if (!computedSuffix && match[2]) {
                computedSuffix = match[2]; // Use extracted suffix if prop suffix not provided
            }
        }
    }

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true;

                    let startTime: number | null = null;

                    const animate = (timestamp: number) => {
                        if (!startTime) startTime = timestamp;
                        const progress = timestamp - startTime;

                        // Ease out quart
                        const percentage = Math.min(progress / duration, 1);
                        const easeOut = 1 - Math.pow(1 - percentage, 4);

                        const currentCount = Math.floor(easeOut * numericTarget);
                        setCount(currentCount);

                        if (percentage < 1) {
                            requestAnimationFrame(animate);
                        } else {
                            setCount(numericTarget); // Ensure we land exactly
                        }
                    };

                    requestAnimationFrame(animate);
                }
            },
            { threshold: 0.1 }
        );

        if (elementRef.current) {
            observer.observe(elementRef.current);
        }

        return () => {
            if (elementRef.current) {
                observer.unobserve(elementRef.current);
            }
        };
    }, [numericTarget, duration]);

    return (
        <span ref={elementRef} className={className}>
            {prefix}{count}{computedSuffix}
        </span>
    );
}
