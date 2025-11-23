'use client'

interface TripProgressProps {
    progress: number
}

export function TripProgress({ progress }: TripProgressProps) {
    return (
        <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
                <span className="font-inria-sans font-bold text-[14px] text-[#64748B] dark:text-[#94A3B8]">
                    Progresso da viagem
                </span>
                <span className="font-inria-sans font-bold text-[14px] text-[#FF5F38]">
                    {progress}%
                </span>
            </div>
            <div className="w-full h-[6px] bg-[#F1F5F9] dark:bg-[#1E293B] rounded-full overflow-hidden">
                <div
                    className="h-full bg-[#FF5F38] rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    )
}
