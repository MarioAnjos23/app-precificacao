"use client"

import { useState, useEffect } from "react"
import { BarChart3, TrendingUp, Package, DollarSign, Calendar, ArrowLeft, PieChart } from "lucide-react"
import Link from "next/link"

interface Pedido {
  id: string
  cliente: string
  produto: string
  quantidade: number
  valor: number
  dataEntrega: string
  status: string
}

interface Transacao {
  tipo: "receita" | "despesa"
  categoria: string
  valor: number
  data: string
}

export default function Relatorios() {
  const [tema, setTema] = useState<"claro" | "escuro">("claro")
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [periodoSelecionado, setPeriodoSelecionado] = useState<string>("mes")
  const [mesAno, setMesAno] = useState<string>(new Date().toISOString().slice(0, 7))

  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema-confeitaria") as "claro" | "escuro" | null
    if (temaSalvo) setTema(temaSalvo)

    const pedidosSalvos = localStorage.getItem("pedidos-confeitaria")
    if (pedidosSalvos) setPedidos(JSON.parse(pedidosSalvos))

    const transacoesSalvas = localStorage.getItem("transacoes-confeitaria")
    if (transacoesSalvas) setTransacoes(JSON.parse(transacoesSalvas))
  }, [])

  // Filtrar dados por período
  const filtrarPorPeriodo = (data: string) => {
    const dataObj = new Date(data + 'T00:00:00')
    const hoje = new Date()

    switch (periodoSelecionado) {
      case "semana":
        const umaSemanaAtras = new Date(hoje)
        umaSemanaAtras.setDate(hoje.getDate() - 7)
        return dataObj >= umaSemanaAtras
      case "mes":
        return data.startsWith(mesAno)
      case "trimestre":
        const tresMesesAtras = new Date(hoje)
        tresMesesAtras.setMonth(hoje.getMonth() - 3)
        return dataObj >= tresMesesAtras
      case "ano":
        return data.startsWith(mesAno.slice(0, 4))
      default:
        return true
    }
  }

  const pedidosFiltrados = pedidos.filter(p => filtrarPorPeriodo(p.dataEntrega))
  const transacoesFiltradas = transacoes.filter(t => filtrarPorPeriodo(t.data))

  // Análise de Produtos Mais Vendidos
  const produtosMaisVendidos = pedidosFiltrados.reduce((acc, pedido) => {
    const produto = pedido.produto
    if (!acc[produto]) {
      acc[produto] = { quantidade: 0, valor: 0 }
    }
    acc[produto].quantidade += pedido.quantidade
    acc[produto].valor += pedido.valor
    return acc
  }, {} as Record<string, { quantidade: number; valor: number }>)

  const topProdutos = Object.entries(produtosMaisVendidos)
    .sort(([, a], [, b]) => b.valor - a.valor)
    .slice(0, 5)

  // Análise de Clientes
  const clientesMaisCompram = pedidosFiltrados.reduce((acc, pedido) => {
    const cliente = pedido.cliente
    if (!acc[cliente]) {
      acc[cliente] = { pedidos: 0, valor: 0 }
    }
    acc[cliente].pedidos += 1
    acc[cliente].valor += pedido.valor
    return acc
  }, {} as Record<string, { pedidos: number; valor: number }>)

  const topClientes = Object.entries(clientesMaisCompram)
    .sort(([, a], [, b]) => b.valor - a.valor)
    .slice(0, 5)

  // Análise Financeira
  const totalReceitas = transacoesFiltradas
    .filter(t => t.tipo === "receita")
    .reduce((acc, t) => acc + t.valor, 0)

  const totalDespesas = transacoesFiltradas
    .filter(t => t.tipo === "despesa")
    .reduce((acc, t) => acc + t.valor, 0)

  const lucro = totalReceitas - totalDespesas
  const margemLucro = totalReceitas > 0 ? (lucro / totalReceitas) * 100 : 0

  // Receitas por Categoria
  const receitasPorCategoria = transacoesFiltradas
    .filter(t => t.tipo === "receita")
    .reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + t.valor
      return acc
    }, {} as Record<string, number>)

  // Despesas por Categoria
  const despesasPorCategoria = transacoesFiltradas
    .filter(t => t.tipo === "despesa")
    .reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + t.valor
      return acc
    }, {} as Record<string, number>)

  // Estatísticas de Pedidos
  const totalPedidos = pedidosFiltrados.length
  const ticketMedio = totalPedidos > 0 ? pedidosFiltrados.reduce((acc, p) => acc + p.valor, 0) / totalPedidos : 0
  const pedidosEntregues = pedidosFiltrados.filter(p => p.status === "entregue").length
  const taxaEntrega = totalPedidos > 0 ? (pedidosEntregues / totalPedidos) * 100 : 0

  const bgClass = tema === "claro"
    ? "bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50"
    : "bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900"

  const textClass = tema === "claro" ? "text-gray-800" : "text-white"
  const cardClass = tema === "claro" ? "bg-white" : "bg-gray-800"
  const textSecondaryClass = tema === "claro" ? "text-gray-600" : "text-gray-300"
  const inputClass = tema === "claro"
    ? "bg-white border-gray-300 text-gray-800"
    : "bg-gray-700 border-gray-600 text-white"

  return (
    <div className={`min-h-screen ${bgClass} p-4 md:p-8 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/">
              <button className={`${cardClass} p-3 rounded-xl shadow-lg hover:shadow-xl transition-all`}>
                <ArrowLeft className={`w-6 h-6 ${textClass}`} />
              </button>
            </Link>
            <div>
              <h1 className={`text-3xl md:text-5xl font-bold ${textClass} flex items-center gap-3`}>
                <BarChart3 className="w-10 h-10 text-blue-600" />
                Relatórios e Análises
              </h1>
              <p className={`${textSecondaryClass} mt-2`}>
                Insights sobre seu negócio
              </p>
            </div>
          </div>
        </div>

        {/* Filtros de Período */}
        <div className={`${cardClass} rounded-xl shadow-lg p-6 mb-8`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block ${textClass} font-semibold mb-2`}>Período</label>
              <select
                value={periodoSelecionado}
                onChange={(e) => setPeriodoSelecionado(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
              >
                <option value="semana">Última Semana</option>
                <option value="mes">Mês Atual</option>
                <option value="trimestre">Último Trimestre</option>
                <option value="ano">Ano Atual</option>
              </select>
            </div>

            {(periodoSelecionado === "mes" || periodoSelecionado === "ano") && (
              <div>
                <label className={`block ${textClass} font-semibold mb-2`}>
                  {periodoSelecionado === "mes" ? "Mês/Ano" : "Ano"}
                </label>
                <input
                  type={periodoSelecionado === "mes" ? "month" : "number"}
                  value={periodoSelecionado === "mes" ? mesAno : mesAno.slice(0, 4)}
                  onChange={(e) => setMesAno(periodoSelecionado === "mes" ? e.target.value : `${e.target.value}-01`)}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
                />
              </div>
            )}
          </div>
        </div>

        {/* Cards de Resumo Financeiro */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`${textSecondaryClass} text-sm`}>Receitas</p>
              <TrendingUp className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              R$ {totalReceitas.toFixed(2)}
            </p>
          </div>

          <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`${textSecondaryClass} text-sm`}>Despesas</p>
              <TrendingUp className="w-6 h-6 text-red-500 rotate-180" />
            </div>
            <p className="text-3xl font-bold text-red-600">
              R$ {totalDespesas.toFixed(2)}
            </p>
          </div>

          <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`${textSecondaryClass} text-sm`}>Lucro</p>
              <DollarSign className={`w-6 h-6 ${lucro >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            </div>
            <p className={`text-3xl font-bold ${lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              R$ {lucro.toFixed(2)}
            </p>
          </div>

          <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`${textSecondaryClass} text-sm`}>Margem</p>
              <PieChart className="w-6 h-6 text-purple-500" />
            </div>
            <p className={`text-3xl font-bold ${margemLucro >= 0 ? 'text-purple-600' : 'text-red-600'}`}>
              {margemLucro.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Cards de Estatísticas de Pedidos */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`${textSecondaryClass} text-sm`}>Total de Pedidos</p>
              <Package className="w-6 h-6 text-blue-500" />
            </div>
            <p className={`text-3xl font-bold ${textClass}`}>
              {totalPedidos}
            </p>
          </div>

          <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`${textSecondaryClass} text-sm`}>Ticket Médio</p>
              <DollarSign className="w-6 h-6 text-green-500" />
            </div>
            <p className="text-3xl font-bold text-green-600">
              R$ {ticketMedio.toFixed(2)}
            </p>
          </div>

          <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between mb-2">
              <p className={`${textSecondaryClass} text-sm`}>Taxa de Entrega</p>
              <Calendar className="w-6 h-6 text-purple-500" />
            </div>
            <p className="text-3xl font-bold text-purple-600">
              {taxaEntrega.toFixed(1)}%
            </p>
          </div>
        </div>

        {/* Produtos Mais Vendidos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
            <h3 className={`text-xl font-bold ${textClass} mb-4 flex items-center gap-2`}>
              <TrendingUp className="w-6 h-6 text-purple-500" />
              Top 5 Produtos Mais Vendidos
            </h3>
            {topProdutos.length === 0 ? (
              <p className={`${textSecondaryClass} text-center py-8`}>
                Nenhum dado disponível para o período selecionado
              </p>
            ) : (
              <div className="space-y-4">
                {topProdutos.map(([produto, dados], index) => {
                  const maxValor = topProdutos[0][1].valor
                  const percentual = (dados.valor / maxValor) * 100
                  return (
                    <div key={produto}>
                      <div className="flex justify-between mb-1">
                        <span className={`${textClass} font-semibold`}>
                          {index + 1}. {produto}
                        </span>
                        <span className="text-green-600 font-bold">
                          R$ {dados.valor.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all"
                          style={{ width: `${percentual}%` }}
                        />
                      </div>
                      <p className={`text-xs ${textSecondaryClass} mt-1`}>
                        {dados.quantidade} unidades vendidas
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Top Clientes */}
          <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
            <h3 className={`text-xl font-bold ${textClass} mb-4 flex items-center gap-2`}>
              <TrendingUp className="w-6 h-6 text-blue-500" />
              Top 5 Melhores Clientes
            </h3>
            {topClientes.length === 0 ? (
              <p className={`${textSecondaryClass} text-center py-8`}>
                Nenhum dado disponível para o período selecionado
              </p>
            ) : (
              <div className="space-y-4">
                {topClientes.map(([cliente, dados], index) => {
                  const maxValor = topClientes[0][1].valor
                  const percentual = (dados.valor / maxValor) * 100
                  return (
                    <div key={cliente}>
                      <div className="flex justify-between mb-1">
                        <span className={`${textClass} font-semibold`}>
                          {index + 1}. {cliente}
                        </span>
                        <span className="text-green-600 font-bold">
                          R$ {dados.valor.toFixed(2)}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all"
                          style={{ width: `${percentual}%` }}
                        />
                      </div>
                      <p className={`text-xs ${textSecondaryClass} mt-1`}>
                        {dados.pedidos} pedidos realizados
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Análise de Receitas e Despesas por Categoria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Receitas por Categoria */}
          <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
            <h3 className={`text-xl font-bold ${textClass} mb-4 flex items-center gap-2`}>
              <PieChart className="w-6 h-6 text-green-500" />
              Receitas por Categoria
            </h3>
            {Object.keys(receitasPorCategoria).length === 0 ? (
              <p className={`${textSecondaryClass} text-center py-8`}>
                Nenhuma receita registrada no período
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(receitasPorCategoria)
                  .sort(([, a], [, b]) => b - a)
                  .map(([categoria, valor]) => {
                    const percentual = (valor / totalReceitas) * 100
                    return (
                      <div key={categoria}>
                        <div className="flex justify-between mb-1">
                          <span className={textClass}>{categoria}</span>
                          <span className="font-bold text-green-600">
                            R$ {valor.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentual}%` }}
                          />
                        </div>
                        <p className={`text-xs ${textSecondaryClass} mt-1`}>
                          {percentual.toFixed(1)}% do total
                        </p>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>

          {/* Despesas por Categoria */}
          <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
            <h3 className={`text-xl font-bold ${textClass} mb-4 flex items-center gap-2`}>
              <PieChart className="w-6 h-6 text-red-500" />
              Despesas por Categoria
            </h3>
            {Object.keys(despesasPorCategoria).length === 0 ? (
              <p className={`${textSecondaryClass} text-center py-8`}>
                Nenhuma despesa registrada no período
              </p>
            ) : (
              <div className="space-y-3">
                {Object.entries(despesasPorCategoria)
                  .sort(([, a], [, b]) => b - a)
                  .map(([categoria, valor]) => {
                    const percentual = (valor / totalDespesas) * 100
                    return (
                      <div key={categoria}>
                        <div className="flex justify-between mb-1">
                          <span className={textClass}>{categoria}</span>
                          <span className="font-bold text-red-600">
                            R$ {valor.toFixed(2)}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-red-500 h-2 rounded-full transition-all"
                            style={{ width: `${percentual}%` }}
                          />
                        </div>
                        <p className={`text-xs ${textSecondaryClass} mt-1`}>
                          {percentual.toFixed(1)}% do total
                        </p>
                      </div>
                    )
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
