"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizTestimonialsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'anual' | 'mensal'>('anual');

  useEffect(() => {
    // Força fundo branco no body e html
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.background = '#ffffff';
    document.body.style.border = 'none';
    document.body.style.outline = 'none';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    
    document.documentElement.style.backgroundColor = '#ffffff';
    document.documentElement.style.background = '#ffffff';
    document.documentElement.style.border = 'none';
    document.documentElement.style.outline = 'none';
    document.documentElement.style.margin = '0';
    document.documentElement.style.padding = '0';
  }, []);

  const handleActivateAgent = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan('anual'); // Reset para o plano padrão ao fechar
  };

  const handleSelectPlan = () => {
    // Usa o plano selecionado (anual ou mensal)
    console.log('Plano selecionado:', selectedPlan);
    setIsModalOpen(false);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white w-full">
      <div 
        className="min-h-screen bg-white flex flex-col items-center py-[58px] px-0 max-w-[375px] mx-auto relative border-0"
        style={{ 
          border: 'none', 
          outline: 'none',
          boxShadow: 'none',
          borderColor: 'transparent',
          borderWidth: '0',
          borderStyle: 'none'
        }}
      >
      {/* Logo */}
      <div className="w-full flex justify-center mb-6 pt-4">
        <Image
          src="/logo.svg"
          alt="Ca$hTrip"
          width={200}
          height={100}
          className="object-contain"
        />
      </div>

      {/* Título */}
      <div className="w-full flex flex-col items-center gap-[10px] px-[51px] pt-[25px] pb-3">
        <h1 className="text-black font-roboto-condensed font-extrabold text-xl leading-[23px] text-center">
          Junte se as milhares de pessoas que já trocaram o estresse por um roteiro pronto
        </h1>
      </div>

      {/* Container para badges */}
      <div className="w-full flex flex-row items-center justify-center gap-4 mt-6 mb-8">
        {/* Badge Esquerda - 1M+ 5-Stars Reviews */}
        <div className="flex items-center gap-2">
          <Image
            src="/icons/Icon louro esquerda.svg"
            alt="Louro esquerda"
            width={26}
            height={38}
            className="object-contain"
          />
          <div className="text-black font-roboto-condensed font-normal text-[10px] leading-[14px] text-center">
            1M+
            <br />
            5-Stars Reviews
          </div>
          <Image
            src="/icons/Icon louro direita.svg"
            alt="Louro direita"
            width={45}
            height={45}
            className="object-contain"
          />
        </div>

        {/* Badge Direita - Top 1 Aplicativo de viagem */}
        <div className="flex items-center gap-2">
          <Image
            src="/icons/Icon louro esquerda.svg"
            alt="Louro esquerda"
            width={26}
            height={38}
            className="object-contain"
          />
          <div className="text-black font-roboto-condensed font-normal text-[10px] leading-[14px] text-center">
            Top 1
            <br />
            Aplicativo de viagem
          </div>
          <Image
            src="/icons/Icon louro direita.svg"
            alt="Louro direita"
            width={45}
            height={45}
            className="object-contain"
          />
        </div>
      </div>

      {/* Container relativo para elementos posicionados absolutamente */}
      <div className="relative w-full flex flex-col items-center">

        {/* Card de Depoimento */}
        <div 
          className="relative w-[295px] h-[158px] border-2 border-[#FF4A1B] rounded-[10px] mb-4"
          style={{ borderColor: '#FF4A1B', borderWidth: '2px', borderStyle: 'solid' }}
        >
          {/* Avatar */}
          <div className="absolute left-[12px] top-[11px] w-[35px] h-[35px] rounded-full overflow-hidden bg-gray-200">
            {/* Placeholder para avatar - será substituído quando o asset estiver disponível */}
            <div className="w-full h-full bg-gray-300 flex items-center justify-center">
              <span className="text-gray-500 text-xs">MV</span>
            </div>
          </div>

          {/* Nome e Username */}
          <div className="absolute left-[52px] top-[13px]">
            <div className="text-black font-roboto-condensed font-medium text-[13px] leading-[15px]">
              Max Verstappen
            </div>
            <div className="text-[rgba(0,0,0,0.33)] font-roboto-condensed font-light text-[9px] leading-[11px] mt-[1px]">
              @maxverstappenpiquet
            </div>
          </div>

          {/* 5 Estrelas */}
          <div className="absolute right-[12px] top-[14px] flex gap-[3px]">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                width="15"
                height="14"
                viewBox="0 0 15 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7.5 0L9.18 5.18L14.5 5.18L10.16 8.32L11.84 13.5L7.5 10.36L3.16 13.5L4.84 8.32L0.5 5.18L5.82 5.18L7.5 0Z"
                  fill="#FDD835"
                />
              </svg>
            ))}
          </div>

          {/* Texto do Depoimento */}
          <div className="absolute left-3 top-[50px] w-[276px]">
            <p className="text-black font-roboto-condensed font-light text-[10px] leading-[12px] text-left">
              A cash trip realmente superou minhas espectativas, o agente foi certeiro mesmo com meu jatinho particular Falcon 8X de 46 milhões de dólares e um alcance de 11.945 km eu pulei a parte do transporte e deixei meu agente reservar minha hospedagem em st moritz e meu roteiro completo na viagem e tudo foi perfeito, só aprovei tudo e deixei ele fazer as reservas, não me preocupei com nada.
            </p>
          </div>
        </div>

        {/* Indicadores de Paginação */}
        <div className="flex items-center justify-center gap-2 mb-4 mt-[16px]">
          <div className="w-[15px] h-[16px] rounded-full bg-[#979797]"></div>
          <div className="w-[15px] h-[16px] rounded-full bg-[rgba(130,130,130,0.16)]"></div>
          <div className="w-[15px] h-[16px] rounded-full bg-[rgba(182,182,182,0.16)]"></div>
        </div>

        {/* Texto "Seu agente pessoal já está pronto esperando por você" */}
        <div className="w-full px-[50px] mb-4">
          <p className="text-black font-roboto-condensed font-medium text-[13px] leading-[15px] text-center">
            Seu agente pessoal já está pronto esperando por você
          </p>
        </div>

        {/* Botão "Ativar meu Agente Agora" - Fixo na parte inferior */}
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full max-w-[375px] px-5 z-50">
          <button
            onClick={handleActivateAgent}
            className="w-full h-[46px] rounded-[60px] bg-[#1E293B] shadow-[0px_4px_8px_0px_rgba(0,0,0,0.3)] flex items-center justify-center hover:scale-105 transition-transform duration-200"
          >
            <span className="text-[#FF5F38] font-roboto-condensed font-medium text-[13px] leading-[15px]">
              Ativar meu Agente Agora
            </span>
          </button>
        </div>
      </div>
      </div>

      {/* Modal de Planos */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-transparent flex items-end justify-center z-[100]"
            onClick={handleCloseModal}
          >
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white w-full max-w-[375px] rounded-t-[21px] border-t-2 border-[#FF5F38]"
              onClick={(e) => e.stopPropagation()}
              style={{ maxHeight: '96vh', overflowY: 'auto' }}
            >
            {/* Título */}
            <div className="pt-9 pb-8 flex justify-center">
              <h2 className="text-black font-semibold text-[28px] text-center">
                Escolha Seu Plano
              </h2>
            </div>

            {/* Banner de Promoção */}
            <div className="mx-auto w-[340px] h-[44px] bg-[#F5F5F5] rounded-[12px] flex items-center justify-center mb-10 relative">
              <svg className="absolute left-5" width="20" height="20" viewBox="0 0 14 14" fill="none">
                <path d="M7 0L8.5 5L14 5L9.5 8.5L11 13.5L7 10L3 13.5L4.5 8.5L0 5L5.5 5L7 0Z" fill="url(#gradient)" />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FD4B19" />
                    <stop offset="100%" stopColor="#BBB736" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="text-[13px] font-semibold ml-10 bg-gradient-to-r from-[#FD4B19] to-[#BBB736] bg-clip-text text-transparent">
                60% Off Sale
              </span>
              <span className="text-[13px] font-semibold ml-auto mr-5 bg-gradient-to-r from-[#FD4B19] to-[#BBB736] bg-clip-text text-transparent">
                9 vagas restantes
              </span>
            </div>

            {/* Plano Anual */}
            <div 
              onClick={() => setSelectedPlan('anual')}
              className="mx-auto w-[340px] h-[95px] rounded-[14px] mb-6 relative cursor-pointer transition-all duration-200 hover:scale-[1.02]"
              style={{ 
                background: selectedPlan === 'anual' 
                  ? 'linear-gradient(54deg, #C3C3C3 0%, #FFFFFF 100%)' 
                  : 'rgba(255,255,255,0.61)',
                border: selectedPlan === 'anual' 
                  ? '1px solid transparent' 
                  : '1px solid #C3C3C3',
                backgroundImage: selectedPlan === 'anual'
                  ? 'linear-gradient(54deg, #C3C3C3 0%, #FFFFFF 100%), linear-gradient(90deg, #FD4B19 0%, #BBB736 100%)'
                  : 'none',
                backgroundOrigin: selectedPlan === 'anual' ? 'border-box' : 'padding-box',
                backgroundClip: selectedPlan === 'anual' ? 'padding-box, border-box' : 'padding-box'
              }}>
              <div className="absolute left-12 top-8">
                <p className="text-black font-semibold text-[18px]">Anual</p>
              </div>
              <div className="absolute right-16 top-6">
                <p className="text-black font-semibold text-[18px]">R$ 19,99</p>
                <p className="text-[#828282] text-[10px] text-right">por mês</p>
              </div>
              <div className="absolute right-[210px] top-7">
                <p className="text-[#828282] text-[10px] line-through">R$397,90</p>
              </div>
              {/* Radio button */}
              <div className="absolute left-6 bottom-8 w-5 h-5 rounded-full border border-[#C3C3C3] flex items-center justify-center">
                {selectedPlan === 'anual' && (
                  <div className="w-[7px] h-[7px] rounded-full bg-gradient-to-r from-[#FD4B19] to-[#BBB736]"></div>
                )}
              </div>
            </div>

            {/* Plano Mensal */}
            <div 
              onClick={() => setSelectedPlan('mensal')}
              className="mx-auto w-[340px] h-[95px] rounded-[14px] mb-10 relative cursor-pointer transition-all duration-200 hover:scale-[1.02]"
              style={{ 
                background: selectedPlan === 'mensal' 
                  ? 'linear-gradient(54deg, #C3C3C3 0%, #FFFFFF 100%)' 
                  : 'rgba(255,255,255,0.61)',
                border: selectedPlan === 'mensal' 
                  ? '1px solid transparent' 
                  : '1px solid #C3C3C3',
                backgroundImage: selectedPlan === 'mensal'
                  ? 'linear-gradient(54deg, #C3C3C3 0%, #FFFFFF 100%), linear-gradient(90deg, #FD4B19 0%, #BBB736 100%)'
                  : 'none',
                backgroundOrigin: selectedPlan === 'mensal' ? 'border-box' : 'padding-box',
                backgroundClip: selectedPlan === 'mensal' ? 'padding-box, border-box' : 'padding-box'
              }}>
              <div className="absolute left-12 top-8">
                <p className="text-black font-semibold text-[18px]">Mensal</p>
              </div>
              <div className="absolute right-16 top-6">
                <p className="text-black font-semibold text-[18px]">R$ 27,90</p>
                <p className="text-[#828282] text-[10px] text-right">por mês</p>
              </div>
              <div className="absolute right-[210px] top-7">
                <p className="text-[#828282] text-[10px] line-through">R$49,99</p>
              </div>
              {/* Radio button */}
              <div className="absolute left-6 bottom-8 w-5 h-5 rounded-full border border-[#C3C3C3] flex items-center justify-center">
                {selectedPlan === 'mensal' && (
                  <div className="w-[7px] h-[7px] rounded-full bg-gradient-to-r from-[#FD4B19] to-[#BBB736]"></div>
                )}
              </div>
            </div>

            {/* Ícone e texto de garantia */}
            <div className="flex items-center justify-center mb-10">
              <svg width="20" height="20" viewBox="0 0 14 14" fill="none" className="mr-4">
                <path d="M7 0L8 3L11 4L8 5L7 8L6 5L3 4L6 3L7 0Z" fill="#FFFFFF" />
              </svg>
              <p className="text-[#4F4F4F] text-[11px] font-semibold">
                Sem compromisso, cancele a qualquer momento
              </p>
            </div>

            {/* Botão de Ação */}
            <div className="px-10 pb-12">
              <button
                onClick={handleSelectPlan}
                className="w-full h-[52px] rounded-[20px] flex items-center justify-center"
                style={{ background: 'linear-gradient(90deg, #FD4B19 0%, #BBB736 100%)' }}
              >
                <span className="text-white font-bold text-[15px]">
                  Começar minha jornada hoje
                </span>
              </button>
            </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

