"use client"

import { useState, useEffect } from "react"
import { Calculator, Users, Package, Sun, Moon, TrendingUp, Calendar, Gift, DollarSign, Camera, BarChart3, Settings, Bell, Sparkles } from "lucide-react"
import Link from "next/link"

interface Cliente {
  id: string
  nome: string
  aniversario: string
  familiares: Array<{ nome: string; aniversario: string }>
}

interface Pedido {
  id: string
  cliente: string
  produto: string
  dataEntrega: string
  status: string
}

interface ItemEstoque {
  id: string
  nome: string
  quantidade: number
  quantidadeMinima: number
}

export default function HomePage() {
  const [tema, setTema] = useState<"claro" | "escuro">("claro")
  const [notificacoes, setNotificacoes] = useState<string[]>([])
  const [mostrarNotificacoes, setMostrarNotificacoes] = useState(false)

  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema-confeitaria") as "claro" | "escuro" | null
    if (temaSalvo) {
      setTema(temaSalvo)
    }

    // Verificar notificações
    verificarNotificacoes()
  }, [])

  const verificarNotificacoes = () => {
    const configNotif = localStorage.getItem("config-notificacoes")
    if (!configNotif) return

    const config = JSON.parse(configNotif)
    const novasNotificacoes: string[] = []

    // Verificar aniversários
    if (config.aniversarios) {
      const clientes = JSON.parse(localStorage.getItem("clientes-confeitaria") || "[]") as Cliente[]
      const hoje = new Date()
      const diasAntecedencia = config.diasAntesAniversario || 3

      clientes.forEach(cliente => {
        const aniversario = new Date(cliente.aniversario + "T00:00:00")
        const diffDias = Math.ceil((aniversario.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
        
        if (diffDias >= 0 && diffDias <= diasAntecedencia) {
          novasNotificacoes.push(`🎉 Aniversário de ${cliente.nome} em ${diffDias} dia(s)!`)
        }

        cliente.familiares?.forEach(familiar => {
          const anivFamiliar = new Date(familiar.aniversario + "T00:00:00")
          const diffDiasFam = Math.ceil((anivFamiliar.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
          
          if (diffDiasFam >= 0 && diffDiasFam <= diasAntecedencia) {
            novasNotificacoes.push(`🎂 Aniversário de ${familiar.nome} (familiar de ${cliente.nome}) em ${diffDiasFam} dia(s)!`)
          }
        })
      })
    }

    // Verificar pedidos pendentes
    if (config.pedidosPendentes) {
      const pedidos = JSON.parse(localStorage.getItem("agenda-confeitaria") || "[]") as Pedido[]
      const hoje = new Date()

      pedidos.forEach(pedido => {
        if (pedido.status === "pendente") {
          const dataEntrega = new Date(pedido.dataEntrega + "T00:00:00")
          const diffDias = Math.ceil((dataEntrega.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
          
          if (diffDias >= 0 && diffDias <= 2) {
            novasNotificacoes.push(`📦 Pedido de ${pedido.produto} para ${pedido.cliente} em ${diffDias} dia(s)!`)
          }
        }
      })
    }

    // Verificar estoque mínimo
    if (config.estoqueMinimo) {
      const estoque = JSON.parse(localStorage.getItem("estoque-confeitaria") || "[]") as ItemEstoque[]
      
      estoque.forEach(item => {
        if (item.quantidade <= item.quantidadeMinima) {
          novasNotificacoes.push(`⚠️ Estoque baixo: ${item.nome} (${item.quantidade} restantes)`)
        }
      })
    }

    setNotificacoes(novasNotificacoes)
  }

  const alternarTema = () => {
    const novoTema = tema === "claro" ? "escuro" : "claro"
    setTema(novoTema)
    localStorage.setItem("tema-confeitaria", novoTema)
  }

  const bgClass = tema === "claro" 
    ? "bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50" 
    : "bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900"
  
  const textClass = tema === "claro" ? "text-gray-800" : "text-white"
  const cardClass = tema === "claro" ? "bg-white" : "bg-gray-800"
  const textSecondaryClass = tema === "claro" ? "text-gray-600" : "text-gray-300"

  return (
    <div className={`min-h-screen ${bgClass} p-4 md:p-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Header com Toggle de Tema e Notificações */}
        <div className="flex items-center justify-between mb-8">
          <div className="text-center flex-1">
            <h1 className={`text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2`}>
              Confeitaria Pro
            </h1>
            <p className={`${textSecondaryClass} text-lg`}>
              Sistema Completo de Gestão para Confeiteiras
            </p>
          </div>
          
          <div className="flex gap-3">
            {/* Botão de Notificações */}
            <div className="relative">
              <button
                onClick={() => setMostrarNotificacoes(!mostrarNotificacoes)}
                className={`${cardClass} p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 relative`}
              >
                <Bell className={`w-6 h-6 ${notificacoes.length > 0 ? 'text-red-500' : 'text-purple-600'}`} />
                {notificacoes.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {notificacoes.length}
                  </span>
                )}
              </button>

              {/* Dropdown de Notificações */}
              {mostrarNotificacoes && (
                <div className={`absolute right-0 mt-2 w-80 ${cardClass} rounded-2xl shadow-2xl p-4 z-50`}>
                  <h3 className={`font-bold ${textClass} mb-3 flex items-center gap-2`}>
                    <Bell className="w-5 h-5" />
                    Notificações
                  </h3>
                  {notificacoes.length > 0 ? (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {notificacoes.map((notif, index) => (
                        <div key={index} className={`p-3 rounded-xl ${tema === "claro" ? "bg-pink-50" : "bg-pink-900/20"}`}>
                          <p className={`text-sm ${textClass}`}>{notif}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className={`${textSecondaryClass} text-sm`}>Nenhuma notificação no momento</p>
                  )}
                </div>
              )}
            </div>

            {/* Botão de Tema */}
            <button
              onClick={alternarTema}
              className={`${cardClass} p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110`}
            >
              {tema === "claro" ? (
                <Moon className="w-6 h-6 text-purple-600" />
              ) : (
                <Sun className="w-6 h-6 text-yellow-400" />
              )}
            </button>
          </div>
        </div>

        {/* Banner de Destaque - Redireciona para seção de planos */}
        <Link href="/vendas#planos">
          <div className={`${cardClass} rounded-2xl shadow-2xl p-8 mb-8 cursor-pointer hover:scale-[1.02] transition-all duration-300 bg-gradient-to-r from-purple-500 to-pink-500 text-white overflow-hidden relative group`}>
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="w-6 h-6 animate-pulse" />
                  <span className="font-bold text-sm uppercase tracking-wider">Oferta Especial</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                  Comece Grátis Agora e Transforme Seu Negócio
                </h2>
                <p className="text-lg text-white/90 mb-4">
                  Escolha o plano ideal para você e aumente seus lucros em até 40%
                </p>
                <div className="flex items-center gap-2 font-bold text-lg">
                  <span>Começar Grátis Agora</span>
                  <span className="group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </div>
              <div className="hidden md:block text-8xl">
                🎯
              </div>
            </div>
          </div>
        </Link>

        {/* Cards de Funcionalidades */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {/* Calculadora de Precificação */}
          <Link href="/calculadora">
            <div className={`${cardClass} rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group`}>
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Calculator className="w-8 h-8 text-white" />
                </div>
                <span className="text-4xl">🧁</span>
              </div>
              <h2 className={`text-2xl font-bold ${textClass} mb-3`}>
                Calculadora de Precificação
              </h2>
              <p className={`${textSecondaryClass} mb-4`}>
                Calcule o preço ideal dos seus produtos considerando ingredientes, tempo e margem de lucro
              </p>
              <div className="flex items-center gap-2 text-purple-600 font-semibold">
                <span>Acessar</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Gerenciamento de Clientes */}
          <Link href="/clientes">
            <div className={`${cardClass} rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group`}>
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <span className="text-4xl">👥</span>
              </div>
              <h2 className={`text-2xl font-bold ${textClass} mb-3`}>
                Banco de Clientes
              </h2>
              <p className={`${textSecondaryClass} mb-4`}>
                Gerencie seus clientes, aniversários e familiares. Nunca mais esqueça uma data importante!
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <span>Acessar</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Controle de Estoque */}
          <Link href="/estoque">
            <div className={`${cardClass} rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group`}>
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Package className="w-8 h-8 text-white" />
                </div>
                <span className="text-4xl">📦</span>
              </div>
              <h2 className={`text-2xl font-bold ${textClass} mb-3`}>
                Controle de Estoque
              </h2>
              <p className={`${textSecondaryClass} mb-4`}>
                Gerencie suas matérias-primas, controle validades e evite desperdícios
              </p>
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <span>Acessar</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Agenda de Pedidos */}
          <Link href="/agenda">
            <div className={`${cardClass} rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group`}>
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <span className="text-4xl">📅</span>
              </div>
              <h2 className={`text-2xl font-bold ${textClass} mb-3`}>
                Agenda de Pedidos
              </h2>
              <p className={`${textSecondaryClass} mb-4`}>
                Organize entregas e produções por data. Nunca perca um prazo!
              </p>
              <div className="flex items-center gap-2 text-purple-600 font-semibold">
                <span>Acessar</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Controle Financeiro */}
          <Link href="/financeiro">
            <div className={`${cardClass} rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group`}>
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <DollarSign className="w-8 h-8 text-white" />
                </div>
                <span className="text-4xl">💰</span>
              </div>
              <h2 className={`text-2xl font-bold ${textClass} mb-3`}>
                Controle Financeiro
              </h2>
              <p className={`${textSecondaryClass} mb-4`}>
                Gerencie receitas, despesas e acompanhe seu lucro mensal
              </p>
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <span>Acessar</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Catálogo de Produtos */}
          <Link href="/catalogo">
            <div className={`${cardClass} rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group`}>
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-red-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Camera className="w-8 h-8 text-white" />
                </div>
                <span className="text-4xl">📸</span>
              </div>
              <h2 className={`text-2xl font-bold ${textClass} mb-3`}>
                Catálogo de Produtos
              </h2>
              <p className={`${textSecondaryClass} mb-4`}>
                Crie um portfólio visual com fotos e descrições dos seus produtos
              </p>
              <div className="flex items-center gap-2 text-pink-600 font-semibold">
                <span>Acessar</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Relatórios e Gráficos */}
          <Link href="/relatorios">
            <div className={`${cardClass} rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group`}>
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <span className="text-4xl">📊</span>
              </div>
              <h2 className={`text-2xl font-bold ${textClass} mb-3`}>
                Relatórios e Análises
              </h2>
              <p className={`${textSecondaryClass} mb-4`}>
                Visualize produtos mais vendidos, lucro por período e insights do negócio
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-semibold">
                <span>Acessar</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </Link>

          {/* Configurações */}
          <Link href="/configuracoes">
            <div className={`${cardClass} rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer group`}>
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <span className="text-4xl">⚙️</span>
              </div>
              <h2 className={`text-2xl font-bold ${textClass} mb-3`}>
                Configurações
              </h2>
              <p className={`${textSecondaryClass} mb-4`}>
                Notificações, WhatsApp, personalização de marca e backup na nuvem
              </p>
              <div className="flex items-center gap-2 text-gray-600 font-semibold">
                <span>Acessar</span>
                <span className="group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Seção de Benefícios */}
        <div className={`${cardClass} rounded-2xl shadow-xl p-8 mb-8`}>
          <h2 className={`text-3xl font-bold ${textClass} mb-6 text-center`}>
            Por que usar o Confeitaria Pro?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className={`font-bold ${textClass} mb-2`}>Aumente seus Lucros</h3>
              <p className={`text-sm ${textSecondaryClass}`}>
                Precifique corretamente e maximize seus ganhos
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className={`font-bold ${textClass} mb-2`}>Organize seu Tempo</h3>
              <p className={`text-sm ${textSecondaryClass}`}>
                Gerencie clientes e nunca perca um pedido
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-white" />
              </div>
              <h3 className={`font-bold ${textClass} mb-2`}>Controle Total</h3>
              <p className={`text-sm ${textSecondaryClass}`}>
                Saiba exatamente o que tem em estoque
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-white" />
              </div>
              <h3 className={`font-bold ${textClass} mb-2`}>Fidelização</h3>
              <p className={`text-sm ${textSecondaryClass}`}>
                Lembre aniversários e conquiste clientes
              </p>
            </div>
          </div>
        </div>

        {/* Análise de Mercado */}
        <div className={`${cardClass} rounded-2xl shadow-xl p-8`}>
          <h2 className={`text-3xl font-bold ${textClass} mb-6`}>
            📊 Análise de Mercado - Funcionalidades Essenciais
          </h2>
          
          <div className="space-y-6">
            <div>
              <h3 className={`text-xl font-bold ${textClass} mb-3 flex items-center gap-2`}>
                <span className="text-2xl">✅</span>
                Funcionalidades Implementadas
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${tema === "claro" ? "bg-green-50" : "bg-green-900/20"}`}>
                  <p className={`font-semibold ${textClass}`}>✓ Calculadora de Precificação</p>
                  <p className={`text-sm ${textSecondaryClass}`}>Essencial para não ter prejuízo</p>
                </div>
                <div className={`p-4 rounded-lg ${tema === "claro" ? "bg-green-50" : "bg-green-900/20"}`}>
                  <p className={`font-semibold ${textClass}`}>✓ Banco de Clientes com Aniversários</p>
                  <p className={`text-sm ${textSecondaryClass}`}>Fidelização e marketing automático</p>
                </div>
                <div className={`p-4 rounded-lg ${tema === "claro" ? "bg-green-50" : "bg-green-900/20"}`}>
                  <p className={`font-semibold ${textClass}`}>✓ Controle de Estoque Digital</p>
                  <p className={`text-sm ${textSecondaryClass}`}>Evita desperdício e compras desnecessárias</p>
                </div>
                <div className={`p-4 rounded-lg ${tema === "claro" ? "bg-green-50" : "bg-green-900/20"}`}>
                  <p className={`font-semibold ${textClass}`}>✓ Agenda de Pedidos</p>
                  <p className={`text-sm ${textSecondaryClass}`}>Organize entregas e produções por data</p>
                </div>
                <div className={`p-4 rounded-lg ${tema === "claro" ? "bg-green-50" : "bg-green-900/20"}`}>
                  <p className={`font-semibold ${textClass}`}>✓ Controle Financeiro</p>
                  <p className={`text-sm ${textSecondaryClass}`}>Receitas, despesas e lucro mensal</p>
                </div>
                <div className={`p-4 rounded-lg ${tema === "claro" ? "bg-green-50" : "bg-green-900/20"}`}>
                  <p className={`font-semibold ${textClass}`}>✓ Catálogo de Produtos</p>
                  <p className={`text-sm ${textSecondaryClass}`}>Fotos e descrições para mostrar aos clientes</p>
                </div>
                <div className={`p-4 rounded-lg ${tema === "claro" ? "bg-green-50" : "bg-green-900/20"}`}>
                  <p className={`font-semibold ${textClass}`}>✓ Relatórios e Gráficos</p>
                  <p className={`text-sm ${textSecondaryClass}`}>Produtos mais vendidos, lucro por período</p>
                </div>
                <div className={`p-4 rounded-lg ${tema === "claro" ? "bg-green-50" : "bg-green-900/20"}`}>
                  <p className={`font-semibold ${textClass}`}>✓ Notificações Automáticas</p>
                  <p className={`text-sm ${textSecondaryClass}`}>Lembretes de aniversários e pedidos</p>
                </div>
                <div className={`p-4 rounded-lg ${tema === "claro" ? "bg-green-50" : "bg-green-900/20"}`}>
                  <p className={`font-semibold ${textClass}`}>✓ Integração WhatsApp</p>
                  <p className={`text-sm ${textSecondaryClass}`}>Envio automático de mensagens</p>
                </div>
                <div className={`p-4 rounded-lg ${tema === "claro" ? "bg-green-50" : "bg-green-900/20"}`}>
                  <p className={`font-semibold ${textClass}`}>✓ Personalização de Marca</p>
                  <p className={`text-sm ${textSecondaryClass}`}>Logo e cores personalizadas</p>
                </div>
                <div className={`p-4 rounded-lg ${tema === "claro" ? "bg-green-50" : "bg-green-900/20"}`}>
                  <p className={`font-semibold ${textClass}`}>✓ Backup na Nuvem</p>
                  <p className={`text-sm ${textSecondaryClass}`}>Exportar e importar dados</p>
                </div>
              </div>
            </div>

            <div className={`p-6 rounded-lg ${tema === "claro" ? "bg-purple-50" : "bg-purple-900/20"} border-2 ${tema === "claro" ? "border-purple-200" : "border-purple-700"}`}>
              <h3 className={`text-xl font-bold ${textClass} mb-3`}>
                🎯 Insights do Mercado
              </h3>
              <ul className={`space-y-2 ${textSecondaryClass}`}>
                <li>• <strong>85%</strong> das confeiteiras não precificam corretamente seus produtos</li>
                <li>• <strong>60%</strong> perdem vendas por esquecer aniversários de clientes</li>
                <li>• <strong>40%</strong> têm prejuízo por desperdício de ingredientes vencidos</li>
                <li>• <strong>70%</strong> não sabem qual produto dá mais lucro</li>
                <li>• Apps de gestão aumentam lucro em até <strong>35%</strong> no primeiro ano</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className={`${textSecondaryClass} text-sm`}>
            Desenvolvido com 💜 para confeiteiras que querem crescer profissionalmente
          </p>
        </div>
      </div>
    </div>
  )
}
