"use client"

import { useState, useEffect } from "react"
import { ArrowRight, ArrowLeft, Play, Heart, TrendingUp, Users, Sparkles, Check, X, Target, Zap, Award } from "lucide-react"
import Link from "next/link"

interface RespostasQuiz {
  nivel: string
  motivacao: string
  desafios: string[]
  tempo: string
  faturamento: string
  objetivos: string[]
  investimento: string
}

export default function QuizPage() {
  const [etapa, setEtapa] = useState<"boas-vindas" | "quiz" | "resultado">("boas-vindas")
  const [perguntaAtual, setPerguntaAtual] = useState(0)
  const [respostas, setRespostas] = useState<RespostasQuiz>({
    nivel: "",
    motivacao: "",
    desafios: [],
    tempo: "",
    faturamento: "",
    objetivos: [],
    investimento: ""
  })
  const [mostrarVideo, setMostrarVideo] = useState(false)
  const [tema, setTema] = useState<"claro" | "escuro">("claro")
  const [perguntasDinamicas, setPerguntasDinamicas] = useState<any[]>([])

  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema-confeitaria") as "claro" | "escuro" | null
    if (temaSalvo) {
      setTema(temaSalvo)
    }
  }, [])

  const bgClass = tema === "claro" ? "bg-white" : "bg-gray-900"
  const textClass = tema === "claro" ? "text-gray-900" : "text-white"
  const textSecondaryClass = tema === "claro" ? "text-gray-600" : "text-gray-300"
  const cardClass = tema === "claro" ? "bg-white border border-gray-200" : "bg-gray-800 border border-gray-700"

  // Sistema de perguntas adaptativas
  const gerarPerguntasDinamicas = () => {
    const perguntas: any[] = []

    // Pergunta 1: Nível (sempre aparece)
    perguntas.push({
      id: "nivel",
      titulo: "Qual é o seu momento atual na confeitaria?",
      subtitulo: "Seja sincera, queremos te ajudar da melhor forma possível",
      tipo: "unica",
      opcoes: [
        { 
          valor: "sonhando", 
          emoji: "💭", 
          texto: "Ainda estou sonhando", 
          descricao: "Tenho vontade mas ainda não comecei" 
        },
        { 
          valor: "comecando", 
          emoji: "🌱", 
          texto: "Estou começando agora", 
          descricao: "Fiz minhas primeiras vendas recentemente" 
        },
        { 
          valor: "hobby", 
          emoji: "🎨", 
          texto: "Faço por hobby", 
          descricao: "Faço para família, amigos e vendo ocasionalmente" 
        },
        { 
          valor: "vendendo", 
          emoji: "💼", 
          texto: "Já vendo regularmente", 
          descricao: "Tenho clientes fixos mas ainda informal" 
        },
        { 
          valor: "profissional", 
          emoji: "👩‍🍳", 
          texto: "Sou profissional", 
          descricao: "Tenho CNPJ e vivo da confeitaria" 
        }
      ]
    })

    return perguntas
  }

  const adicionarProximaPergunta = () => {
    const { nivel, motivacao, desafios, tempo, faturamento, objetivos } = respostas
    const novasPerguntas = [...perguntasDinamicas]

    // Pergunta 2: Motivação (adaptada ao nível)
    if (perguntaAtual === 0 && nivel) {
      if (nivel === "sonhando" || nivel === "comecando") {
        novasPerguntas.push({
          id: "motivacao",
          titulo: "O que te motiva a começar na confeitaria?",
          subtitulo: "Queremos entender seu coração ❤️",
          tipo: "unica",
          opcoes: [
            { 
              valor: "renda-extra", 
              emoji: "💰", 
              texto: "Preciso de uma renda extra", 
              descricao: "Quero complementar o orçamento familiar" 
            },
            { 
              valor: "desemprego", 
              emoji: "🆘", 
              texto: "Estou desempregada", 
              descricao: "Preciso urgente de uma fonte de renda" 
            },
            { 
              valor: "paixao", 
              emoji: "❤️", 
              texto: "É minha paixão", 
              descricao: "Sempre amei fazer doces e bolos" 
            },
            { 
              valor: "independencia", 
              emoji: "🦋", 
              texto: "Quero ser independente", 
              descricao: "Sonho em ter meu próprio negócio" 
            }
          ]
        })
      } else if (nivel === "hobby") {
        novasPerguntas.push({
          id: "motivacao",
          titulo: "Por que você quer profissionalizar seu hobby?",
          subtitulo: "O que te fez pensar em transformar isso em negócio?",
          tipo: "unica",
          opcoes: [
            { 
              valor: "elogios", 
              emoji: "⭐", 
              texto: "Todo mundo elogia meus doces", 
              descricao: "Sempre dizem que eu deveria vender" 
            },
            { 
              valor: "renda", 
              emoji: "💵", 
              texto: "Quero transformar em renda", 
              descricao: "Já faço, por que não ganhar dinheiro?" 
            },
            { 
              valor: "realizacao", 
              emoji: "✨", 
              texto: "Quero me realizar", 
              descricao: "Fazer o que amo e ainda ganhar por isso" 
            },
            { 
              valor: "crescer", 
              emoji: "📈", 
              texto: "Quero crescer", 
              descricao: "Sinto que posso fazer muito mais" 
            }
          ]
        })
      } else {
        novasPerguntas.push({
          id: "motivacao",
          titulo: "O que te motiva a continuar crescendo?",
          subtitulo: "Você já conquistou muito, o que te move agora?",
          tipo: "unica",
          opcoes: [
            { 
              valor: "escalar", 
              emoji: "🚀", 
              texto: "Quero escalar meu negócio", 
              descricao: "Vender mais e ganhar mais" 
            },
            { 
              valor: "organizar", 
              emoji: "📊", 
              texto: "Preciso me organizar melhor", 
              descricao: "Está crescendo mas está caótico" 
            },
            { 
              valor: "profissionalizar", 
              emoji: "💼", 
              texto: "Quero profissionalizar", 
              descricao: "Ter processos e controles melhores" 
            },
            { 
              valor: "liberdade", 
              emoji: "🌴", 
              texto: "Quero mais liberdade", 
              descricao: "Ganhar bem e ter tempo para mim" 
            }
          ]
        })
      }
    }

    // Pergunta 3: Desafios (adaptada ao nível e motivação)
    if (perguntaAtual === 1 && motivacao) {
      if (nivel === "sonhando" || nivel === "comecando") {
        novasPerguntas.push({
          id: "desafios",
          titulo: "Quais são seus maiores medos ou dúvidas?",
          subtitulo: "Pode escolher mais de uma opção - queremos te ajudar",
          tipo: "multipla",
          opcoes: [
            { valor: "nao-sei-comecar", emoji: "❓", texto: "Não sei por onde começar" },
            { valor: "medo-fracasso", emoji: "😰", texto: "Medo de não dar certo" },
            { valor: "sem-clientes", emoji: "👥", texto: "Medo de não conseguir clientes" },
            { valor: "precificacao", emoji: "💵", texto: "Não sei quanto cobrar" },
            { valor: "investimento", emoji: "💰", texto: "Não tenho dinheiro para investir" },
            { valor: "tempo", emoji: "⏰", texto: "Não tenho tempo" }
          ]
        })
      } else if (nivel === "hobby") {
        novasPerguntas.push({
          id: "desafios",
          titulo: "O que te impede de vender mais?",
          subtitulo: "Seja sincera - queremos resolver isso juntas",
          tipo: "multipla",
          opcoes: [
            { valor: "divulgacao", emoji: "📢", texto: "Não sei como divulgar" },
            { valor: "precificacao", emoji: "💵", texto: "Não sei quanto cobrar" },
            { valor: "organizacao", emoji: "📅", texto: "Falta organização" },
            { valor: "medo", emoji: "😰", texto: "Medo de assumir compromisso" },
            { valor: "tempo", emoji: "⏰", texto: "Falta de tempo" },
            { valor: "confianca", emoji: "💪", texto: "Falta de confiança" }
          ]
        })
      } else {
        novasPerguntas.push({
          id: "desafios",
          titulo: "Quais são seus maiores desafios hoje?",
          subtitulo: "Vamos resolver isso juntas",
          tipo: "multipla",
          opcoes: [
            { valor: "organizacao", emoji: "📅", texto: "Desorganização com pedidos" },
            { valor: "precificacao", emoji: "💵", texto: "Precificação incorreta" },
            { valor: "estoque", emoji: "📦", texto: "Controle de estoque" },
            { valor: "lucro", emoji: "📊", texto: "Não sei se estou lucrando" },
            { valor: "tempo", emoji: "⏰", texto: "Falta de tempo" },
            { valor: "escala", emoji: "🚀", texto: "Dificuldade para crescer" }
          ]
        })
      }
    }

    // Pergunta 4: Tempo disponível (adaptada ao nível)
    if (perguntaAtual === 2 && desafios.length > 0) {
      if (nivel === "sonhando" || nivel === "comecando") {
        novasPerguntas.push({
          id: "tempo",
          titulo: "Quanto tempo você pode dedicar por semana?",
          subtitulo: "Seja realista - vamos te ajudar a organizar",
          tipo: "unica",
          opcoes: [
            { valor: "poucas-horas", emoji: "⏰", texto: "Poucas horas (2-5h/semana)", descricao: "Tenho outro trabalho/família" },
            { valor: "fins-semana", emoji: "📅", texto: "Finais de semana", descricao: "Trabalho durante a semana" },
            { valor: "meio-periodo", emoji: "🕐", texto: "Meio período (20h/semana)", descricao: "Posso dedicar algumas horas por dia" },
            { valor: "integral", emoji: "💼", texto: "Período integral", descricao: "Posso me dedicar totalmente" }
          ]
        })
      } else {
        novasPerguntas.push({
          id: "tempo",
          titulo: "Quanto tempo você dedica atualmente?",
          subtitulo: "Queremos entender sua rotina",
          tipo: "unica",
          opcoes: [
            { valor: "fins-semana", emoji: "📅", texto: "Apenas finais de semana" },
            { valor: "meio-periodo", emoji: "🕐", texto: "Meio período (4h/dia)" },
            { valor: "integral", emoji: "💼", texto: "Período integral (8h/dia)" },
            { valor: "mais-8h", emoji: "🔥", texto: "Mais de 8h por dia" }
          ]
        })
      }
    }

    // Pergunta 5: Faturamento (adaptada ao nível)
    if (perguntaAtual === 3 && tempo) {
      if (nivel === "sonhando") {
        novasPerguntas.push({
          id: "faturamento",
          titulo: "Quanto você gostaria de faturar por mês?",
          subtitulo: "Qual é sua meta inicial?",
          tipo: "unica",
          opcoes: [
            { valor: "500-1000", emoji: "🌱", texto: "R$ 500 a R$ 1.000", descricao: "Uma renda extra já ajudaria" },
            { valor: "1000-2000", emoji: "📈", texto: "R$ 1.000 a R$ 2.000", descricao: "Complementar bem minha renda" },
            { valor: "2000-3000", emoji: "💪", texto: "R$ 2.000 a R$ 3.000", descricao: "Um salário completo" },
            { valor: "3000+", emoji: "🚀", texto: "Mais de R$ 3.000", descricao: "Quero viver disso" }
          ]
        })
      } else if (nivel === "comecando" || nivel === "hobby") {
        novasPerguntas.push({
          id: "faturamento",
          titulo: "Quanto você fatura atualmente por mês?",
          subtitulo: "Seja sincera - não há julgamento aqui",
          tipo: "unica",
          opcoes: [
            { valor: "0-500", emoji: "🌱", texto: "Até R$ 500", descricao: "Ainda muito pouco" },
            { valor: "500-1500", emoji: "📈", texto: "R$ 500 a R$ 1.500", descricao: "Já ajuda nas contas" },
            { valor: "1500-3000", emoji: "💪", texto: "R$ 1.500 a R$ 3.000", descricao: "Já é uma boa renda" },
            { valor: "3000+", emoji: "🚀", texto: "Mais de R$ 3.000", descricao: "Já ganho bem" }
          ]
        })
      } else {
        novasPerguntas.push({
          id: "faturamento",
          titulo: "Qual é seu faturamento mensal atual?",
          subtitulo: "Vamos te ajudar a crescer ainda mais",
          tipo: "unica",
          opcoes: [
            { valor: "1000-3000", emoji: "📈", texto: "R$ 1.000 a R$ 3.000" },
            { valor: "3000-5000", emoji: "💪", texto: "R$ 3.000 a R$ 5.000" },
            { valor: "5000-10000", emoji: "🚀", texto: "R$ 5.000 a R$ 10.000" },
            { valor: "10000+", emoji: "⭐", texto: "Mais de R$ 10.000" }
          ]
        })
      }
    }

    // Pergunta 6: Objetivos (adaptada ao nível e faturamento)
    if (perguntaAtual === 4 && faturamento) {
      if (nivel === "sonhando" || nivel === "comecando") {
        novasPerguntas.push({
          id: "objetivos",
          titulo: "O que você mais quer conquistar?",
          subtitulo: "Pode escolher até 3 opções",
          tipo: "multipla",
          opcoes: [
            { valor: "primeiros-clientes", emoji: "👥", texto: "Conseguir meus primeiros clientes" },
            { valor: "renda-extra", emoji: "💰", texto: "Ter uma renda extra consistente" },
            { valor: "confianca", emoji: "💪", texto: "Ganhar confiança" },
            { valor: "organizacao", emoji: "📋", texto: "Me organizar desde o início" },
            { valor: "crescer", emoji: "📈", texto: "Crescer rapidamente" },
            { valor: "profissionalizar", emoji: "👩‍🍳", texto: "Me tornar profissional" }
          ]
        })
      } else if (nivel === "hobby") {
        novasPerguntas.push({
          id: "objetivos",
          titulo: "Quais são seus principais objetivos?",
          subtitulo: "Pode escolher até 3 opções",
          tipo: "multipla",
          opcoes: [
            { valor: "mais-clientes", emoji: "👥", texto: "Conseguir mais clientes" },
            { valor: "aumentar-vendas", emoji: "📈", texto: "Aumentar minhas vendas" },
            { valor: "organizacao", emoji: "📋", texto: "Me organizar melhor" },
            { valor: "precificar", emoji: "💵", texto: "Precificar corretamente" },
            { valor: "profissionalizar", emoji: "💼", texto: "Profissionalizar meu negócio" },
            { valor: "renda-principal", emoji: "🎯", texto: "Transformar em renda principal" }
          ]
        })
      } else {
        novasPerguntas.push({
          id: "objetivos",
          titulo: "Quais são suas metas para os próximos meses?",
          subtitulo: "Pode escolher até 3 opções",
          tipo: "multipla",
          opcoes: [
            { valor: "dobrar-faturamento", emoji: "📈", texto: "Dobrar meu faturamento" },
            { valor: "automatizar", emoji: "⚙️", texto: "Automatizar processos" },
            { valor: "equipe", emoji: "👥", texto: "Montar uma equipe" },
            { valor: "loja-fisica", emoji: "🏪", texto: "Abrir loja física" },
            { valor: "escalar", emoji: "🚀", texto: "Escalar produção" },
            { valor: "mais-lucro", emoji: "💰", texto: "Aumentar margem de lucro" }
          ]
        })
      }
    }

    // Pergunta 7: Investimento (sempre a última)
    if (perguntaAtual === 5 && respostas.objetivos.length > 0) {
      novasPerguntas.push({
        id: "investimento",
        titulo: "Quanto você pode investir no seu negócio?",
        subtitulo: "Seja sincera - temos opções para todos os bolsos",
        tipo: "unica",
        opcoes: [
          { valor: "pouco", emoji: "🌱", texto: "Muito pouco (até R$ 50/mês)", descricao: "Estou começando do zero" },
          { valor: "moderado", emoji: "💼", texto: "Um valor moderado (R$ 50-150/mês)", descricao: "Posso investir um pouco" },
          { valor: "bom", emoji: "💪", texto: "Um bom valor (R$ 150-300/mês)", descricao: "Quero investir para crescer" },
          { valor: "alto", emoji: "🚀", texto: "Quanto for necessário", descricao: "Quero o melhor para meu negócio" }
        ]
      })
    }

    setPerguntasDinamicas(novasPerguntas)
  }

  useEffect(() => {
    if (etapa === "quiz" && perguntasDinamicas.length === 0) {
      setPerguntasDinamicas(gerarPerguntasDinamicas())
    }
  }, [etapa])

  useEffect(() => {
    if (etapa === "quiz") {
      adicionarProximaPergunta()
    }
  }, [perguntaAtual, respostas])

  const handleResposta = (perguntaId: string, valor: string, tipo: string) => {
    if (tipo === "multipla") {
      const respostasAtuais = respostas[perguntaId as keyof RespostasQuiz] as string[]
      const novasRespostas = respostasAtuais.includes(valor)
        ? respostasAtuais.filter(r => r !== valor)
        : [...respostasAtuais, valor].slice(0, 3) // Máximo 3 opções
      
      setRespostas({ ...respostas, [perguntaId]: novasRespostas })
    } else {
      setRespostas({ ...respostas, [perguntaId]: valor })
    }
  }

  const proximaPergunta = () => {
    if (perguntaAtual < perguntasDinamicas.length - 1) {
      setPerguntaAtual(perguntaAtual + 1)
    } else {
      // Salvar respostas e redirecionar para planos
      localStorage.setItem("quiz-confeitaria", JSON.stringify(respostas))
      setEtapa("resultado")
    }
  }

  const perguntaAnterior = () => {
    if (perguntaAtual > 0) {
      setPerguntaAtual(perguntaAtual - 1)
    }
  }

  const podeAvancar = () => {
    if (perguntasDinamicas.length === 0) return false
    const pergunta = perguntasDinamicas[perguntaAtual]
    if (!pergunta) return false
    
    const resposta = respostas[pergunta.id as keyof RespostasQuiz]
    
    if (pergunta.tipo === "multipla") {
      return (resposta as string[]).length > 0
    }
    return resposta !== ""
  }

  const determinarPlanoIdeal = () => {
    const { nivel, faturamento, investimento, objetivos } = respostas

    // Lógica para determinar plano ideal
    if (nivel === "sonhando" || nivel === "comecando") {
      if (investimento === "pouco") {
        return {
          plano: "basico",
          titulo: "Plano Básico",
          motivo: "Perfeito para quem está começando e quer dar os primeiros passos com segurança"
        }
      } else {
        return {
          plano: "profissional",
          titulo: "Plano Profissional",
          motivo: "Ideal para começar da forma certa e crescer rapidamente"
        }
      }
    } else if (nivel === "hobby") {
      return {
        plano: "profissional",
        titulo: "Plano Profissional",
        motivo: "Perfeito para transformar seu hobby em um negócio lucrativo"
      }
    } else if (nivel === "vendendo") {
      if (objetivos.includes("dobrar-faturamento") || objetivos.includes("escalar")) {
        return {
          plano: "premium",
          titulo: "Plano Premium",
          motivo: "Você precisa de ferramentas avançadas para escalar seu negócio"
        }
      } else {
        return {
          plano: "profissional",
          titulo: "Plano Profissional",
          motivo: "Ideal para organizar e profissionalizar seu negócio"
        }
      }
    } else {
      return {
        plano: "premium",
        titulo: "Plano Premium",
        motivo: "Você é profissional e merece as melhores ferramentas do mercado"
      }
    }
  }

  // Página de Boas-Vindas
  if (etapa === "boas-vindas") {
    return (
      <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
        <div 
          className="min-h-screen flex items-center justify-center relative overflow-hidden"
          style={{
            background: tema === "claro" 
              ? "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)"
              : "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
          }}
        >
          {/* Elementos decorativos */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
            <div className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" />
          </div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 py-20 text-center">
            <div className="mb-8 animate-bounce">
              <Sparkles className="w-20 h-20 text-yellow-300 mx-auto" />
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Bem-vinda ao<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-300">
                Confeitaria Pro
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-2xl mx-auto">
              Antes de escolher seu plano, vamos conhecer você melhor para 
              recomendar a opção perfeita para o seu momento!
            </p>

            {/* Card do Vídeo */}
            <div className={`${cardClass} rounded-3xl p-8 shadow-2xl mb-12 max-w-3xl mx-auto`}>
              <h2 className={`text-2xl font-bold ${textClass} mb-4`}>
                Veja como o Confeitaria Pro vai transformar seu negócio
              </h2>
              
              <div 
                className="relative aspect-video bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => setMostrarVideo(true)}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Play className="w-10 h-10 text-purple-600 ml-1" />
                  </div>
                </div>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />
              </div>

              <p className={`${textSecondaryClass} mt-4 text-sm`}>
                ⏱️ 3 minutos que podem mudar seu negócio para sempre
              </p>
            </div>

            {/* Modal de Vídeo */}
            {mostrarVideo && (
              <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={() => setMostrarVideo(false)}>
                <div className="relative max-w-4xl w-full bg-gray-900 rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => setMostrarVideo(false)}
                    className="absolute top-4 right-4 z-10 bg-white/10 backdrop-blur-sm p-2 rounded-full hover:bg-white/20 transition-colors"
                  >
                    <X className="w-6 h-6 text-white" />
                  </button>
                  <div className="aspect-video bg-gray-800 flex items-center justify-center">
                    <div className="text-center">
                      <Play className="w-20 h-20 text-white mx-auto mb-4" />
                      <p className="text-white text-xl">Vídeo demonstrativo em breve</p>
                      <p className="text-gray-400 mt-2">Em breve você verá aqui como o sistema funciona</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setEtapa("quiz")}
              className="group px-12 py-5 bg-white text-purple-600 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto"
            >
              Começar Agora
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>

            <p className="text-white/80 mt-6 text-sm">
              ⏱️ Leva apenas 2 minutos • 💝 Recomendação personalizada
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Página do Quiz
  if (etapa === "quiz") {
    if (perguntasDinamicas.length === 0 || !perguntasDinamicas[perguntaAtual]) {
      return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
    }

    const pergunta = perguntasDinamicas[perguntaAtual]
    const progresso = ((perguntaAtual + 1) / 7) * 100 // 7 perguntas no total

    return (
      <div className={`min-h-screen ${bgClass} transition-colors duration-300 py-8`}>
        <div className="max-w-4xl mx-auto px-4">
          {/* Header com progresso */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <span className={`text-sm font-semibold ${textSecondaryClass}`}>
                Pergunta {perguntaAtual + 1} de 7
              </span>
              <span className={`text-sm font-semibold ${textSecondaryClass}`}>
                {Math.round(progresso)}% completo
              </span>
            </div>
            <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 rounded-full"
                style={{ width: `${progresso}%` }}
              />
            </div>
          </div>

          {/* Pergunta */}
          <div className={`${cardClass} rounded-3xl p-8 md:p-12 shadow-2xl mb-8`}>
            <div className="text-center mb-8">
              <h2 className={`text-3xl md:text-4xl font-bold ${textClass} mb-4`}>
                {pergunta.titulo}
              </h2>
              <p className={`text-lg ${textSecondaryClass}`}>
                {pergunta.subtitulo}
              </p>
            </div>

            {/* Opções */}
            <div className="grid md:grid-cols-2 gap-4">
              {pergunta.opcoes.map((opcao: any) => {
                const isSelected = pergunta.tipo === "multipla"
                  ? (respostas[pergunta.id as keyof RespostasQuiz] as string[]).includes(opcao.valor)
                  : respostas[pergunta.id as keyof RespostasQuiz] === opcao.valor

                return (
                  <button
                    key={opcao.valor}
                    onClick={() => handleResposta(pergunta.id, opcao.valor, pergunta.tipo)}
                    className={`p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                      isSelected
                        ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20 scale-105"
                        : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 hover:scale-102"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{opcao.emoji}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-bold text-lg ${textClass}`}>
                            {opcao.texto}
                          </h3>
                          {isSelected && (
                            <Check className="w-6 h-6 text-purple-500" />
                          )}
                        </div>
                        {opcao.descricao && (
                          <p className={`text-sm ${textSecondaryClass}`}>
                            {opcao.descricao}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            {pergunta.tipo === "multipla" && (
              <p className={`text-center mt-4 text-sm ${textSecondaryClass}`}>
                ✨ Você pode escolher até 3 opções
              </p>
            )}
          </div>

          {/* Navegação */}
          <div className="flex items-center justify-between">
            <button
              onClick={perguntaAnterior}
              disabled={perguntaAtual === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${
                perguntaAtual === 0
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-105"
              } ${tema === "claro" ? "bg-gray-200 text-gray-700" : "bg-gray-700 text-white"}`}
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>

            <button
              onClick={proximaPergunta}
              disabled={!podeAvancar()}
              className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold text-white transition-all ${
                podeAvancar()
                  ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 shadow-lg"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {perguntaAtual === 6 ? "Ver Recomendação" : "Próxima"}
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Página de Resultado com Recomendação de Plano
  const planoIdeal = determinarPlanoIdeal()

  return (
    <div className={`min-h-screen ${bgClass} transition-colors duration-300`}>
      <div 
        className="min-h-screen flex items-center justify-center relative overflow-hidden py-20"
        style={{
          background: tema === "claro" 
            ? "linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)"
            : "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)"
        }}
      >
        {/* Elementos decorativos */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-96 h-96 bg-white/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
          <div className="absolute w-96 h-96 bg-pink-500/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          {/* Ícone de celebração */}
          <div className="mb-8 animate-bounce">
            <Target className="w-20 h-20 text-yellow-300 mx-auto" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Encontramos o plano perfeito para você! 🎯
          </h1>

          {/* Card de Recomendação */}
          <div className={`${cardClass} rounded-3xl p-8 md:p-12 shadow-2xl mb-8`}>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 mb-8">
              <Award className="w-16 h-16 text-white mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-3">
                {planoIdeal.titulo}
              </h2>
              <p className="text-white/90 text-lg">
                {planoIdeal.motivo}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                <Zap className="w-12 h-12 text-purple-500 mx-auto mb-3" />
                <h3 className={`font-bold ${textClass} mb-2`}>Rápido</h3>
                <p className={`text-sm ${textSecondaryClass}`}>
                  Comece hoje mesmo
                </p>
              </div>

              <div className="text-center p-6 bg-pink-50 dark:bg-pink-900/20 rounded-2xl">
                <Heart className="w-12 h-12 text-pink-500 mx-auto mb-3" />
                <h3 className={`font-bold ${textClass} mb-2`}>Personalizado</h3>
                <p className={`text-sm ${textSecondaryClass}`}>
                  Feito para você
                </p>
              </div>

              <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                <TrendingUp className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                <h3 className={`font-bold ${textClass} mb-2`}>Resultados</h3>
                <p className={`text-sm ${textSecondaryClass}`}>
                  Crescimento garantido
                </p>
              </div>
            </div>

            <p className={`text-lg ${textClass} mb-6`}>
              Com base nas suas respostas, este é o plano que vai te ajudar a alcançar 
              seus objetivos da forma mais rápida e eficiente! 🚀
            </p>
          </div>

          {/* CTA */}
          <Link href={`/vendas#planos`}>
            <button className="group px-12 py-5 bg-white text-purple-600 rounded-full font-bold text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 flex items-center gap-3 mx-auto justify-center mb-6">
              Ver Planos e Começar Agora
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </Link>

          <p className="text-white/90 text-sm mb-8">
            ✨ Sua recomendação foi salva • 🎁 7 dias grátis para testar
          </p>

          {/* Benefícios finais */}
          <div className="flex flex-wrap justify-center gap-6 text-white">
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Cancele quando quiser</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-5 h-5 text-green-400" />
              <span>Suporte dedicado</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
