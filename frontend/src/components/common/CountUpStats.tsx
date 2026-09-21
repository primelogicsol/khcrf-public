"use client";

import { motion, useSpring, useTransform, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export default function CountUpStats({ value, label = "", suffix = "+" }: { value: number; label?: string; suffix?: string }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    const count = useSpring(0, {
        stiffness: 50,
        damping: 20,
        duration: 2.5
    });

    // Use state to force re-render for string display
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (isInView) {
            count.set(value);
        }
    }, [isInView, value, count]);

    useEffect(() => {
        return count.on("change", (latest) => {
            setDisplayValue(Math.floor(latest));
        });
    }, [count]);

    return (
        <span ref={ref} className="inline-block relative">
            {displayValue.toLocaleString()}{suffix}
        </span>
    );
}
