'use client'

interface TripStepperProps {
    currentStep: number
}

export function TripStepper({ currentStep }: TripStepperProps) {
    const steps = [1, 2, 3, 4]

    return (
        <div className="flex items-center justify-center w-full px-12 mb-8 relative">
            {/* Background Line */}
            <div className="absolute left-12 right-12 top-1/2 h-[2px] bg-[#FFDdd6] -z-10" />

            <div className="flex justify-between w-full">
                {steps.map((step) => {
                    const isActive = step === currentStep
                    const isCompleted = step < currentStep

                    return (
                        <div
                            key={step}
                            className={`
                                w-[32px] h-[32px] rounded-full flex items-center justify-center font-inria-sans font-bold text-[14px]
                                transition-all duration-300
                                ${isActive
                                    ? 'bg-[#FF5F38] text-white shadow-lg shadow-[#FF5F38]/30 scale-110'
                                    : 'bg-[#FFDdd6] text-white border-2 border-[#FFDdd6]'
                                }
                            `}
                        >
                            {step}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
