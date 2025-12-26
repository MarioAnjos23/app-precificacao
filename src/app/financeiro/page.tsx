"use client"

import { useState, useEffect } from "react"
import { DollarSign, TrendingUp, TrendingDown, Plus, Trash2, Edit2, ArrowLeft, Calendar, PieChart } from "lucide-react"
import Link from "next/link"

interface Transacao {
  id: string
  tipo: "receita" | "despesa"
  categoria: string
  descricao: string
  valor: number
  data: string
  dataCriacao: string
}

export default function ControleFinanceiro() {
  const [tema, setTema] = useState<"claro" | "escuro">("claro")
  const [transacoes, setTransacoes] = useState<Transacao[]>([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [transacaoEditando, setTransacaoEditando] = useState<string | null>(null)
  const [filtroTipo, setFiltroTipo] = useState<string>("todos")
  const [filtroMes, setFiltroMes] = useState<string>(new Date().toISOString().slice(0, 7))

  const [formData, setFormData] = useState({
    tipo: "receita" as const,
    categoria: "",
    descricao: "",
    valor: 0,
    data: new Date().toISOString().split('T')[0]
  })

  const categoriasReceita = [
    "Vendas de Bolos",
    "Vendas de Doces",
    "Vendas de Salgados",
    "Encomendas",
    "Outros"
  ]

  const categoriasDespesa = [
    "Ingredientes",
    "Embalagens",
    "Gás",
    "Energia",
    "Água",
    "Aluguel",
    "Marketing",
    "Transporte",
    "Outros"
  ]

  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema-confeitaria") as "claro" | "escuro" | null
    if (temaSalvo) setTema(temaSalvo)

    const transacoesSalvas = localStorage.getItem("transacoes-confeitaria")
    if (transacoesSalvas) setTransacoes(JSON.parse(transacoesSalvas))
  }, [])

  const salvarTransacoes = (novasTransacoes: Transacao[]) => {
    setTransacoes(novasTransacoes)
    localStorage.setItem("transacoes-confeitaria", JSON.stringify(novasTransacoes))
  }

  const adicionarTransacao = () => {
    if (!formData.categoria || !formData.descricao || formData.valor <= 0) {
      alert("Preencha todos os campos corretamente")
      return
    }

    if (transacaoEditando) {
      const transacoesAtualizadas = transacoes.map(t =>
        t.id === transacaoEditando
          ? { ...formData, id: t.id, dataCriacao: t.dataCriacao }
          : t
      )
      salvarTransacoes(transacoesAtualizadas)
      setTransacaoEditando(null)
    } else {
      const novaTransacao: Transacao = {
        ...formData,
        id: Date.now().toString(),
        dataCriacao: new Date().toISOString()
      }
      salvarTransacoes([...transacoes, novaTransacao])
    }

    setFormData({
      tipo: "receita",
      categoria: "",
      descricao: "",
      valor: 0,
      data: new Date().toISOString().split('T')[0]
    })
    setMostrarFormulario(false)
  }

  const editarTransacao = (transacao: Transacao) => {
    setFormData({
      tipo: transacao.tipo,
      categoria: transacao.categoria,
      descricao: transacao.descricao,
      valor: transacao.valor,
      data: transacao.data
    })
    setTransacaoEditando(transacao.id)
    setMostrarFormulario(true)
  }

  const excluirTransacao = (id: string) => {
    if (confirm("Deseja realmente excluir esta transação?")) {
      salvarTransacoes(transacoes.filter(t => t.id !== id))
    }
  }

  const transacoesFiltradas = transacoes.filter(t => {
    const tipoMatch = filtroTipo === "todos" || t.tipo === filtroTipo
    const mesMatch = !filtroMes || t.data.startsWith(filtroMes)
    return tipoMatch && mesMatch
  }).sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())

  const totalReceitas = transacoes
    .filter(t => t.tipo === "receita" && t.data.startsWith(filtroMes))
    .reduce((acc, t) => acc + t.valor, 0)

  const totalDespesas = transacoes
    .filter(t => t.tipo === "despesa" && t.data.startsWith(filtroMes))
    .reduce((acc, t) => acc + t.valor, 0)

  const lucro = totalReceitas - totalDespesas
  const margemLucro = totalReceitas > 0 ? (lucro / totalReceitas) * 100 : 0

  // Análise por categoria
  const receitasPorCategoria = transacoes
    .filter(t => t.tipo === "receita" && t.data.startsWith(filtroMes))
    .reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + t.valor
      return acc
    }, {} as Record<string, number>)

  const despesasPorCategoria = transacoes
    .filter(t => t.tipo === "despesa" && t.data.startsWith(filtroMes))
    .reduce((acc, t) => {
      acc[t.categoria] = (acc[t.categoria] || 0) + t.valor
      return acc
    }, {} as Record<string, number>)

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
                <DollarSign className="w-10 h-10 text-green-600" />
                Controle Financeiro
              </h1>
              <p className={`${textSecondaryClass} mt-2`}>
                Gerencie suas receitas e despesas
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setMostrarFormulario(true)
              setTransacaoEditando(null)
              setFormData({
                tipo: "receita",
                categoria: "",
                descricao: "",
                valor: 0,
                data: new Date().toISOString().split('T')[0]
              })
            }}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Nova Transação
          </button>
        </div>

        {/* Filtros */}
        <div className={`${cardClass} rounded-xl shadow-lg p-6 mb-8`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block ${textClass} font-semibold mb-2`}>Filtrar por Tipo</label>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
              >
                <option value="todos">Todos</option>
                <option value="receita">Receitas</option>
                <option value="despesa">Despesas</option>
              </select>
            </div>

            <div>
              <label className={`block ${textClass} font-semibold mb-2`}>Filtrar por Mês</label>
              <input
                type="month"
                value={filtroMes}
                onChange={(e) => setFiltroMes(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
              />
            </div>
          </div>
        </div>

        {/* Cards de Resumo */}
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
              <TrendingDown className="w-6 h-6 text-red-500" />
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

        {/* Análise por Categoria */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Receitas por Categoria */}
          <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
            <h3 className={`text-xl font-bold ${textClass} mb-4 flex items-center gap-2`}>
              <TrendingUp className="w-6 h-6 text-green-500" />
              Receitas por Categoria
            </h3>
            <div className="space-y-3">
              {Object.entries(receitasPorCategoria).length === 0 ? (
                <p className={`${textSecondaryClass} text-center py-4`}>
                  Nenhuma receita registrada neste mês
                </p>
              ) : (
                Object.entries(receitasPorCategoria)
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
                  })
              )}
            </div>
          </div>

          {/* Despesas por Categoria */}
          <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
            <h3 className={`text-xl font-bold ${textClass} mb-4 flex items-center gap-2`}>
              <TrendingDown className="w-6 h-6 text-red-500" />
              Despesas por Categoria
            </h3>
            <div className="space-y-3">
              {Object.entries(despesasPorCategoria).length === 0 ? (
                <p className={`${textSecondaryClass} text-center py-4`}>
                  Nenhuma despesa registrada neste mês
                </p>
              ) : (
                Object.entries(despesasPorCategoria)
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
                  })
              )}
            </div>
          </div>
        </div>

        {/* Formulário */}
        {mostrarFormulario && (
          <div className={`${cardClass} rounded-xl shadow-2xl p-8 mb-8`}>
            <h2 className={`text-2xl font-bold ${textClass} mb-6`}>
              {transacaoEditando ? "Editar Transação" : "Nova Transação"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block ${textClass} font-semibold mb-2`}>Tipo *</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({...formData, tipo: e.target.value as "receita" | "despesa", categoria: ""})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
                >
                  <option value="receita">Receita</option>
                  <option value="despesa">Despesa</option>
                </select>
              </div>

              <div>
                <label className={`block ${textClass} font-semibold mb-2`}>Categoria *</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
                >
                  <option value="">Selecione...</option>
                  {(formData.tipo === "receita" ? categoriasReceita : categoriasDespesa).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block ${textClass} font-semibold mb-2`}>Descrição *</label>
                <input
                  type="text"
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
                  placeholder="Ex: Venda de bolo de chocolate"
                />
              </div>

              <div>
                <label className={`block ${textClass} font-semibold mb-2`}>Valor (R$) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.valor}
                  onChange={(e) => setFormData({...formData, valor: parseFloat(e.target.value) || 0})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className={`block ${textClass} font-semibold mb-2`}>Data *</label>
                <input
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData({...formData, data: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={adicionarTransacao}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                {transacaoEditando ? "Salvar Alterações" : "Adicionar Transação"}
              </button>
              <button
                onClick={() => {
                  setMostrarFormulario(false)
                  setTransacaoEditando(null)
                }}
                className={`px-6 py-3 rounded-xl ${cardClass} shadow-lg hover:shadow-xl transition-all`}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de Transações */}
        <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
          <h3 className={`text-xl font-bold ${textClass} mb-4`}>
            Histórico de Transações
          </h3>

          {transacoesFiltradas.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className={`w-24 h-24 ${textSecondaryClass} mx-auto mb-4`} />
              <p className={`${textClass} text-xl font-semibold mb-2`}>
                Nenhuma transação encontrada
              </p>
              <p className={`${textSecondaryClass}`}>
                Adicione sua primeira transação para começar
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {transacoesFiltradas.map((transacao) => (
                <div
                  key={transacao.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    tema === "claro" ? "bg-gray-50" : "bg-gray-700"
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      {transacao.tipo === "receita" ? (
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      ) : (
                        <TrendingDown className="w-5 h-5 text-red-500" />
                      )}
                      <span className={`${textClass} font-semibold`}>
                        {transacao.descricao}
                      </span>
                      <span className={`text-xs ${textSecondaryClass} px-2 py-1 rounded-full ${
                        tema === "claro" ? "bg-gray-200" : "bg-gray-600"
                      }`}>
                        {transacao.categoria}
                      </span>
                    </div>
                    <p className={`text-sm ${textSecondaryClass}`}>
                      {new Date(transacao.data + 'T00:00:00').toLocaleDateString('pt-BR')}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className={`text-xl font-bold ${
                      transacao.tipo === "receita" ? "text-green-600" : "text-red-600"
                    }`}>
                      {transacao.tipo === "receita" ? "+" : "-"} R$ {transacao.valor.toFixed(2)}
                    </span>

                    <button
                      onClick={() => editarTransacao(transacao)}
                      className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => excluirTransacao(transacao.id)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
