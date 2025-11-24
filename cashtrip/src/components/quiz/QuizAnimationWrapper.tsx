"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface QuizAnimationWrapperProps {
    children: ReactNode;
    className?: string;
}

export default function QuizAnimationWrapper({ children, className = "" }: QuizAnimationWrapperProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`w-full flex flex-col items-center ${className}`}
        >
            {children}
        </motion.div>
    );
}
