'use client'

import { useState } from 'react'
import { FiChevronLeft } from 'react-icons/fi'
import Link from 'next/link'
import { TripStepper } from '@/components/trips/new/TripStepper'
import { NewTripChat } from '@/components/trips/new/NewTripChat'

export default function NewTripPage() {
    const [currentStep, setCurrentStep] = useState(1)

    return (
        <div className="min-h-screen bg-[var(--surface-main)] flex flex-col">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 flex items-center relative">
                <Link href="/trips" className="absolute left-6 text-[#FF5F38] text-3xl">
                    <FiChevronLeft />
                </Link>
                <h1 className="w-full text-center font-inria-sans font-bold text-[20px] text-[#1E293B] dark:text-white">
                    Roteiro da viagem
                </h1>
            </div>

            {/* Stepper */}
            <TripStepper currentStep={currentStep} />

            {/* Chat Interface */}
            <div className="flex-1 relative">
                <NewTripChat currentStep={currentStep} onStepChange={setCurrentStep} />
            </div>
        </div>
    )
}
