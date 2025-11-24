"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface QuizOptionProps {
    children: ReactNode;
    onClick: () => void;
    isSelected?: boolean;
    index: number;
    className?: string;
    disabled?: boolean;
    style?: React.CSSProperties;
}

export default function QuizOption({
    children,
    onClick,
    isSelected = false,
    index,
    className = "",
    disabled = false,
    style
}: QuizOptionProps) {
    return (
        <motion.button
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.5,
                delay: index * 0.1, // Stagger effect
                type: "spring",
                stiffness: 100,
                damping: 15
            }}
            onClick={onClick}
            disabled={disabled}
            className={className}
            style={style}
            whileHover={{ scale: disabled ? 1 : 1.02 }}
            whileTap={{ scale: disabled ? 1 : 0.98 }}
        >
            {children}
        </motion.button>
    );
}
