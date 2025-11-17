"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuizTestimonialsPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState<'pro' | 'viajante'>('pro');
  const [billingPeriod, setBillingPeriod] = useState<'mensal' | 'anual'>('mensal');

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
    setSelectedPlanType('pro'); // Reset para o plano padrão ao fechar
    setBillingPeriod('mensal'); // Reset para o período padrão ao fechar
  };

  const handleSelectPlan = () => {
    // Usa o plano selecionado (pro ou viajante) e período (mensal ou anual)
    console.log('Plano selecionado:', selectedPlanType, 'Período:', billingPeriod);
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
              className="bg-white w-full max-w-[375px] rounded-t-[20px]"
              onClick={(e) => e.stopPropagation()}
              style={{ 
                maxHeight: '96vh', 
                overflowY: 'auto',
                boxShadow: '0px -2px 4px 0px rgba(230, 80, 44, 0.3)'
              }}
            >
            {/* Título */}
            <div className="pt-[28px] pb-0 flex justify-center">
              <h2 className="text-[#1E293B] font-bold text-[24px] text-center leading-[28px]" style={{ fontFamily: 'Roboto' }}>
                Escolha Seu Plano
              </h2>
            </div>

            {/* Banner de Promoção */}
            <div className="mx-auto w-[348px] h-[70px] bg-[#F6F7F9] rounded-[15px] flex items-center mb-0 mt-[28px] relative px-[5px]">
              <div className="flex items-center gap-[8px] ml-[7px]">
                <Image
                  src="/icons/star-icon.svg"
                  alt="Estrela"
                  width={30}
                  height={30}
                  className="object-contain"
                />
                <span className="text-[14px] font-semibold leading-[16px] bg-gradient-to-r from-[#FD4B19] to-[#BBB736] bg-clip-text text-transparent" style={{ fontFamily: 'Roboto Condensed' }}>
                  7 dias gratuitos de plano PRO
                </span>
              </div>
              <div className="ml-auto mr-[5px]">
                <span className="text-[12px] font-semibold leading-[14px] bg-gradient-to-r from-[#FD4B19] to-[#BBB736] bg-clip-text text-transparent" style={{ fontFamily: 'Roboto Condensed' }}>
                  6 VAGAS restantes
                </span>
              </div>
            </div>

            {/* Toggle Mensal/Anual */}
            <div className="mx-auto w-[263px] h-[49px] border border-[#D9D9D9] rounded-[40px] flex relative mt-[19px] mb-0">
              <div 
                onClick={() => setBillingPeriod('mensal')}
                className={`flex-1 h-[43px] rounded-[40px] flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  billingPeriod === 'mensal' 
                    ? 'bg-gradient-to-r from-[#FD4B19] to-[#BBB736]' 
                    : ''
                }`}
                style={{ margin: '3px 4px' }}
              >
                <span className={`text-[16px] font-semibold leading-[19px] ${
                  billingPeriod === 'mensal' ? 'text-white' : 'text-[#1E293B]'
                }`} style={{ fontFamily: 'Roboto Condensed' }}>
                  Mensal
                </span>
              </div>
              <div 
                onClick={() => setBillingPeriod('anual')}
                className={`flex-1 h-[43px] rounded-[40px] flex items-center justify-center cursor-pointer transition-all duration-200 ${
                  billingPeriod === 'anual' 
                    ? 'bg-gradient-to-r from-[#FD4B19] to-[#BBB736]' 
                    : ''
                }`}
                style={{ margin: '3px 4px' }}
              >
                <span className={`text-[16px] font-semibold leading-[19px] ${
                  billingPeriod === 'anual' ? 'text-white' : 'text-[#1E293B]'
                }`} style={{ fontFamily: 'Roboto Condensed' }}>
                  anual
                </span>
              </div>
            </div>

            {/* Plano PRO */}
            <div 
              onClick={() => setSelectedPlanType('pro')}
              className="mx-auto w-[343px] h-[78px] rounded-[15px] mb-0 mt-[19px] relative cursor-pointer transition-all duration-200"
              style={{ 
                background: '#FEFEFE',
                border: selectedPlanType === 'pro' ? '2px solid transparent' : '1px solid #D9D9D9',
                boxShadow: selectedPlanType === 'pro' ? '1px 1px 9px 0px rgba(230, 80, 44, 1)' : 'none'
              }}
            >
              <div className="absolute left-[14px] top-[11px] flex items-center gap-[16px]">
                <Image
                  src="/icons/pro-icon.svg"
                  alt="PRO"
                  width={40}
                  height={40}
                  className="object-contain"
                />
                <p className="text-[#1E293B] font-semibold text-[20px] leading-[27px]" style={{ fontFamily: 'Open Sans' }}>PRO</p>
              </div>
              <div className="absolute right-[16px] top-[11px] flex flex-col items-end">
                <div className="flex items-baseline gap-[4px]">
                  <span className="text-[rgba(100,116,139,0.4)] font-semibold text-[11px] leading-[15px] line-through" style={{ fontFamily: 'Roboto Slab' }}>147,90</span>
                  <p className="text-[#1E293B] font-semibold text-[16px] leading-[21px]" style={{ fontFamily: 'Roboto Slab' }}>R$ 19,99</p>
                </div>
                <p className="text-[#1E293B] font-semibold text-[11px] leading-[15px] mt-[9px]" style={{ fontFamily: 'Roboto Slab' }}>por mês</p>
              </div>
            </div>

            {/* Plano Viajante */}
            <div 
              onClick={() => setSelectedPlanType('viajante')}
              className="mx-auto w-[343px] h-[78px] rounded-[15px] mb-0 mt-[20px] relative cursor-pointer transition-all duration-200"
              style={{ 
                background: '#FEFEFE',
                border: selectedPlanType === 'viajante' ? '2px solid transparent' : '1px solid #D9D9D9',
                boxShadow: selectedPlanType === 'viajante' ? '1px 1px 9px 0px rgba(230, 80, 44, 1)' : 'none'
              }}
            >
              <div className="absolute left-[14px] top-[11px] flex items-center gap-[12px]">
                <div className="w-[40px] h-[40px] rounded-full border border-[#D9D9D9] flex items-center justify-center">
                  <div className="w-[20px] h-[20px] rounded-full border border-[#D9D9D9]"></div>
                </div>
                <p className="text-[#1E293B] font-semibold text-[20px] leading-[27px]" style={{ fontFamily: 'Open Sans' }}>Viajante</p>
              </div>
              <div className="absolute right-[16px] top-[11px] flex flex-col items-end">
                <div className="flex items-baseline gap-[4px]">
                  <span className="text-[rgba(100,116,139,0.4)] font-semibold text-[11px] leading-[15px] line-through" style={{ fontFamily: 'Roboto Slab' }}>230,90</span>
                  <p className="text-[#75738C] font-semibold text-[16px] leading-[21px]" style={{ fontFamily: 'Roboto Slab' }}>R$ 49,90</p>
                </div>
                <p className="text-[#75738C] font-semibold text-[11px] leading-[15px] mt-[9px]" style={{ fontFamily: 'Roboto Slab' }}>por mês</p>
              </div>
            </div>

            {/* Ícone e texto de garantia */}
            <div className="flex items-center justify-start mx-auto w-[346px] mt-[28px] mb-0 gap-[9px]">
              <Image
                src="/icons/certificate-icon.svg"
                alt="Certificado"
                width={24}
                height={24}
                className="object-contain ml-[30px]"
              />
              <p className="text-[#64748B] text-[13px] font-medium leading-[15px]" style={{ fontFamily: 'Roboto Condensed' }}>
                Sem compromisso, cancele a qualquer momento
              </p>
            </div>

            {/* Botão de Ação */}
            <div className="px-[12px] pb-[55px] pt-[10px]">
              <button
                onClick={handleSelectPlan}
                className="w-full h-[56px] rounded-[40px] flex items-center justify-center"
                style={{ 
                  background: 'linear-gradient(90deg, #FD4B19 0%, #BBB736 100%)',
                  boxShadow: '2px 2px 4px 0px rgba(0, 0, 0, 0.25)'
                }}
              >
                <span className="text-white font-medium text-[16px] leading-[19px]" style={{ fontFamily: 'Roboto Condensed' }}>
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

