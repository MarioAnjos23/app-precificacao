"use client"

import { useState, useEffect } from "react"
import { Check, Star, Users, TrendingUp, Shield, Zap, Clock, Heart, ArrowRight, X, Play, ChevronDown, Sparkles, Target, Award } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function PaginaVendas() {
  const router = useRouter()
  const [tema, setTema] = useState<"claro" | "escuro">("claro")
  const [mostrarVideo, setMostrarVideo] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [verificandoQuiz, setVerificandoQuiz] = useState(true)
  const [faqAberto, setFaqAberto] = useState<number | null>(null)

  useEffect(() => {
    // Verificar se o usuário já fez o quiz
    const quizFeito = localStorage.getItem("quiz-confeitaria")
    
    if (!quizFeito) {
      // Se não fez o quiz, redireciona para a página do quiz
      router.push("/quiz")
      return
    }

    // Se já fez o quiz, continua normalmente
    setVerificandoQuiz(false)

    const temaSalvo = localStorage.getItem("tema-confeitaria") as "claro" | "escuro" | null
    if (temaSalvo) {
      setTema(temaSalvo)
    }

    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [router])

  // Mostrar loading enquanto verifica o quiz
  if (verificandoQuiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 to-pink-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-semibold">Carregando...</p>
        </div>
      </div>
    )
  }

  const bgClass = tema === "claro" 
    ? "bg-white" 
    : "bg-gray-900"
  
  const textClass = tema === "claro" ? "text-gray-900" : "text-white"
  const textSecondaryClass = tema === "claro" ? "text-gray-600" : "text-gray-300"
  const cardClass = tema === "claro" ? "bg-white border border-gray-200" : "bg-gray-800 border border-gray-700"

  const depoimentos = [
    {
      nome: "Maria Silva",
      foto: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
      texto: "Aumentei meu lucro em 40% no primeiro mês! Finalmente sei quanto cobrar e não perco mais vendas.",
      estrelas: 5
    },
    {
      nome: "Ana Costa",
      foto: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      texto: "O controle de estoque me salvou de muito desperdício. Já economizei mais de R$ 800 em ingredientes!",
      estrelas: 5
    },
    {
      nome: "Juliana Mendes",
      foto: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop",
      texto: "Nunca mais esqueci um aniversário! Meus clientes adoram quando eu lembro deles. Fidelização garantida!",
      estrelas: 5
    }
  ]

  const beneficios = [
    {
      icone: <TrendingUp className="w-8 h-8" />,
      titulo: "Aumente seus Lucros",
      descricao: "Precifique corretamente e pare de perder dinheiro. Saiba exatamente quanto cobrar para ter lucro real.",
      cor: "from-green-400 to-emerald-500"
    },
    {
      icone: <Clock className="w-8 h-8" />,
      titulo: "Economize Tempo",
      descricao: "Organize pedidos, clientes e estoque em um só lugar. Menos tempo na gestão, mais tempo produzindo.",
      cor: "from-blue-400 to-indigo-500"
    },
    {
      icone: <Shield className="w-8 h-8" />,
      titulo: "Controle Total",
      descricao: "Saiba exatamente o que tem em estoque, quanto está ganhando e quais produtos vendem mais.",
      cor: "from-purple-400 to-pink-500"
    },
    {
      icone: <Heart className="w-8 h-8" />,
      titulo: "Fidelize Clientes",
      descricao: "Lembre aniversários automaticamente e surpreenda seus clientes. Eles vão te indicar!",
      cor: "from-pink-400 to-red-500"
    },
    {
      icone: <Zap className="w-8 h-8" />,
      titulo: "Automação Inteligente",
      descricao: "Notificações automáticas, integração com WhatsApp e lembretes de pedidos pendentes.",
      cor: "from-yellow-400 to-orange-500"
    },
    {
      icone: <Users className="w-8 h-8" />,
      titulo: "Gestão Profissional",
      descricao: "Relatórios completos, gráficos e análises para tomar decisões baseadas em dados reais.",
      cor: "from-cyan-400 to-blue-500"
    }
  ]

  const planos = [
    {
      nome: "Gratuito",
      preco: "R$ 0",
      periodo: "/mês",
      descricao: "Perfeito para começar",
      recursos: [
        "Calculadora de Precificação",
        "Até 50 clientes",
        "Controle básico de estoque",
        "Agenda de pedidos",
        "Suporte por email"
      ],
      destaque: false,
      cta: "Começar Grátis"
    },
    {
      nome: "Profissional",
      preco: "R$ 29,90",
      periodo: "/mês",
      descricao: "Mais vendido!",
      recursos: [
        "Tudo do plano Gratuito",
        "Clientes ilimitados",
        "Controle avançado de estoque",
        "Relatórios e gráficos completos",
        "Integração WhatsApp",
        "Notificações automáticas",
        "Backup na nuvem",
        "Personalização de marca",
        "Suporte prioritário"
      ],
      destaque: true,
      cta: "Assinar Agora"
    },
    {
      nome: "Premium",
      preco: "R$ 49,90",
      periodo: "/mês",
      descricao: "Para quem quer crescer",
      recursos: [
        "Tudo do plano Profissional",
        "Múltiplos usuários",
        "API para integração",
        "Catálogo online personalizado",
        "Sistema de pedidos online",
        "Consultoria mensal",
        "Suporte 24/7"
      ],
      destaque: false,
      cta: "Quero o Premium"
    }
  ]

  const faq = [
    {
      pergunta: "Como funciona o período de teste?",
      resposta: "Você pode usar o plano Gratuito por tempo ilimitado. Para testar os recursos premium, oferecemos 7 dias grátis sem compromisso."
    },
    {
      pergunta: "Preciso de conhecimento técnico?",
      resposta: "Não! O sistema foi desenvolvido para ser super intuitivo. Se você sabe usar WhatsApp, vai conseguir usar o Confeitaria Pro."
    },
    {
      pergunta: "Meus dados ficam seguros?",
      resposta: "Sim! Usamos criptografia de ponta e backup automático na nuvem. Seus dados estão 100% protegidos."
    },
    {
      pergunta: "Posso cancelar quando quiser?",
      resposta: "Claro! Não há fidelidade. Você pode cancelar a qualquer momento e continuar usando até o fim do período pago."
    },
    {
      pergunta: "Funciona no celular?",
      resposta: "Sim! O sistema é totalmente responsivo e funciona perfeitamente em celular, tablet e computador."
    }
  ]

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      {/* Hero Section com Parallax */}
      <section 
        className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12 sm:py-20"
        style={{
          background: tema === "claro" 
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)"
            : "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
        }}
      >
        {/* Elementos decorativos animados */}
        <div className="absolute inset-0 overflow-hidden">
          <div 
            className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl -top-32 -left-32 sm:-top-48 sm:-left-48"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          />
          <div 
            className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-pink-500/10 rounded-full blur-3xl -bottom-32 -right-32 sm:-bottom-48 sm:-right-48"
            style={{ transform: `translateY(${-scrollY * 0.3}px)` }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full text-center">
          <div className="inline-block mb-4 sm:mb-6 px-4 sm:px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full">
            <p className="text-white text-sm sm:text-base font-semibold flex items-center justify-center gap-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs sm:text-base">Mais de 5.000 confeiteiras já transformaram seus negócios</span>
            </p>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
            Pare de Perder Dinheiro<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
              Comece a Lucrar de Verdade
            </span>
          </h1>

          <p className="text-base sm:text-xl md:text-2xl text-white/90 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
            O sistema completo que transforma confeiteiras em empresárias de sucesso. 
            Controle total do seu negócio em um só lugar.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
            <a href="#planos" className="w-full sm:w-auto">
              <button className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white text-purple-600 rounded-full font-bold text-base sm:text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2">
                Começar Grátis Agora
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </a>
            <button 
              onClick={() => setMostrarVideo(true)}
              className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-white/10 backdrop-blur-sm text-white rounded-full font-bold text-base sm:text-lg border-2 border-white/30 hover:bg-white/20 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Play className="w-4 h-4 sm:w-5 sm:h-5" />
              Ver Como Funciona
            </button>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-8 text-white text-sm sm:text-base px-4">
            <div className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" />
              <span>7 dias grátis</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0" />
              <span>Cancele quando quiser</span>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 sm:w-8 sm:h-8 text-white/60" />
          </div>
        </div>
      </section>

      {/* Modal de Vídeo */}
      {mostrarVideo && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setMostrarVideo(false)}>
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setMostrarVideo(false)}
              className="absolute -top-12 right-0 z-10 bg-white/10 backdrop-blur-sm p-3 rounded-full hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
            
            {/* Player de Vídeo Profissional */}
            <div className="relative bg-gradient-to-br from-purple-900 to-pink-900 rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-gray-900 flex flex-col items-center justify-center p-4 sm:p-8">
                {/* Ícone de Play Grande */}
                <div className="w-16 h-16 sm:w-24 sm:h-24 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 sm:mb-6 group-hover:bg-white/20 transition-all">
                  <Play className="w-8 h-8 sm:w-12 sm:h-12 text-white fill-white" />
                </div>
                
                {/* Texto Placeholder */}
                <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-3 text-center px-2">
                  Vídeo Demonstrativo do Confeitaria Pro
                </h3>
                <p className="text-sm sm:text-base text-white/80 text-center max-w-md mb-4 sm:mb-6 px-4">
                  Veja como o sistema funciona na prática e como ele pode transformar seu negócio
                </p>
                
                {/* Instruções para adicionar vídeo */}
                <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 sm:p-6 max-w-lg w-full mx-4">
                  <p className="text-white/60 text-xs sm:text-sm text-center mb-3">
                    📹 Para adicionar seu vídeo aqui:
                  </p>
                  <ol className="text-white/70 text-xs sm:text-sm space-y-2 text-left">
                    <li>1. Faça upload no YouTube ou Vimeo</li>
                    <li>2. Copie o link de incorporação (embed)</li>
                    <li>3. Substitua o conteúdo desta div por um iframe</li>
                  </ol>
                  <div className="mt-4 p-3 bg-black/30 rounded-lg overflow-x-auto">
                    <code className="text-xs text-green-400 break-all whitespace-pre-wrap">
                      {`<iframe src="URL_DO_VIDEO" />`}
                    </code>
                  </div>
                </div>
              </div>
              
              {/* Barra inferior decorativa */}
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm sm:text-base">Confeitaria Pro - Demo</p>
                    <p className="text-white/70 text-xs sm:text-sm">Veja todas as funcionalidades</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-white/80 text-xs sm:text-sm">
                  <Users className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span>5.000+ usuárias</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🎬 SEÇÃO DE VÍDEO DEMONSTRATIVO COM COPY PERSUASIVA */}
      <section className={`py-12 sm:py-24 relative overflow-hidden ${tema === "claro" ? "bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50" : "bg-gradient-to-br from-gray-900 via-purple-900/20 to-pink-900/20"}`}>
        {/* Elementos decorativos de fundo */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-48 h-48 sm:w-72 sm:h-72 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-64 h-64 sm:w-96 sm:h-96 bg-pink-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 relative z-10">
          {/* Badge de destaque */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold shadow-xl animate-pulse text-sm sm:text-base">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Vídeo Exclusivo</span>
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          </div>

          {/* Headline persuasiva */}
          <div className="text-center mb-4 sm:mb-6">
            <h2 className={`text-2xl sm:text-4xl md:text-6xl font-black ${textClass} mb-3 sm:mb-4 leading-tight px-2`}>
              Veja Como <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Triplicar Seus Lucros</span><br />
              Em Apenas 3 Minutos
            </h2>
            <p className={`text-base sm:text-xl md:text-2xl ${textSecondaryClass} max-w-4xl mx-auto font-medium px-4`}>
              Descubra o sistema secreto que <span className="font-bold text-purple-600">5.000+ confeiteiras</span> estão usando para 
              <span className="font-bold text-pink-600"> ganhar até R$ 15.000/mês</span> trabalhando menos
            </p>
          </div>

          {/* Bullets de benefícios rápidos */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12 px-4">
            <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 ${cardClass} rounded-full shadow-lg text-xs sm:text-base`}>
              <Target className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
              <span className={`font-semibold ${textClass}`}>Precificação Perfeita</span>
            </div>
            <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 ${cardClass} rounded-full shadow-lg text-xs sm:text-base`}>
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 flex-shrink-0" />
              <span className={`font-semibold ${textClass}`}>+40% de Lucro</span>
            </div>
            <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 ${cardClass} rounded-full shadow-lg text-xs sm:text-base`}>
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 flex-shrink-0" />
              <span className={`font-semibold ${textClass}`}>Economize 10h/semana</span>
            </div>
            <div className={`flex items-center gap-2 px-3 sm:px-4 py-2 ${cardClass} rounded-full shadow-lg text-xs sm:text-base`}>
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
              <span className={`font-semibold ${textClass}`}>Gestão Profissional</span>
            </div>
          </div>

          {/* Container do vídeo com design premium */}
          <div className="max-w-6xl mx-auto">
            <div className={`${cardClass} rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:scale-[1.02]`}>
              {/* Player de vídeo */}
              <div className="relative aspect-video bg-gradient-to-br from-purple-900 via-pink-900 to-orange-900">
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-8 bg-black/50 backdrop-blur-sm">
                  {/* Botão Play gigante e atrativo */}
                  <button 
                    onClick={() => setMostrarVideo(true)}
                    className="group relative mb-6 sm:mb-8 transform transition-all duration-300 hover:scale-110"
                  >
                    {/* Efeito de pulso */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-2xl opacity-60 group-hover:opacity-100 animate-pulse" />
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-40 group-hover:opacity-80 animate-ping" />
                    
                    {/* Botão principal */}
                    <div className="relative w-20 h-20 sm:w-32 sm:h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
                      <Play className="w-10 h-10 sm:w-16 sm:h-16 text-purple-600 fill-purple-600 ml-1 sm:ml-2" />
                    </div>
                  </button>

                  {/* Copy persuasiva dentro do player */}
                  <div className="text-center max-w-3xl">
                    <h3 className="text-xl sm:text-3xl md:text-4xl font-black text-white mb-3 sm:mb-4 drop-shadow-lg px-2">
                      🎯 Assista Agora e Descubra:
                    </h3>
                    
                    <div className="space-y-2 sm:space-y-3 text-left max-w-2xl mx-auto">
                      <div className="flex items-start gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                        <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0 mt-0.5 sm:mt-1" />
                        <p className="text-white text-sm sm:text-lg font-medium">
                          Como <span className="text-yellow-300 font-bold">calcular o preço perfeito</span> e nunca mais ter prejuízo
                        </p>
                      </div>
                      <div className="flex items-start gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                        <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0 mt-0.5 sm:mt-1" />
                        <p className="text-white text-sm sm:text-lg font-medium">
                          O segredo para <span className="text-yellow-300 font-bold">fidelizar clientes</span> e ter vendas recorrentes
                        </p>
                      </div>
                      <div className="flex items-start gap-2 sm:gap-3 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl p-3 sm:p-4 border border-white/20">
                        <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 flex-shrink-0 mt-0.5 sm:mt-1" />
                        <p className="text-white text-sm sm:text-lg font-medium">
                          Como <span className="text-yellow-300 font-bold">economizar R$ 800+/mês</span> eliminando desperdícios
                        </p>
                      </div>
                    </div>

                    {/* Urgência e escassez */}
                    <div className="mt-6 sm:mt-8 inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 bg-red-500/90 backdrop-blur-sm rounded-full border-2 border-red-300 animate-pulse">
                      <span className="text-white font-bold text-xs sm:text-lg">⚡ Apenas hoje: Bônus exclusivo no final do vídeo!</span>
                    </div>
                  </div>

                  {/* Thumbnail de fundo sutil */}
                  <div className="absolute inset-0 -z-10 opacity-20">
                    <Image
                      src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&h=800&fit=crop"
                      alt="Confeitaria profissional"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Barra inferior com prova social e estatísticas */}
              <div className={`p-4 sm:p-6 ${tema === "claro" ? "bg-gradient-to-r from-purple-100 via-pink-100 to-orange-100" : "bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-orange-900/50"}`}>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center">
                  <div className="space-y-1">
                    <div className="flex items-center justify-center gap-0.5 sm:gap-1 mb-1">
                      <Star className="w-3 h-3 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                      <Star className="w-3 h-3 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                      <Star className="w-3 h-3 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                      <Star className="w-3 h-3 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                      <Star className="w-3 h-3 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className={`text-xl sm:text-3xl font-black ${textClass}`}>4.9/5.0</div>
                    <div className={`text-xs sm:text-sm ${textSecondaryClass} font-medium`}>1.247 Avaliações</div>
                  </div>
                  <div className="space-y-1">
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-purple-500 mx-auto mb-1" />
                    <div className={`text-xl sm:text-3xl font-black ${textClass}`}>5.000+</div>
                    <div className={`text-xs sm:text-sm ${textSecondaryClass} font-medium`}>Usuárias Ativas</div>
                  </div>
                  <div className="space-y-1">
                    <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-500 mx-auto mb-1" />
                    <div className={`text-xl sm:text-3xl font-black ${textClass}`}>+40%</div>
                    <div className={`text-xs sm:text-sm ${textSecondaryClass} font-medium`}>Aumento de Lucro</div>
                  </div>
                  <div className="space-y-1">
                    <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 mx-auto mb-1" />
                    <div className={`text-xl sm:text-3xl font-black ${textClass}`}>100%</div>
                    <div className={`text-xs sm:text-sm ${textSecondaryClass} font-medium`}>Seguro e Confiável</div>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA poderoso abaixo do vídeo */}
            <div className="text-center mt-8 sm:mt-12">
              <div className={`inline-block ${cardClass} rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl max-w-2xl w-full mx-4`}>
                <h3 className={`text-xl sm:text-2xl md:text-3xl font-bold ${textClass} mb-3 sm:mb-4`}>
                  🚀 Pronta Para Transformar Seu Negócio?
                </h3>
                <p className={`${textSecondaryClass} text-sm sm:text-lg mb-4 sm:mb-6`}>
                  Junte-se a <span className="font-bold text-purple-600">5.000+ confeiteiras</span> que já estão 
                  lucrando mais e trabalhando menos com o Confeitaria Pro
                </p>
                
                {/* Botão CTA principal */}
                <a href="#planos">
                  <button className="group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-full font-black text-lg sm:text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 sm:gap-3 mx-auto mb-3 sm:mb-4">
                    <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
                    Começar Grátis Agora
                    <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
                  </button>
                </a>

                {/* Garantias e benefícios */}
                <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
                  <div className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                    <span className={textSecondaryClass}>✨ Sem cartão de crédito</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                    <span className={textSecondaryClass}>🎁 7 dias grátis</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                    <span className={textSecondaryClass}>🔓 Cancele quando quiser</span>
                  </div>
                </div>

                {/* Urgência final */}
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl border-2 border-yellow-400">
                  <p className="text-xs sm:text-sm font-bold text-yellow-800 dark:text-yellow-300">
                    ⚡ ATENÇÃO: Mais de 200 confeiteiras se cadastraram nas últimas 24h. 
                    Garanta sua vaga agora!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Problemas (Dor) */}
      <section className={`py-12 sm:py-20 ${tema === "claro" ? "bg-gray-50" : "bg-gray-800"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${textClass} text-center mb-8 sm:mb-12`}>
            Você se identifica com isso?
          </h2>

          <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
            <div className={`${cardClass} rounded-2xl p-6 sm:p-8 shadow-xl`}>
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">😰</div>
              <h3 className={`text-lg sm:text-xl font-bold ${textClass} mb-2 sm:mb-3`}>
                Não sabe quanto cobrar?
              </h3>
              <p className={`${textSecondaryClass} text-sm sm:text-base`}>
                Você calcula "no olho" e no fim do mês percebe que trabalhou muito mas o lucro foi pouco. 
                Às vezes até teve prejuízo sem perceber.
              </p>
            </div>

            <div className={`${cardClass} rounded-2xl p-6 sm:p-8 shadow-xl`}>
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">😓</div>
              <h3 className={`text-lg sm:text-xl font-bold ${textClass} mb-2 sm:mb-3`}>
                Perde vendas por desorganização?
              </h3>
              <p className={`${textSecondaryClass} text-sm sm:text-base`}>
                Esquece aniversários de clientes, perde prazos de entrega e não sabe o que tem em estoque. 
                Resultado: clientes insatisfeitos e vendas perdidas.
              </p>
            </div>

            <div className={`${cardClass} rounded-2xl p-6 sm:p-8 shadow-xl`}>
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">😤</div>
              <h3 className={`text-lg sm:text-xl font-bold ${textClass} mb-2 sm:mb-3`}>
                Desperdício de ingredientes?
              </h3>
              <p className={`${textSecondaryClass} text-sm sm:text-base`}>
                Compra ingredientes que já tinha, deixa produtos vencerem e não sabe quanto gastou no mês. 
                Seu dinheiro literalmente vai pro lixo.
              </p>
            </div>

            <div className={`${cardClass} rounded-2xl p-6 sm:p-8 shadow-xl`}>
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">😔</div>
              <h3 className={`text-lg sm:text-xl font-bold ${textClass} mb-2 sm:mb-3`}>
                Trabalha muito e ganha pouco?
              </h3>
              <p className={`${textSecondaryClass} text-sm sm:text-base`}>
                Passa horas na cozinha, atende clientes o dia todo, mas no fim do mês o lucro não compensa. 
                Você merece ganhar mais pelo seu trabalho!
              </p>
            </div>
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <p className={`text-xl sm:text-2xl font-bold ${textClass} mb-4`}>
              A boa notícia é que isso tem solução! 👇
            </p>
          </div>
        </div>
      </section>

      {/* Seção de Benefícios */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${textClass} text-center mb-4 sm:mb-6`}>
            Transforme seu Negócio em 30 Dias
          </h2>
          <p className={`text-base sm:text-xl ${textSecondaryClass} text-center mb-12 sm:mb-16 max-w-3xl mx-auto`}>
            Mais de 5.000 confeiteiras já aumentaram seus lucros em até 40% usando o Confeitaria Pro
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {beneficios.map((beneficio, index) => (
              <div 
                key={index}
                className={`${cardClass} rounded-2xl p-6 sm:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105`}
              >
                <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${beneficio.cor} rounded-2xl flex items-center justify-center text-white mb-4 sm:mb-6`}>
                  {beneficio.icone}
                </div>
                <h3 className={`text-xl sm:text-2xl font-bold ${textClass} mb-3 sm:mb-4`}>
                  {beneficio.titulo}
                </h3>
                <p className={`${textSecondaryClass} text-sm sm:text-base`}>
                  {beneficio.descricao}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção de Funcionalidades Detalhadas */}
      <section className={`py-12 sm:py-20 ${tema === "claro" ? "bg-gray-50" : "bg-gray-800"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${textClass} text-center mb-12 sm:mb-16`}>
            Tudo que você precisa em um só lugar
          </h2>

          <div className="space-y-12 sm:space-y-16">
            {/* Funcionalidade 1 - Calculadora */}
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <div className="inline-block px-3 sm:px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full font-semibold mb-3 sm:mb-4 text-xs sm:text-base">
                  Calculadora Inteligente
                </div>
                <h3 className={`text-2xl sm:text-3xl font-bold ${textClass} mb-3 sm:mb-4`}>
                  Nunca mais tenha prejuízo
                </h3>
                <p className={`${textSecondaryClass} text-base sm:text-lg mb-4 sm:mb-6`}>
                  Nossa calculadora considera TODOS os custos: ingredientes, energia, gás, embalagem, 
                  seu tempo de trabalho e ainda calcula a margem de lucro ideal. Você vai saber 
                  exatamente quanto cobrar para ter lucro real.
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5 sm:mt-1" />
                    <span className={`${textSecondaryClass} text-sm sm:text-base`}>Cálculo automático de todos os custos</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5 sm:mt-1" />
                    <span className={`${textSecondaryClass} text-sm sm:text-base`}>Sugestão de preço baseada no mercado</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5 sm:mt-1" />
                    <span className={`${textSecondaryClass} text-sm sm:text-base`}>Salve suas receitas favoritas</span>
                  </li>
                </ul>
              </div>
              <div className={`${cardClass} rounded-2xl p-3 sm:p-4 shadow-2xl overflow-hidden`}>
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=800&h=600&fit=crop"
                    alt="Calculadora com bolo de confeitaria"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Funcionalidade 2 - Gestão de Clientes */}
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className={`${cardClass} rounded-2xl p-3 sm:p-4 shadow-2xl overflow-hidden`}>
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop"
                      alt="Gestão de clientes para confeitaria"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="inline-block px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-semibold mb-3 sm:mb-4 text-xs sm:text-base">
                  Fidelização Automática
                </div>
                <h3 className={`text-2xl sm:text-3xl font-bold ${textClass} mb-3 sm:mb-4`}>
                  Clientes que voltam sempre
                </h3>
                <p className={`${textSecondaryClass} text-base sm:text-lg mb-4 sm:mb-6`}>
                  Cadastre seus clientes com aniversários deles e dos familiares. O sistema te avisa 
                  automaticamente quando está chegando uma data importante. Seus clientes vão amar 
                  ser lembrados e você vai vender muito mais!
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5 sm:mt-1" />
                    <span className={`${textSecondaryClass} text-sm sm:text-base`}>Alertas automáticos de aniversários</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5 sm:mt-1" />
                    <span className={`${textSecondaryClass} text-sm sm:text-base`}>Histórico completo de pedidos</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5 sm:mt-1" />
                    <span className={`${textSecondaryClass} text-sm sm:text-base`}>Integração com WhatsApp</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Funcionalidade 3 - Controle de Estoque */}
            <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div>
                <div className="inline-block px-3 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full font-semibold mb-3 sm:mb-4 text-xs sm:text-base">
                  Controle Total
                </div>
                <h3 className={`text-2xl sm:text-3xl font-bold ${textClass} mb-3 sm:mb-4`}>
                  Pare de desperdiçar dinheiro
                </h3>
                <p className={`${textSecondaryClass} text-base sm:text-lg mb-4 sm:mb-6`}>
                  Controle seu estoque de forma profissional. Saiba exatamente o que tem, o que está 
                  acabando e o que vai vencer. Evite compras duplicadas e desperdício de ingredientes. 
                  Economize até R$ 800 por mês!
                </p>
                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5 sm:mt-1" />
                    <span className={`${textSecondaryClass} text-sm sm:text-base`}>Alertas de estoque mínimo</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5 sm:mt-1" />
                    <span className={`${textSecondaryClass} text-sm sm:text-base`}>Controle de validade</span>
                  </li>
                  <li className="flex items-start gap-2 sm:gap-3">
                    <Check className="w-5 h-5 sm:w-6 sm:h-6 text-green-500 flex-shrink-0 mt-0.5 sm:mt-1" />
                    <span className={`${textSecondaryClass} text-sm sm:text-base`}>Relatório de consumo</span>
                  </li>
                </ul>
              </div>
              <div className={`${cardClass} rounded-2xl p-3 sm:p-4 shadow-2xl overflow-hidden`}>
                <div className="relative aspect-video rounded-xl overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&h=600&fit=crop"
                    alt="Estoque real de confeitaria com ingredientes organizados"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Depoimentos */}
      <section className="py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${textClass} text-center mb-4 sm:mb-6`}>
            O que dizem nossas clientes
          </h2>
          <p className={`text-base sm:text-xl ${textSecondaryClass} text-center mb-12 sm:mb-16`}>
            Mais de 5.000 confeiteiras já transformaram seus negócios
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {depoimentos.map((depoimento, index) => (
              <div key={index} className={`${cardClass} rounded-2xl p-6 sm:p-8 shadow-xl`}>
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={depoimento.foto}
                      alt={depoimento.nome}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className={`font-bold ${textClass} text-sm sm:text-base`}>{depoimento.nome}</p>
                    <div className="flex gap-0.5 sm:gap-1">
                      {[...Array(depoimento.estrelas)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className={`${textSecondaryClass} text-sm sm:text-base`}>"{depoimento.texto}"</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <div className={`inline-flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-3 ${tema === "claro" ? "bg-yellow-100" : "bg-yellow-900/20"} rounded-full`}>
              <Star className="w-4 h-4 sm:w-5 sm:h-5 fill-yellow-400 text-yellow-400" />
              <span className={`font-bold ${textClass} text-sm sm:text-base`}>4.9/5.0</span>
              <span className={`${textSecondaryClass} text-xs sm:text-base`}>baseado em 1.247 avaliações</span>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Preços */}
      <section id="planos" className={`py-12 sm:py-20 ${tema === "claro" ? "bg-gray-50" : "bg-gray-800"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${textClass} text-center mb-4 sm:mb-6`}>
            Escolha o plano ideal para você
          </h2>
          <p className={`text-base sm:text-xl ${textSecondaryClass} text-center mb-12 sm:mb-16`}>
            Comece grátis e evolua quando quiser. Sem pegadinhas.
          </p>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {planos.map((plano, index) => (
              <div 
                key={index}
                className={`${cardClass} rounded-2xl p-6 sm:p-8 shadow-xl ${ 
                  plano.destaque 
                    ? "ring-4 ring-purple-500 md:scale-105 relative" 
                    : ""
                }`}
              >
                {plano.destaque && (
                  <div className="absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2 px-4 sm:px-6 py-1.5 sm:py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full font-bold text-xs sm:text-sm">
                    Mais Popular
                  </div>
                )}

                <h3 className={`text-xl sm:text-2xl font-bold ${textClass} mb-2`}>
                  {plano.nome}
                </h3>
                <p className={`${textSecondaryClass} mb-4 sm:mb-6 text-sm sm:text-base`}>
                  {plano.descricao}
                </p>

                <div className="mb-4 sm:mb-6">
                  <span className={`text-4xl sm:text-5xl font-bold ${textClass}`}>
                    {plano.preco}
                  </span>
                  <span className={`${textSecondaryClass} text-sm sm:text-base`}>
                    {plano.periodo}
                  </span>
                </div>

                <Link href="/checkout">
                  <button 
                    className={`w-full py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 mb-4 sm:mb-6 ${ 
                      plano.destaque
                        ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-2xl hover:scale-105"
                        : `${tema === "claro" ? "bg-gray-900 text-white" : "bg-white text-gray-900"} hover:scale-105`
                    }`}
                  >
                    {plano.cta}
                  </button>
                </Link>

                <ul className="space-y-2 sm:space-y-3">
                  {plano.recursos.map((recurso, i) => (
                    <li key={i} className="flex items-start gap-2 sm:gap-3">
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className={`${textSecondaryClass} text-xs sm:text-base`}>{recurso}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12 space-y-2 sm:space-y-4">
            <p className={`${textSecondaryClass} text-sm sm:text-base`}>
              💳 Aceitamos todas as formas de pagamento
            </p>
            <p className={`${textSecondaryClass} text-sm sm:text-base`}>
              🔒 Pagamento 100% seguro e criptografado
            </p>
          </div>
        </div>
      </section>

      {/* Seção de FAQ */}
      <section className="py-12 sm:py-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className={`text-3xl sm:text-4xl md:text-5xl font-bold ${textClass} text-center mb-12 sm:mb-16`}>
            Perguntas Frequentes
          </h2>

          <div className="space-y-3 sm:space-y-4">
            {faq.map((item, index) => (
              <div key={index} className={`${cardClass} rounded-2xl shadow-lg overflow-hidden`}>
                <button
                  onClick={() => setFaqAberto(faqAberto === index ? null : index)}
                  className="w-full p-4 sm:p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <span className={`font-bold ${textClass} text-base sm:text-lg pr-4`}>
                    {item.pergunta}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${textClass} transition-transform flex-shrink-0 ${ 
                      faqAberto === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {faqAberto === index && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6">
                    <p className={`${textSecondaryClass} text-sm sm:text-base`}>
                      {item.resposta}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section 
        className="py-12 sm:py-20 relative overflow-hidden"
        style={{
          background: tema === "claro" 
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
            : "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
        }}
      >
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-6">
            Pronta para transformar seu negócio?
          </h2>
          <p className="text-base sm:text-xl text-white/90 mb-6 sm:mb-8">
            Junte-se a mais de 5.000 confeiteiras que já aumentaram seus lucros em até 40%
          </p>

          <a href="#planos">
            <button className="group px-8 sm:px-12 py-4 sm:py-5 bg-white text-purple-600 rounded-full font-bold text-lg sm:text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center gap-2 sm:gap-3 mx-auto">
              Começar Grátis Agora
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </a>

          <p className="text-white/80 mt-4 sm:mt-6 text-sm sm:text-base">
            ✨ Sem cartão de crédito • 7 dias grátis • Cancele quando quiser
          </p>
        </div>

        {/* Elementos decorativos */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-white/5 rounded-full blur-3xl -top-32 -left-32 sm:-top-48 sm:-left-48" />
          <div className="absolute w-64 h-64 sm:w-96 sm:h-96 bg-pink-500/5 rounded-full blur-3xl -bottom-32 -right-32 sm:-bottom-48 sm:-right-48" />
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-8 sm:py-12 ${tema === "claro" ? "bg-gray-900" : "bg-black"}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-white font-bold text-lg sm:text-xl mb-3 sm:mb-4">Confeitaria Pro</h3>
              <p className="text-gray-400 text-xs sm:text-sm">
                O sistema completo de gestão para confeiteiras profissionais.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Produto</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
                <li><Link href="/funcionalidades" className="hover:text-white transition-colors">Funcionalidades</Link></li>
                <li><Link href="/precos" className="hover:text-white transition-colors">Preços</Link></li>
                <li><Link href="/depoimentos" className="hover:text-white transition-colors">Depoimentos</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Suporte</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
                <li><Link href="/ajuda" className="hover:text-white transition-colors">Central de Ajuda</Link></li>
                <li><Link href="/contato" className="hover:text-white transition-colors">Contato</Link></li>
                <li><Link href="/tutoriais" className="hover:text-white transition-colors">Tutoriais</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h4>
              <ul className="space-y-1.5 sm:space-y-2 text-gray-400 text-xs sm:text-sm">
                <li><Link href="/termos" className="hover:text-white transition-colors">Termos de Uso</Link></li>
                <li><Link href="/privacidade" className="hover:text-white transition-colors">Privacidade</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2024 Confeitaria Pro. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
