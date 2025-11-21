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
    try {
      // Primeiro tentar buscar do localStorage
      const stored = localStorage.getItem('user_profile_dev');
      if (stored) {
        setProfile(JSON.parse(stored) as UserProfile);
        setLoading(false);
        return;
      }
      
      // Se não encontrar no localStorage, tentar buscar do Supabase
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Se não tem perfil no localStorage e não está autenticado, erro
        console.error("No profile found and user not authenticated");
        setLoading(false);
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
    } catch (error) {
      console.error("Error loading profile:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleContinue = () => {
    router.push("/quiz/video-demo");
  };

  // Determinar tipo de viajante baseado em scores (0-10)
  const getTravelerType = () => {
    if (!profile) return null;
    
    const scores = profile.preference_scores;
    
    // Aventureiro Intenso
    if (scores.adventure_level >= 8 && scores.urban_vs_nature <= 3) {
      return {
        name: "Explorador Aventureiro Intenso",
        icon: "/icons/icon-aventureiro.svg",
        description: "Você é apaixonado por destinos selvagens e experiências que desafiam seus limites. Busca contato direto com a natureza e atividades que elevam a adrenalina.",
        tags: ["Aventura extrema", "Natureza selvagem", "Trilhas e expedições"]
      };
    }
    
    // Aventureiro Moderado
    if (scores.adventure_level >= 6 && scores.urban_vs_nature <= 5) {
      return {
        name: "Viajante Aventureiro",
        icon: "/icons/icon-aventureiro.svg",
        description: "Você equilibra aventura com conforto, buscando experiências autênticas na natureza sem abrir mão de uma boa infraestrutura de apoio.",
        tags: ["Ecoturismo", "Trilhas moderadas", "Contato com natureza"]
      };
    }
    
    // Gourmet Sofisticado
    if (scores.food_sophistication >= 8 && scores.luxury_preference >= 6) {
      return {
        name: "Viajante Gourmet Sofisticado",
        icon: "/icons/icon-aventureiro.svg",
        description: "Para você, a gastronomia é a essência da viagem. Busca restaurantes renomados, experiências culinárias únicas e os melhores sabores locais com toque refinado.",
        tags: ["Alta gastronomia", "Restaurantes premiados", "Degustações exclusivas"]
      };
    }
    
    // Gourmet Cultural
    if (scores.food_sophistication >= 7) {
      return {
        name: "Explorador Gastronômico",
        icon: "/icons/icon-aventureiro.svg",
        description: "Você viaja para experimentar a cultura através da comida autêntica local. Mercados, comida de rua e restaurantes tradicionais são seus destinos favoritos.",
        tags: ["Gastronomia local", "Experiências culinárias", "Cultura através da comida"]
      };
    }
    
    // Cultural Profundo
    if (scores.cultural_interest >= 8) {
      return {
        name: "Viajante Cultural Apaixonado",
        icon: "/icons/icon-aventureiro.svg",
        description: "História, arte e tradições locais são sua paixão. Você busca imersão completa na cultura de cada destino, visitando museus, galerias e eventos culturais.",
        tags: ["Museus e história", "Arte local", "Patrimônio cultural"]
      };
    }
    
    // Luxo Premium
    if (scores.luxury_preference >= 8) {
      return {
        name: "Viajante de Luxo Premium",
        icon: "/icons/icon-aventureiro.svg",
        description: "Você valoriza o máximo em conforto, exclusividade e sofisticação. Hotéis cinco estrelas, serviços personalizados e experiências VIP definem suas viagens.",
        tags: ["Luxo exclusivo", "Experiências VIP", "Conforto premium"]
      };
    }
    
    // Social e Festivo
    if (scores.nightlife_interest >= 8 && scores.social_level >= 7) {
      return {
        name: "Viajante Social e Festivo",
        icon: "/icons/icon-aventureiro.svg",
        description: "Você viaja para conectar-se com pessoas e viver a energia noturna dos destinos. Bares, baladas e eventos sociais são essenciais no seu roteiro.",
        tags: ["Vida noturna", "Socialização", "Festas e eventos"]
      };
    }
    
    // Zen e Relaxamento
    if (scores.activity_intensity <= 3 && scores.nightlife_interest <= 4) {
      return {
        name: "Viajante Zen e Contemplativo",
        icon: "/icons/icon-aventureiro.svg",
        description: "Suas viagens são sobre desacelerar e recarregar energias. Busca destinos tranquilos, spas, yoga e momentos de paz longe do caos urbano.",
        tags: ["Relaxamento profundo", "Bem-estar", "Tranquilidade"]
      };
    }
    
    // Urbano Explorador
    if (scores.urban_vs_nature >= 8 && scores.exploration_desire >= 6) {
      return {
        name: "Explorador Urbano",
        icon: "/icons/icon-aventureiro.svg",
        description: "Cidades vibrantes são seu playground. Você adora explorar arquitetura, vida local, gastronomia urbana e a energia pulsante dos grandes centros.",
        tags: ["Exploração urbana", "Arquitetura", "Cultura de cidade"]
      };
    }
    
    // Equilibrado
    return {
      name: "Viajante Versátil e Equilibrado",
      icon: "/icons/icon-aventureiro.svg",
      description: profile.persona_summary,
      tags: ["Experiências variadas", "Flexível", "Aberto a tudo"]
    };
  };

  const travelerType = getTravelerType();

  // Funções auxiliares para tornar seções dinâmicas
  const getAccommodationInfo = () => {
    if (!profile) return { label: "Padrão", score: 50 };
    
    const luxuryScore = profile.preference_scores.luxury_preference;
    
    if (luxuryScore >= 8) {
      return { label: "Luxo e exclusividade", score: Math.round(luxuryScore * 10) };
    } else if (luxuryScore >= 6) {
      return { label: "Conforto premium", score: Math.round(luxuryScore * 10) };
    } else if (luxuryScore >= 4) {
      return { label: "Hospedagens únicas", score: Math.round(luxuryScore * 10) };
    } else {
      return { label: "Econômico e prático", score: Math.round(luxuryScore * 10) };
    }
  };

  const getBudgetInfo = () => {
    if (!profile) return { label: "Médio", score: 50 };
    
    const luxuryScore = profile.preference_scores.luxury_preference;
    
    if (luxuryScore >= 8) {
      return { label: "Alto", score: 90 };
    } else if (luxuryScore >= 6) {
      return { label: "Médio-Alto", score: 75 };
    } else if (luxuryScore >= 4) {
      return { label: "Médio", score: 55 };
    } else {
      return { label: "Econômico", score: 35 };
    }
  };

  const getCompanyStyle = () => {
    if (!profile) return "Flexível";
    
    const socialScore = profile.preference_scores.social_level;
    
    if (socialScore >= 8) {
      return "Grandes grupos";
    } else if (socialScore >= 5) {
      return "Pequenos grupos";
    } else {
      return "Solo ou casal";
    }
  };

  const getDurationStyle = () => {
    if (!profile) return "7-14 dias";
    
    const intensityScore = profile.preference_scores.activity_intensity;
    
    if (intensityScore >= 8) {
      return "5-10 dias (intenso)";
    } else if (intensityScore >= 5) {
      return "7-14 dias";
    } else {
      return "14+ dias (relaxado)";
    }
  };

  const getRhythmLabel = () => {
    if (!profile) return "Equilibrado";
    
    const rhythm = profile.travel_rhythm;
    
    if (rhythm === 'agitado') {
      return "Agitado";
    } else if (rhythm === 'tranquilo') {
      return "Tranquilo";
    } else {
      return "Equilibrado";
    }
  };

  const getClimatePreference = () => {
    if (!profile) return "Temperado";
    
    const urbanVsNature = profile.preference_scores.urban_vs_nature;
    const adventureLevel = profile.preference_scores.adventure_level;
    
    if (urbanVsNature <= 3 && adventureLevel >= 7) {
      return "Variado";
    } else if (urbanVsNature >= 7) {
      return "Urbano";
    } else {
      return "Temperado";
    }
  };

  const getMainInterests = () => {
    if (!profile) return [];
    
    const scores = profile.preference_scores;
    const interests: Array<{ label: string; highlighted: boolean }> = [];
    
    // Determinar interesses baseado nos scores mais altos
    if (scores.adventure_level >= 7) {
      interests.push({ label: "Aventura", highlighted: true });
    }
    
    if (scores.urban_vs_nature <= 3) {
      interests.push({ label: "Ecoturismo", highlighted: true });
    }
    
    if (scores.food_sophistication >= 7) {
      interests.push({ label: "Gastronomia", highlighted: true });
    }
    
    if (scores.cultural_interest >= 7) {
      interests.push({ label: "História", highlighted: interests.length < 2 });
    }
    
    if (scores.exploration_desire >= 7) {
      interests.push({ label: "Fotografia", highlighted: interests.length < 2 });
    }
    
    if (scores.nightlife_interest >= 7) {
      interests.push({ label: "Vida noturna", highlighted: interests.length < 2 });
    }
    
    if (scores.fitness_priority >= 7) {
      interests.push({ label: "Bem-estar", highlighted: interests.length < 2 });
    }
    
    // Adicionar interesses padrão se não tiver suficientes
    if (interests.length < 6) {
      const defaultInterests = ["Arte local", "Cultura", "Natureza", "Relaxamento"];
      for (const interest of defaultInterests) {
        if (interests.length >= 6) break;
        if (!interests.find(i => i.label === interest)) {
          interests.push({ label: interest, highlighted: false });
        }
      }
    }
    
    return interests.slice(0, 6);
  };

  const accommodationInfo = getAccommodationInfo();
  const budgetInfo = getBudgetInfo();
  const mainInterests = getMainInterests();

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
                {profile.preference_scores.urban_vs_nature <= 3 ? "Natureza e montanhas" : profile.preference_scores.urban_vs_nature >= 7 ? "Urbano e cidade" : "Mix de natureza e cidade"}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[20px] overflow-hidden">
                  <div 
                    className="h-full bg-[#FF5F38] rounded-[20px]" 
                    style={{ width: `${Math.round((10 - profile.preference_scores.urban_vs_nature) * 10)}%` }}
                  />
                </div>
                <span className="text-[#64748B] font-roboto-condensed font-normal text-[10px] leading-[12px] whitespace-nowrap">
                  {Math.round((10 - profile.preference_scores.urban_vs_nature) * 10)}%
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
                {profile.preference_scores.adventure_level >= 8 ? "Aventura e esportes" : profile.preference_scores.adventure_level >= 4 ? "Moderadas" : "Relaxantes"}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[20px] overflow-hidden">
                  <div 
                    className="h-full bg-[#FF5F38] rounded-[20px]" 
                    style={{ width: `${Math.round(profile.preference_scores.adventure_level * 10)}%` }}
                  />
                </div>
                <span className="text-[#64748B] font-roboto-condensed font-normal text-[10px] leading-[12px] whitespace-nowrap">
                  {Math.round(profile.preference_scores.adventure_level * 10)}%
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
                {profile.preference_scores.food_sophistication >= 8 ? "Gourmet e sofisticada" : profile.preference_scores.food_sophistication >= 4 ? "Culinária local autêntica" : "Casual e prática"}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[20px] overflow-hidden">
                  <div 
                    className="h-full bg-[#FF5F38] rounded-[20px]" 
                    style={{ width: `${Math.round(profile.preference_scores.food_sophistication * 10)}%` }}
                  />
                </div>
                <span className="text-[#64748B] font-roboto-condensed font-normal text-[10px] leading-[12px] whitespace-nowrap">
                  {Math.round(profile.preference_scores.food_sophistication * 10)}%
                </span>
              </div>
            </div>
          </div>

          {/* Acomodação - DINÂMICO */}
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
                {accommodationInfo.label}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[20px] overflow-hidden">
                  <div 
                    className="h-full bg-[#FF5F38] rounded-[20px]" 
                    style={{ width: `${accommodationInfo.score}%` }}
                  />
                </div>
                <span className="text-[#64748B] font-roboto-condensed font-normal text-[10px] leading-[12px] whitespace-nowrap">
                  {accommodationInfo.score}%
                </span>
              </div>
            </div>
          </div>

          {/* Orçamento - DINÂMICO */}
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
                {budgetInfo.label}
              </p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-[4px] bg-[rgba(100,116,139,0.1)] rounded-[20px] overflow-hidden">
                  <div 
                    className="h-full bg-[#FF5F38] rounded-[20px]" 
                    style={{ width: `${budgetInfo.score}%` }}
                  />
                </div>
                <span className="text-[#64748B] font-roboto-condensed font-normal text-[10px] leading-[12px] whitespace-nowrap">
                  {budgetInfo.score}%
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
          {/* Companhia - DINÂMICO */}
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
                {getCompanyStyle()}
              </p>
            </div>
          </div>

          {/* Duração - DINÂMICO */}
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
                {getDurationStyle()}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-5 px-[10px] py-[5px]">
          {/* Ritmo - DINÂMICO */}
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
                {getRhythmLabel()}
              </p>
            </div>
          </div>

          {/* Clima - DINÂMICO */}
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
                {getClimatePreference()}
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
          {/* Interesses DINÂMICOS - renderiza em pares de 2 */}
          {mainInterests.reduce((rows: any[], interest, index) => {
            if (index % 2 === 0) {
              rows.push(mainInterests.slice(index, index + 2));
            }
            return rows;
          }, []).map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-row gap-[12px] px-[12px]">
              {row.map((interest: any, colIndex: number) => (
                <div 
                  key={colIndex}
                  className={`min-w-[120px] h-[47px] rounded-[40px] flex items-center justify-center gap-[11px] px-4 ${
                    interest.highlighted 
                      ? 'bg-[rgba(255,95,56,0.25)] border border-[#FF5F38]' 
                      : 'bg-white border border-[#1E293B]'
                  }`}
                >
                  <span className={`font-roboto-condensed font-normal text-xl leading-[23px] ${
                    interest.highlighted ? 'text-[#FF5F38]' : 'text-[#1E293B]'
                  }`}>
                    {interest.label}
                  </span>
                </div>
              ))}
            </div>
          ))}
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
