"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import QuizAnimationWrapper from "@/components/quiz/QuizAnimationWrapper";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

interface UserProfile {
    preference_scores: {
        adventure_level: number;
        luxury_preference: number;
        urban_vs_nature: number;
        activity_intensity: number;
        food_sophistication: number;
        fitness_priority: number;
        nightlife_interest: number;
        cultural_interest: number;
        exploration_desire: number;
        social_level: number;
    };
    hard_requirements: {
        accommodation_type: string[];
        must_have_experiences: string[];
    };
    persona_summary: string;
    travel_rhythm: string;
}

export default function UnlockAchievementPage() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [animationData, setAnimationData] = useState<any>(null);

    useEffect(() => {
        loadProfile();
        loadAnimation();
    }, []);

    async function loadAnimation() {
        try {
            const response = await fetch('/icons/icon bagagem.json');
            const data = await response.json();
            setAnimationData(data);
        } catch (error) {
            console.error("Error loading animation:", error);
        }
    }

    async function loadProfile() {
        try {
            const stored = localStorage.getItem('user_profile_dev');
            if (stored) {
                setProfile(JSON.parse(stored) as UserProfile);
                setLoading(false);
                return;
            }

            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                setLoading(false);
                return;
            }

            const { data } = await supabase
                .from("user_profiles")
                .select("profile_data")
                .eq("user_id", user.id)
                .single();

            if (data) {
                setProfile(data.profile_data as UserProfile);
            }
        } catch (error) {
            console.error("Error loading profile:", error);
        } finally {
            setLoading(false);
        }
    }

    const getTravelerType = () => {
        if (!profile) return null;
        const scores = profile.preference_scores;

        if (scores.adventure_level >= 8 && scores.urban_vs_nature <= 3) return { name: "Explorador Aventureiro Intenso" };
        if (scores.adventure_level >= 6 && scores.urban_vs_nature <= 5) return { name: "Viajante Aventureiro" };
        if (scores.food_sophistication >= 8 && scores.luxury_preference >= 6) return { name: "Viajante Gourmet Sofisticado" };
        if (scores.food_sophistication >= 7) return { name: "Explorador Gastronômico" };
        if (scores.cultural_interest >= 8) return { name: "Viajante Cultural Apaixonado" };
        if (scores.luxury_preference >= 8) return { name: "Viajante de Luxo Premium" };
        if (scores.nightlife_interest >= 8 && scores.social_level >= 7) return { name: "Viajante Social e Festivo" };
        if (scores.activity_intensity <= 3 && scores.nightlife_interest <= 4) return { name: "Viajante Zen e Contemplativo" };
        if (scores.urban_vs_nature >= 8 && scores.exploration_desire >= 6) return { name: "Explorador Urbano" };

        return { name: "Viajante Versátil e Equilibrado" };
    };

    const travelerType = getTravelerType();

    // Auto-advance after 3.5 seconds
    useEffect(() => {
        if (!loading && profile) {
            const timer = setTimeout(() => {
                router.push("/quiz/passport-unlock");
            }, 3500);
            return () => clearTimeout(timer);
        }
    }, [loading, profile, router]);

    if (loading) return <div className="min-h-screen bg-[#F1F1F1]" />;

    return (
        <QuizAnimationWrapper className="min-h-screen bg-[#F1F1F1] flex flex-col items-center justify-center px-4 relative">
            {/* Progress Bar at Top */}
            <div className="absolute top-0 left-0 w-full h-2 bg-[#E2E8F0]">
                <div className="h-full bg-[#FF5F38] w-[90%]" /> {/* Example progress */}
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center gap-8"
            >
                {/* Large Animated Icon */}
                <div className="w-[180px] h-[180px] relative">
                    {animationData && (
                        <Lottie
                            animationData={animationData}
                            loop={true}
                            autoplay={true}
                            style={{ width: 180, height: 180 }}
                        />
                    )}
                </div>

                {/* Text */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <h2 className="text-[#1E293B] font-roboto-condensed font-normal text-xl">
                        Desbloqueando sua<br />conquista de
                    </h2>

                    <h1 className="text-[#FF5F38] font-roboto-condensed font-bold text-2xl mt-2">
                        {travelerType?.name || "Explorador"}
                    </h1>
                </div>
            </motion.div>
        </QuizAnimationWrapper>
    );
}
