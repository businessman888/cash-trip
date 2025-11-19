interface CheckboxRoundProps {
  isSelected: boolean;
  className?: string;
}

export function CheckboxRound({ isSelected, className = "" }: CheckboxRoundProps) {
  if (!isSelected) return null;

  return (
    <div className={`w-[40px] h-[40px] rounded-full border-[2px] border-[#E6502C] bg-white flex items-center justify-center ${className}`}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M4.26 6.38L9.73 11.85L20.72 0.87" 
          stroke="#E6502C" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}





