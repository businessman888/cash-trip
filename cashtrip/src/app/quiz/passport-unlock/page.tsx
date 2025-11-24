"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function PassportUnlockPage() {
    const router = useRouter();
    const [userName, setUserName] = useState<string>("Alexandre");

    useEffect(() => {
        loadUserName();
    }, []);

    async function loadUserName() {
        try {
            const stored = localStorage.getItem('user_profile_dev');
            if (stored) {
                const profile = JSON.parse(stored);
                // Attempt to get name from profile if available
                if (profile.name) {
                    setUserName(profile.name);
                }
                return;
            }

            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user && user.user_metadata?.name) {
                setUserName(user.user_metadata.name);
            }
        } catch (error) {
            console.error("Error loading user name:", error);
        }
    }

    const handleContinue = () => {
        router.push("/quiz/testimonials");
    };

    const benefits = [
        {
            iconSrc: "/icons/icon roteiro personalizado.svg",
            title: "Roteiros personalizados",
            subtitle: "De acordo com suas preferências",
            bgColor: "bg-[#FFE5DB]"
        },
        {
            iconSrc: "/icons/icon monitoramento em tempo real.svg",
            title: "Monitoramento em tempo real",
            subtitle: "De tudo referente a suas aventuras",
            bgColor: "bg-[#FFE5DB]"
        },
        {
            iconSrc: "/icons/icon agente especializado 24h.svg",
            title: "Agente especializado 24h",
            subtitle: "Disponível para suas viagens",
            bgColor: "bg-[#FFE5DB]"
        },
        {
            iconSrc: "/icons/icon bagagens personalizadas.svg",
            title: "Bagagens personalizadas",
            subtitle: "Para não esquecer de nada",
            bgColor: "bg-[#FFE5DB]"
        },
        {
            iconSrc: "/icons/icon sua viagem em 1 clique.svg",
            title: "Sua viagem em 1 clique",
            subtitle: "Passaporte e reservas confirmados.",
            bgColor: "bg-[#FFE5DB]"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F1F1F1] flex flex-col items-center px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md flex flex-col items-center"
            >
                {/* Airplane Icon */}
                <motion.div
                    initial={{ scale: 0.8, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="mb-6"
                >
                    <img
                        src="/icons/icon airplane.svg"
                        alt="Airplane ticket"
                        className="w-[200px] h-[200px]"
                    />
                </motion.div>

                {/* Congratulations Text */}
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-[#FF5F38] font-roboto-condensed font-bold text-2xl text-center mb-2"
                >
                    Parabéns {userName}! Você acabou de desbloquear seu passaporte de 7 dias gratuitos da CashTrip
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-[#64748B] font-roboto-condensed text-base text-center mb-8"
                >
                    Você terá acesso à:
                </motion.p>

                {/* Benefits List */}
                <div className="w-full flex flex-col gap-4 mb-8">
                    {benefits.map((benefit, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 + index * 0.1 }}
                            className="bg-white rounded-[15px] shadow-md p-4 flex items-start gap-4"
                        >
                            <div className={`${benefit.bgColor} w-14 h-14 rounded-[10px] flex items-center justify-center flex-shrink-0`}>
                                <img
                                    src={benefit.iconSrc}
                                    alt={benefit.title}
                                    className="w-8 h-8"
                                />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-[#FF5F38] font-roboto-condensed font-bold text-base mb-1">
                                    {benefit.title}
                                </h3>
                                <p className="text-[#64748B] font-roboto-condensed text-sm">
                                    {benefit.subtitle}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Footer Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="text-[#1E293B] font-roboto-condensed text-center text-base mb-6"
                >
                    E aí, pronto para pegar o passaporte e desbloquear as melhores experiências?
                </motion.p>

                {/* CTA Button */}
                <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.3 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleContinue}
                    className="w-full max-w-[300px] h-14 bg-[#FF5F38] hover:bg-[#FF4820] rounded-[30px] shadow-lg flex items-center justify-center transition-colors"
                >
                    <span className="text-white font-roboto-condensed font-bold text-lg">
                        Resgatar meu Passaporte
                    </span>
                </motion.button>
            </motion.div>
        </div>
    );
}
