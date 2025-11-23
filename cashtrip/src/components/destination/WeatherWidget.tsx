'use client'

import { FiSun, FiCloud, FiCloudRain } from 'react-icons/fi'

interface DailyForecast {
    day: string
    icon: 'sun' | 'cloud' | 'rain'
    temp: number
}

interface WeatherWidgetProps {
    currentTemp: number
    forecast: DailyForecast[]
}

export function WeatherWidget({ currentTemp, forecast }: WeatherWidgetProps) {
    const getIcon = (type: string) => {
        switch (type) {
            case 'sun': return <FiSun className="text-[#FF5F38]" />
            case 'cloud': return <FiCloud className="text-[#FF5F38]" />
            case 'rain': return <FiCloudRain className="text-[#FF5F38]" />
            default: return <FiSun className="text-[#FF5F38]" />
        }
    }

    return (
        <div className="bg-[#F1F1F1] rounded-[24px] p-6 mb-6 shadow-[0_4px_4px_rgba(0,0,0,0.25)]">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="font-inria-sans font-bold text-[18px] text-[#1E293B]">
                        Clima
                    </h3>
                    <p className="font-inria-sans text-[12px] text-[#64748B]">
                        Previsão para a semana
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-inria-sans font-bold text-[32px] text-[#FF5F38]">
                        {currentTemp}°
                    </span>
                    <FiSun className="text-[#FF5F38] text-3xl" />
                </div>
            </div>

            <div className="flex justify-between gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {forecast.map((day, index) => (
                    <div key={index} className="flex flex-col items-center min-w-[45px] gap-2 p-2 rounded-[12px] border border-[#E2E8F0] bg-white">
                        <span className="font-inria-sans font-bold text-[12px] text-[#1E293B]">
                            {day.day}
                        </span>
                        <div className="text-lg">
                            {getIcon(day.icon)}
                        </div>
                        <span className="font-inria-sans text-[12px] text-[#64748B]">
                            {day.temp}°
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}
