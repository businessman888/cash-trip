'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface NavigationButtonProps {
  onClick: () => void;
  disabled?: boolean;
  variant: 'white-background' | 'orange-background';
  className?: string;
  isFixed?: boolean;
}

export function NavigationButton({
  onClick,
  disabled = false,
  variant,
  className = "",
  isFixed = true
}: NavigationButtonProps) {
  const [mounted, setMounted] = useState(false)
  const isWhiteBackground = variant === 'white-background';

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  const buttonElement = (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${isFixed ? 'fixed bottom-4 right-4 z-50' : 'relative mt-8 self-end mr-4'}
        w-20 h-20 rounded-full
        flex items-center justify-center
        transition-all shadow-[2px_2px_4px_0px_rgba(0,0,0,0.25)]
        ${disabled
          ? 'bg-gray-300 cursor-not-allowed opacity-50'
          : isWhiteBackground
            ? 'bg-gradient-to-b from-[#FF896F] via-[#FF5F38] to-[#E6502C] hover:scale-110 cursor-pointer'
            : 'bg-[#1E293B] hover:scale-110 cursor-pointer'
        }
        ${className}
      `}
    >
      <svg
        width="32"
        height="28"
        viewBox="0 0 32 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M18 4L28 14M28 14L18 24M28 14H4"
          stroke={isWhiteBackground ? "white" : "#E6502C"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );

  // Use Portal for fixed buttons to ensure they're always on top
  if (isFixed && mounted) {
    return createPortal(buttonElement, document.body)
  }

  return buttonElement
}
