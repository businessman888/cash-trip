"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { useRouter } from "next/navigation";

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

export default function QuizAllReadyPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    const IS_DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';
    
    try {
      if (IS_DEV_MODE) {
        // Modo dev: buscar do localStorage
        const stored = localStorage.getItem('user_profile_dev');
        if (stored) {
          setProfile(JSON.parse(stored) as UserProfile);
        }
      } else {
        // Produção: buscar do Supabase
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          router.push("/quiz/email");
          return;
        }

        const { data, error } = await supabase
          .from("user_profiles")
          .select("profile_data")
          .eq("user_id", user.id)
          .single();

        if (data) {
          setProfile(data.profile_data as UserProfile);
        }
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleContinue = () => {
    router.push("/quiz/video-demo");
  };

  // Determinar tipo de viajante baseado em scores
  const getTravelerType = () => {
    if (!profile) return null;
    
    const scores = profile.preference_scores;
    
    if (scores.adventure_level > 0.7 && scores.urban_vs_nature < 0.4) {
      return {
        name: "Explorador Aventureiro",
        icon: "/icons/icon-aventureiro.svg",
        description: "Você busca experiências autênticas e destinos únicos fora do convencional",
        tags: ["Natureza", "Aventura", "Cultura local"]
      };
    } else if (scores.food_sophistication > 0.7) {
      return {
        name: "Viajante Gourmet",
        icon: "/icons/icon-aventureiro.svg",
        description: "Você valoriza experiências gastronômicas autênticas e sofisticadas",
        tags: ["Gastronomia", "Cultura local", "Experiências únicas"]
      };
    } else if (scores.cultural_interest > 0.7) {
      return {
        name: "Explorador Cultural",
        icon: "/icons/icon-aventureiro.svg",
        description: "Você busca imersão em história, arte e cultura local",
        tags: ["Museus", "História", "Arte local"]
      };
    } else if (scores.luxury_preference > 0.7) {
      return {
        name: "Viajante de Luxo",
        icon: "/icons/icon-aventureiro.svg",
        description: "Você valoriza conforto, sofisticação e experiências premium",
        tags: ["Luxo", "Conforto", "Exclusividade"]
      };
    }
    
    // Default
    return {
      name: "Viajante Explorador",
      icon: "/icons/icon-aventureiro.svg",
      description: profile.persona_summary,
      tags: profile.hard_requirements.must_have_experiences.slice(0, 3)
    };
  };

  const travelerType = getTravelerType();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center">
        <p className="text-[#64748B] font-roboto-condensed text-xl">Carregando perfil...</p>
      </div>
    );
  }

  if (!profile || !travelerType) {
    return (
      <div className="min-h-screen bg-[#F1F1F1] flex items-center justify-center flex-col gap-4 px-8">
        <p className="text-[#1E293B] font-roboto-condensed text-xl text-center">
          Erro ao carregar perfil
        </p>
        <button
          onClick={() => router.push("/quiz/preparing-agent")}
          className="px-6 py-3 bg-[#FF5F38] text-white rounded-lg font-roboto-condensed"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F1F1F1] pb-8">
      {/* Header */}
      <div className="w-full flex flex-row justify-center items-center gap-5 px-[27px] py-[41px] border-b border-[rgba(100,116,139,0.4)]">
        <div className="flex flex-row justify-center items-center gap-[10px] px-[10px] flex-1">
          <h1 className="text-[#64748B] font-roboto-condensed font-normal text-2xl leading-[28px]">
            Seu perfil
          </h1>
        </div>
        <button className="w-[30px] h-[30px] flex items-center justify-center hover:opacity-80 transition-opacity">
          <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="20" cy="7.5" r="2.5" fill="#64748B"/>
            <circle cx="10" cy="17.5" r="2.5" fill="#64748B"/>
            <circle cx="20" cy="17.5" r="2.5" fill="#64748B"/>
            <path d="M12.5 17.5L17.5 12.5" stroke="#64748B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Perfil Completo Section */}
      <div className="w-full flex flex-col justify-center items-center gap-2 px-[7px] py-[9px] mt-10">
        <div className="w-[180px] h-[180px] relative">
          <Image
            src="/icons/Icon check perfil.svg"
            alt="Perfil completo"
            width={180}
            height={180}
            className="object-contain"
          />
        </div>
        <div className="flex flex-col justify-center items-center gap-[17px] px-[10px] py-[10px] w-full">
          <h2 className="text-[#1E293B] font-roboto-condensed font-black text-2xl leading-[28px] text-center">
            Perfil completo!
          </h2>
          <p className="text-[#64748B] font-roboto-condensed font-normal text-[15px] leading-[18px] text-center">
            Descobrimos o seu estilo de viajante
          </p>
        </div>
      </div>

      {/* Análise Completa Card */}
      <div className="mx-auto mt-8 w-[312px] flex flex-col items-center gap-[9px] px-[8px] py-[9px] bg-[#F6F7F9] border border-[#FF5F38] rounded-[20px]">
        <div className="w-full h-8 flex items-center justify-between px-[10px] py-[11px]">
          <span className="text-[#64748B] font-roboto-condensed font-normal text-[15px] leading-[18px]">
            Análise completa
          </span>
          <span className="text-[#E6502C] font-roboto-condensed font-black text-[15px] leading-[18px]">
            100%
          </span>
        </div>
        <div className="w-[278px] h-[21px] relative">
          <div className="absolute left-[3px] top-[8px] w-[271px] h-[5px] bg-gradient-to-r from-[#FF896F] via-[#FF5F38] to-[#E6502C] rounded-[20px]" />
        </div>
      </div>

      {/* Tipo de Viajante Card - DINÂMICO */}
      <div className="mx-auto mt-6 w-[312px] flex flex-col gap-[3px] px-[10px] py-[5px] bg-[rgba(255,95,56,0.25)] border border-[#FF5F38] rounded-[20px]">
        <div className="w-full flex items-start gap-3 p-[10px]">
          {/* Ícone no topo-esquerda */}
          <div className="w-[50px] h-[50px] flex-shrink-0 bg-[rgba(255,95,56,0.6)] rounded-[10px] flex items-center justify-center p-2">
            <Image
              src={travelerType.icon}
              alt={travelerType.name}
              width={30}
              height={30}
              className="object-contain"
            />
          </div>
          
          {/* Conteúdo à direita do ícone */}
          <div className="flex-1 flex flex-col gap-[6px] min-w-0">
            {/* Título */}
            <h3 className="text-[#1E293B] font-roboto-condensed font-semibold text-sm leading-[16px]">
              {travelerType.name}
            </h3>
            
            {/* Descrição */}
            <p className="text-[#E6502C] font-roboto-condensed font-normal text-[11px] leading-[13px]">
              {travelerType.description}
            </p>
            
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-[6px]">
              {travelerType.tags.map((tag, i) => (
                <div key={i} className="px-[15px] py-[5px] bg-[rgba(255,95,56,0.6)] rounded-[10px]">
                  <span className="text-white font-roboto-condensed font-normal text-[11px] leading-[13px] whitespace-nowrap">
                    {tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Suas Preferências Section */}
      <div className="mx-auto mt-8 w-full max-w-[355px] flex flex-col gap-2 px-[10px]">
        <div className="flex flex-row justify-center items-center gap-[10px] px-[17px] py-3">
          <h2 className="text-[#1E293B] font-roboto-condensed font-semibold text-2xl leading-[28px]">
            Suas preferências
          </h2>
        </div>
        <div className="flex flex-col gap-[15px] px-[35px] py-6">
          {/* Tipo de Destino - DINÂMICO */}
          <div className="w-full max-w-[285px] h-[71px] bg-[#F6F7F9] rounded-[15px] shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)] relative flex items-center px-[10px] gap-3">
            <div className="w-[64px] h-[59px] flex-shrink-0">
              <Image
                src="/icons/Icon-natureza-montanhas.svg"
                alt="Tipo de Destino"
                width={64}
                height={59}
                className="object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[#1E293B] font-roboto-condensed font-medium text-[13px] leading-[15px] mb-1">
                Tipo de Destino
              </h3>
              <p className="text-[#64748B] font-roboto-condensed font-normal text-[10px] leading-[12px] mb-2">
                {profile.preference_scores.urban_vs_nature < 0.4 ? "Natureza e montanhas" : profile.preference_scores.urban_vs_nature > 0.7 ? "Urbano e cidade" : "Mix de natureza e cidade"}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[20px] overflow-hidden">
                  <div 
                    className="h-full bg-[#FF5F38] rounded-[20px]" 
                    style={{ width: `${Math.round((1 - profile.preference_scores.urban_vs_nature) * 100)}%` }}
                  />
                </div>
                <span className="text-[#64748B] font-roboto-condensed font-normal text-[10px] leading-[12px] whitespace-nowrap">
                  {Math.round((1 - profile.preference_scores.urban_vs_nature) * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Atividades - DINÂMICO */}
          <div className="w-full max-w-[285px] h-[71px] bg-[#F6F7F9] rounded-[15px] shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)] relative flex items-center px-[10px] gap-3">
            <div className="w-[64px] h-[59px] flex-shrink-0">
              <Image
                src="/icons/Icon-natureza-e-trilhas.svg"
                alt="Atividades"
                width={64}
                height={59}
                className="object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[#1E293B] font-roboto-condensed font-medium text-[13px] leading-[15px] mb-1">
                Atividades
              </h3>
              <p className="text-[#64748B] font-roboto-condensed font-normal text-[10px] leading-[12px] mb-2">
                {profile.preference_scores.adventure_level > 0.7 ? "Aventura e esportes" : profile.preference_scores.adventure_level > 0.4 ? "Moderadas" : "Relaxantes"}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[20px] overflow-hidden">
                  <div 
                    className="h-full bg-[#FF5F38] rounded-[20px]" 
                    style={{ width: `${Math.round(profile.preference_scores.adventure_level * 100)}%` }}
                  />
                </div>
                <span className="text-[#64748B] font-roboto-condensed font-normal text-[10px] leading-[12px] whitespace-nowrap">
                  {Math.round(profile.preference_scores.adventure_level * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Gastronomia - DINÂMICO */}
          <div className="w-full max-w-[285px] h-[71px] bg-[#F6F7F9] rounded-[15px] shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)] relative flex items-center px-[10px] gap-3">
            <div className="w-[64px] h-[59px] flex-shrink-0">
              <Image
                src="/icons/Icon-culinária-local.svg"
                alt="Gastronomia"
                width={64}
                height={59}
                className="object-contain"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[#1E293B] font-roboto-condensed font-medium text-[13px] leading-[15px] mb-1">
                Gastronomia
              </h3>
              <p className="text-[#64748B] font-roboto-condensed font-normal text-[10px] leading-[12px] mb-2">
                {profile.preference_scores.food_sophistication > 0.7 ? "Gourmet e sofisticada" : profile.preference_scores.food_sophistication > 0.4 ? "Culinária local autêntica" : "Casual e prática"}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[20px] overflow-hidden">
                  <div 
                    className="h-full bg-[#FF5F38] rounded-[20px]" 
                    style={{ width: `${Math.round(profile.preference_scores.food_sophistication * 100)}%` }}
                  />
                </div>
                <span className="text-[#64748B] font-roboto-condensed font-normal text-[10px] leading-[12px] whitespace-nowrap">
                  {Math.round(profile.preference_scores.food_sophistication * 100)}%
                </span>
              </div>
            </div>
          </div>

          {/* Acomodação */}
          <div className="w-full max-w-[285px] h-[71px] bg-[#F6F7F9] rounded-[15px] shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)] relative flex items-center px-[10px] gap-3">
            <div className="w-[64px] h-[59px] flex-shrink-0">
              <Image
                src="/icons/Icon-superior-página-quais-hospedagens-combinam-com-seu-estilo.svg"
                alt="Acomodação"
                width={64}
                height={59}
                className="object-contain"
                style={{ filter: 'brightness(0) saturate(100%) invert(11%) sepia(8%) saturate(1234%) hue-rotate(182deg) brightness(95%) contrast(88%)' }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[#1E293B] font-roboto-condensed font-medium text-[13px] leading-[15px] mb-1">
                Acomodação
              </h3>
              <p className="text-[#64748B] font-roboto-condensed font-normal text-[10px] leading-[12px] mb-2">
                Hospedagens Únicas
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[20px] overflow-hidden">
                  <div className="w-[78%] h-full bg-[#FF5F38] rounded-[20px]" />
                </div>
                <span className="text-[#64748B] font-roboto-condensed font-normal text-[10px] leading-[12px] whitespace-nowrap">
                  78%
                </span>
              </div>
            </div>
          </div>

          {/* Orçamento */}
          <div className="w-full max-w-[285px] h-[71px] bg-[#F6F7F9] rounded-[15px] shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)] relative flex items-center px-[10px] gap-3">
            <div className="w-[64px] h-[59px] flex-shrink-0">
              <Image
                src="/icons/Icon-superior-página-orçamento-para-regalias-especiais.svg"
                alt="Orçamento"
                width={64}
                height={59}
                className="object-contain"
                style={{ filter: 'brightness(0) saturate(100%) invert(11%) sepia(8%) saturate(1234%) hue-rotate(182deg) brightness(95%) contrast(88%)' }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-[#1E293B] font-roboto-condensed font-medium text-[13px] leading-[15px] mb-1">
                Orçamento
              </h3>
              <p className="text-[#64748B] font-roboto-condensed font-normal text-[10px] leading-[12px] mb-2">
                Médio-Alto
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[20px] overflow-hidden">
                  <div className="w-[70%] h-full bg-[#FF5F38] rounded-[20px]" />
                </div>
                <span className="text-[#64748B] font-roboto-condensed font-normal text-[10px] leading-[12px] whitespace-nowrap">
                  70%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estilo de Viagem Section */}
      <div className="mx-auto mt-8 w-full max-w-[355px] flex flex-col gap-[19px] px-[10px]">
        <div className="flex flex-row justify-center items-center gap-[10px] px-[17px] py-3">
          <h2 className="text-[#1E293B] font-roboto-condensed font-semibold text-2xl leading-[28px]">
            Estilo de viagem
          </h2>
        </div>
        <div className="flex flex-row justify-center items-center gap-5 px-[10px] py-[5px]">
          {/* Companhia */}
          <div className="w-[114px] h-[112px] bg-[#F6F7F9] rounded-[10px] shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)] relative">
            <div className="absolute left-[5px] top-[7px] w-[105px] h-[48px] flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="16" r="4" fill="#FF5F38"/>
                <circle cx="28" cy="16" r="4" fill="#FF5F38"/>
                <path d="M8 28C8 24 10 22 12 22C14 22 16 24 16 28M24 28C24 24 26 22 28 22C30 22 32 24 32 28" stroke="#FF5F38" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="absolute left-[5px] top-[62px] w-[105px] h-[43px]">
              <h3 className="text-[#1E293B] font-roboto-condensed font-normal text-sm leading-[16px] mb-[6px]">
                Companhia
              </h3>
              <p className="text-[#64748B] font-roboto-condensed font-normal text-[10px] leading-[12px]">
                Pequenos grupos
              </p>
            </div>
          </div>

          {/* Duração */}
          <div className="w-[114px] h-[112px] bg-[#F6F7F9] rounded-[10px] shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)] relative">
            <div className="absolute left-[5px] top-[7px] w-[105px] h-[48px] flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="10" width="24" height="22" rx="2" stroke="#FF5F38" strokeWidth="2"/>
                <path d="M8 16H32" stroke="#FF5F38" strokeWidth="2"/>
                <path d="M18 6V10M22 6V10" stroke="#FF5F38" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="20" cy="24" r="3" fill="#FF5F38"/>
              </svg>
            </div>
            <div className="absolute left-[5px] top-[62px] w-[105px] h-[43px]">
              <h3 className="text-[#1E293B] font-roboto-condensed font-normal text-sm leading-[16px] mb-[6px]">
                Duração
              </h3>
              <p className="text-[#64748B] font-roboto-condensed font-normal text-[10px] leading-[12px]">
                7-14 dias
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-5 px-[10px] py-[5px]">
          {/* Ritmo */}
          <div className="w-[114px] h-[112px] bg-[#F6F7F9] rounded-[10px] shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)] relative">
            <div className="absolute left-[5px] top-[7px] w-[105px] h-[48px] flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="9" stroke="#FF5F38" strokeWidth="2"/>
                <path d="M20 12V20L25 25" stroke="#FF5F38" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="absolute left-[5px] top-[62px] w-[105px] h-[43px]">
              <h3 className="text-[#1E293B] font-roboto-condensed font-normal text-sm leading-[16px] mb-[6px]">
                Ritmo
              </h3>
              <p className="text-[#64748B] font-roboto-condensed font-normal text-[10px] leading-[12px]">
                Moderado
              </p>
            </div>
          </div>

          {/* Clima */}
          <div className="w-[114px] h-[112px] bg-[#F6F7F9] rounded-[10px] shadow-[1px_1px_4px_0px_rgba(0,0,0,0.25)] relative">
            <div className="absolute left-[5px] top-[7px] w-[105px] h-[48px] flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="20" cy="20" r="8" fill="#FF5F38"/>
                <path d="M20 4V8M20 32V36M36 20H32M8 20H4M30.928 9.072L28.314 11.686M11.686 28.314L9.072 30.928M30.928 30.928L28.314 28.314M11.686 11.686L9.072 9.072" stroke="#FF5F38" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="absolute left-[5px] top-[62px] w-[105px] h-[43px]">
              <h3 className="text-[#1E293B] font-roboto-condensed font-normal text-sm leading-[16px] mb-[6px]">
                Clima
              </h3>
              <p className="text-[#64748B] font-roboto-condensed font-normal text-[10px] leading-[12px]">
                Temperado
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Principais Interesses Section */}
      <div className="mx-auto mt-8 w-full max-w-[355px] flex flex-col px-[10px] pb-8">
        <div className="w-full h-[53px] flex items-center justify-center py-[13px]">
          <h2 className="text-[#1E293B] font-roboto-condensed font-semibold text-2xl leading-[28px]">
            Principais interesses
          </h2>
        </div>
        <div className="w-full flex flex-col gap-[11px] py-[76px]">
          {/* Primeira linha */}
          <div className="flex flex-row gap-[12px] px-[12px]">
            <div className="w-[155px] h-[47px] bg-[rgba(255,95,56,0.25)] border border-[#FF5F38] rounded-[40px] flex items-center justify-center gap-[18px]">
              <Image
                src="/icons/Icon-Contato-com-a-natureza.svg"
                alt="Ecoturismo"
                width={16}
                height={21}
                className="object-contain"
              />
              <span className="text-[#FF5F38] font-roboto-condensed font-normal text-xl leading-[23px]">
                Ecoturismo
              </span>
            </div>
            <div className="w-[143px] h-[47px] bg-[rgba(255,95,56,0.25)] border border-[#FF5F38] rounded-[40px] flex items-center justify-center gap-[11px]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="4" y="6" width="16" height="12" rx="2" stroke="#FF5F38" strokeWidth="2"/>
                <circle cx="12" cy="12" r="3" stroke="#FF5F38" strokeWidth="2"/>
                <path d="M8 6L9 4H15L16 6" stroke="#FF5F38" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="text-[#FF5F38] font-roboto-condensed font-normal text-xl leading-[23px]">
                Fotografia
              </span>
            </div>
          </div>

          {/* Segunda linha */}
          <div className="flex flex-row gap-[12px] px-[12px]">
            <div className="w-[128px] h-[47px] bg-white border border-[#1E293B] rounded-[40px] flex items-center justify-center gap-[12px]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 20H20V8H4V20Z" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 8V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V8" stroke="#1E293B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M12 10V12" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
                <path d="M10 14H14" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
                <path d="M6 16H18" stroke="#1E293B" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <span className="text-[#1E293B] font-roboto-condensed font-normal text-xl leading-[23px]">
                História
              </span>
            </div>
            <div className="w-[142px] h-[47px] bg-white border border-[#1E293B] rounded-[40px] flex items-center justify-center gap-[12px]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <ellipse cx="12" cy="16" rx="8" ry="4" fill="#1E293B" opacity="0.2"/>
                <circle cx="8" cy="12" r="2" fill="#FF5F38"/>
                <circle cx="12" cy="10" r="2" fill="#FF896F"/>
                <circle cx="16" cy="12" r="2" fill="#E6502C"/>
                <path d="M12 2L14 8L12 10L10 8L12 2Z" fill="#1E293B"/>
                <path d="M8 6L10 8L8 10L6 8L8 6Z" fill="#1E293B"/>
                <path d="M16 6L18 8L16 10L14 8L16 6Z" fill="#1E293B"/>
              </svg>
              <span className="text-[#1E293B] font-roboto-condensed font-normal text-xl leading-[23px]">
                Arte local
              </span>
            </div>
          </div>

          {/* Terceira linha */}
          <div className="flex flex-row gap-[12px] px-[12px]">
            <div className="w-[183px] h-[47px] bg-white border border-[#1E293B] rounded-[40px] flex items-center justify-center gap-[12px]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8C10.5 8 9.5 9 9.5 10.5C9.5 12 10.5 13 12 13C13.5 13 14.5 12 14.5 10.5C14.5 9 13.5 8 12 8Z" fill="#1E293B"/>
                <path d="M8 14C7 14 6.5 14.5 6.5 15.5C6.5 16.5 7 17 8 17C9 17 9.5 16.5 9.5 15.5C9.5 14.5 9 14 8 14Z" fill="#1E293B"/>
                <path d="M16 14C15 14 14.5 14.5 14.5 15.5C14.5 16.5 15 17 16 17C17 17 17.5 16.5 17.5 15.5C17.5 14.5 17 14 16 14Z" fill="#1E293B"/>
                <path d="M6 18C5 18 4.5 18.5 4.5 19.5C4.5 20.5 5 21 6 21C7 21 7.5 20.5 7.5 19.5C7.5 18.5 7 18 6 18Z" fill="#1E293B"/>
                <path d="M18 18C17 18 16.5 18.5 16.5 19.5C16.5 20.5 17 21 18 21C19 21 19.5 20.5 19.5 19.5C19.5 18.5 19 18 18 18Z" fill="#1E293B"/>
                <path d="M12 20C11 20 10.5 20.5 10.5 21.5C10.5 22.5 11 23 12 23C13 23 13.5 22.5 13.5 21.5C13.5 20.5 13 20 12 20Z" fill="#1E293B"/>
                <ellipse cx="12" cy="10" rx="6" ry="4" stroke="#1E293B" strokeWidth="1.5" opacity="0.3"/>
              </svg>
              <span className="text-[#1E293B] font-roboto-condensed font-normal text-xl leading-[23px]">
                Vida selvagem
              </span>
            </div>
            <div className="w-[133px] h-[47px] bg-white border border-[#1E293B] rounded-[40px] flex items-center justify-center gap-[8px]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4C10 4 8.5 5.5 8.5 7.5C8.5 9.5 10 11 12 11C14 11 15.5 9.5 15.5 7.5C15.5 5.5 14 4 12 4Z" fill="#1E293B"/>
                <path d="M8 14C7 14 6.5 14.5 6.5 15.5C6.5 16.5 7 17 8 17C9 17 9.5 16.5 9.5 15.5C9.5 14.5 9 14 8 14Z" fill="#1E293B"/>
                <path d="M16 14C15 14 14.5 14.5 14.5 15.5C14.5 16.5 15 17 16 17C17 17 17.5 16.5 17.5 15.5C17.5 14.5 17 14 16 14Z" fill="#1E293B"/>
                <path d="M12 18C11 18 10.5 18.5 10.5 19.5C10.5 20.5 11 21 12 21C13 21 13.5 20.5 13.5 19.5C13.5 18.5 13 18 12 18Z" fill="#1E293B"/>
                <path d="M6 20C5 20 4.5 20.5 4.5 21.5C4.5 22.5 5 23 6 23C7 23 7.5 22.5 7.5 21.5C7.5 20.5 7 20 6 20Z" fill="#1E293B"/>
                <path d="M18 20C17 20 16.5 20.5 16.5 21.5C16.5 22.5 17 23 18 23C19 23 19.5 22.5 19.5 21.5C19.5 20.5 19 20 18 20Z" fill="#1E293B"/>
                <path d="M12 8L10 12L12 14L14 12L12 8Z" fill="#1E293B" opacity="0.5"/>
              </svg>
              <span className="text-[#1E293B] font-roboto-condensed font-normal text-xl leading-[23px]">
                Bem-estar
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Botão Continuar Flutuante */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={handleContinue}
          className="hover:scale-105 transition-transform duration-200 cursor-pointer"
        >
          <Image
            src="/icons/Botão.svg"
            alt="Continuar"
            width={400}
            height={93}
            className="w-[400px] h-[93px]"
          />
        </button>
      </div>
    </div>
  );
}
