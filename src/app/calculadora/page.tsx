"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Calculator, Save, List, ArrowLeft } from "lucide-react"

interface Ingrediente {
  id: string
  nome: string
  quantidadePacote: number
  unidadePacote: string
  valorPacote: number
  quantidadeUsada: number
  unidadeUsada: string
}

interface Produto {
  id: string
  nomeProduto: string
  ingredientes: Ingrediente[]
  horasTrabalhadas: number
  minutosTrabalhados: number
  valorHora: number
  custoEmbalagem: number
  margemLucro: number
  custoTotal: number
  precoVenda: number
  dataCriacao: string
}

export default function CalculadoraPrecificacao() {
  const [view, setView] = useState<"calculadora" | "lista">("calculadora")
  const [produtoAtual, setProdutoAtual] = useState<string>("")
  const [produtoEditandoId, setProdutoEditandoId] = useState<string | null>(null)
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [mensagemSucesso, setMensagemSucesso] = useState<string>("")
  const [modalExcluir, setModalExcluir] = useState<{ aberto: boolean; produtoId: string | null }>({
    aberto: false,
    produtoId: null
  })
  
  const [nomeProduto, setNomeProduto] = useState("")
  const [ingredientes, setIngredientes] = useState<Ingrediente[]>([
    { id: "1", nome: "Farinha de Trigo", quantidadePacote: 1, unidadePacote: "kg", valorPacote: 8.50, quantidadeUsada: 500, unidadeUsada: "g" },
    { id: "2", nome: "Açúcar", quantidadePacote: 1, unidadePacote: "kg", valorPacote: 5.00, quantidadeUsada: 300, unidadeUsada: "g" },
    { id: "3", nome: "Ovos", quantidadePacote: 12, unidadePacote: "unid", valorPacote: 15.00, quantidadeUsada: 4, unidadeUsada: "unid" },
  ])
  
  const [horasTrabalhadas, setHorasTrabalhadas] = useState(3)
  const [minutosTrabalhados, setMinutosTrabalhados] = useState(0)
  const [valorHora, setValorHora] = useState(25)
  const [custoEmbalagem, setCustoEmbalagem] = useState(5)
  const [margemLucro, setMargemLucro] = useState(40)

  useEffect(() => {
    carregarProdutosDoStorage()
  }, [])

  const carregarProdutosDoStorage = () => {
    const produtosSalvos = localStorage.getItem("produtos-confeitaria")
    if (produtosSalvos) {
      try {
        const produtosCarregados = JSON.parse(produtosSalvos)
        setProdutos(produtosCarregados)
      } catch (error) {
        console.error("Erro ao carregar produtos:", error)
        setProdutos([])
      }
    }
  }

  const adicionarIngrediente = () => {
    const novoIngrediente: Ingrediente = {
      id: Date.now().toString(),
      nome: "",
      quantidadePacote: 0,
      unidadePacote: "g",
      valorPacote: 0,
      quantidadeUsada: 0,
      unidadeUsada: "g"
    }
    setIngredientes([...ingredientes, novoIngrediente])
  }

  const removerIngrediente = (id: string) => {
    setIngredientes(ingredientes.filter(ing => ing.id !== id))
  }

  const atualizarIngrediente = (id: string, campo: keyof Ingrediente, valor: any) => {
    setIngredientes(ingredientes.map(ing => {
      if (ing.id === id) {
        const ingredienteAtualizado = { ...ing, [campo]: valor }
        
        if (campo === "unidadeUsada") {
          ingredienteAtualizado.quantidadeUsada = ing.quantidadePacote
        }
        
        return ingredienteAtualizado
      }
      return ing
    }))
  }

  const selecionarProdutoComoIngrediente = (id: string, nomeSelecionado: string) => {
    const produtoSalvo = produtos.find(p => p.nomeProduto === nomeSelecionado)
    
    if (produtoSalvo) {
      setIngredientes(ingredientes.map(ing => {
        if (ing.id === id) {
          return {
            ...ing,
            nome: produtoSalvo.nomeProduto,
            quantidadePacote: 1,
            unidadePacote: "unid",
            valorPacote: produtoSalvo.precoVenda,
            quantidadeUsada: 0,
            unidadeUsada: "unid"
          }
        }
        return ing
      }))
    } else {
      atualizarIngrediente(id, "nome", nomeSelecionado)
    }
  }

  const converterParaBaseComum = (quantidade: number, unidade: string): number => {
    switch (unidade) {
      case "kg":
        return quantidade * 1000
      case "L":
        return quantidade * 1000
      case "g":
      case "ml":
      case "unid":
      default:
        return quantidade
    }
  }

  const calcularCustoIngrediente = (ing: Ingrediente) => {
    if (!ing.quantidadePacote || !ing.valorPacote || !ing.quantidadeUsada) {
      return 0
    }

    const quantidadePacoteBase = converterParaBaseComum(ing.quantidadePacote, ing.unidadePacote)
    const quantidadeUsadaBase = converterParaBaseComum(ing.quantidadeUsada, ing.unidadeUsada)
    
    if (quantidadePacoteBase === 0) {
      return 0
    }

    const custoUnitario = ing.valorPacote / quantidadePacoteBase
    return custoUnitario * quantidadeUsadaBase
  }

  const custoTotalIngredientes = ingredientes.reduce((total, ing) => 
    total + calcularCustoIngrediente(ing), 0
  )

  const horasTotais = horasTrabalhadas + (minutosTrabalhados / 60)
  const custoMaoDeObra = horasTotais * valorHora
  const custoTotal = custoTotalIngredientes + custoMaoDeObra + custoEmbalagem
  const precoVenda = custoTotal * (1 + margemLucro / 100)
  const lucroFinal = precoVenda - custoTotal

  const salvarProduto = () => {
    if (!nomeProduto.trim()) {
      alert("Por favor, digite o nome do produto!")
      return
    }

    const novoProduto: Produto = {
      id: produtoEditandoId || Date.now().toString(),
      nomeProduto: nomeProduto,
      ingredientes: [...ingredientes],
      horasTrabalhadas,
      minutosTrabalhados,
      valorHora,
      custoEmbalagem,
      margemLucro,
      custoTotal,
      precoVenda,
      dataCriacao: new Date().toISOString()
    }

    let produtosAtualizados: Produto[]

    if (produtoEditandoId) {
      produtosAtualizados = produtos.map(p => p.id === produtoEditandoId ? novoProduto : p)
    } else {
      produtosAtualizados = [...produtos, novoProduto]
    }

    try {
      localStorage.setItem("produtos-confeitaria", JSON.stringify(produtosAtualizados))
      setProdutos(produtosAtualizados)
      setMensagemSucesso(`✅ Produto "${nomeProduto}" salvo com sucesso!`)
      setTimeout(() => setMensagemSucesso(""), 3000)
      limparFormulario()
      setTimeout(() => {
        carregarProdutosDoStorage()
      }, 100)
    } catch (error) {
      console.error("Erro ao salvar produto:", error)
      alert("Erro ao salvar produto. Tente novamente.")
    }
  }

  const limparFormulario = () => {
    setNomeProduto("")
    setIngredientes([
      { id: Date.now().toString(), nome: "", quantidadePacote: 0, unidadePacote: "g", valorPacote: 0, quantidadeUsada: 0, unidadeUsada: "g" }
    ])
    setHorasTrabalhadas(0)
    setMinutosTrabalhados(0)
    setValorHora(25)
    setCustoEmbalagem(0)
    setMargemLucro(40)
    setProdutoEditandoId(null)
  }

  const novoProduto = () => {
    limparFormulario()
    setView("calculadora")
  }

  const carregarProduto = (produto: Produto) => {
    setNomeProduto(produto.nomeProduto)
    setIngredientes(produto.ingredientes)
    setHorasTrabalhadas(produto.horasTrabalhadas)
    setMinutosTrabalhados(produto.minutosTrabalhados || 0)
    setValorHora(produto.valorHora)
    setCustoEmbalagem(produto.custoEmbalagem)
    setMargemLucro(produto.margemLucro)
    setProdutoEditandoId(produto.id)
    setView("calculadora")
  }

  const abrirModalExcluir = (id: string) => {
    setModalExcluir({ aberto: true, produtoId: id })
  }

  const fecharModalExcluir = () => {
    setModalExcluir({ aberto: false, produtoId: null })
  }

  const confirmarExclusao = () => {
    if (modalExcluir.produtoId) {
      const produtosAtualizados = produtos.filter(p => p.id !== modalExcluir.produtoId)
      
      try {
        localStorage.setItem("produtos-confeitaria", JSON.stringify(produtosAtualizados))
        setProdutos(produtosAtualizados)
        fecharModalExcluir()
        setTimeout(() => {
          carregarProdutosDoStorage()
        }, 100)
      } catch (error) {
        console.error("Erro ao excluir produto:", error)
        alert("Erro ao excluir produto. Tente novamente.")
      }
    }
  }

  const formatarTempoTrabalhado = (horas: number, minutos: number) => {
    if (horas === 0 && minutos === 0) return "0h"
    if (minutos === 0) return `${horas}h`
    if (horas === 0) return `${minutos}min`
    return `${horas}h ${minutos}min`
  }

  if (view === "lista") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">
              Meus Produtos
            </h1>
            <p className="text-gray-600 text-lg">Produtos salvos na confeitaria</p>
          </div>

          <div className="flex flex-wrap gap-4 mb-6">
            <button
              onClick={() => setView("calculadora")}
              className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
              Voltar
            </button>
            <button
              onClick={novoProduto}
              className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Novo Produto
            </button>
          </div>

          {produtos.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="text-6xl mb-4">🧁</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Nenhum produto salvo ainda</h3>
              <p className="text-gray-500 mb-6">Comece criando seu primeiro produto!</p>
              <button
                onClick={novoProduto}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Criar Primeiro Produto
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {produtos.map((produto) => (
                <div key={produto.id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{produto.nomeProduto}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(produto.dataCriacao).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                    <span className="text-3xl">🧁</span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-sm text-gray-600">Custo Total:</span>
                      <span className="font-bold text-purple-600">R$ {(produto.custoTotal || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                      <span className="text-sm text-gray-700 font-semibold">Preço de Venda:</span>
                      <span className="font-bold text-lg text-purple-700">R$ {(produto.precoVenda || 0).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-sm text-gray-600">Lucro:</span>
                      <span className="font-bold text-green-600">R$ {((produto.precoVenda || 0) - (produto.custoTotal || 0)).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => carregarProduto(produto)}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => abrirModalExcluir(produto.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {modalExcluir.aberto && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full animate-in fade-in zoom-in duration-200">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Tem certeza?</h2>
                <p className="text-gray-600">
                  Tem certeza que quer excluir esse produto? Esta ação não pode ser desfeita.
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={fecharModalExcluir}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold"
                >
                  NÃO
                </button>
                <button
                  onClick={confirmarExclusao}
                  className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all duration-300 font-semibold"
                >
                  SIM
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 mb-2">
            Calculadora de Precificação
          </h1>
          <p className="text-gray-600 text-lg">Para Confeiteiras Profissionais</p>
        </div>

        {mensagemSucesso && (
          <div className="mb-6 p-4 bg-green-100 border-2 border-green-500 text-green-800 rounded-lg text-center font-semibold animate-pulse">
            {mensagemSucesso}
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={() => setView("lista")}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <List className="w-5 h-5" />
            Ver Produtos Salvos ({produtos.length})
          </button>
          <button
            onClick={novoProduto}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Novo Produto
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <label className="block text-lg font-bold text-gray-800 mb-3">
            Nome do Produto
          </label>
          <input
            type="text"
            value={nomeProduto}
            onChange={(e) => setNomeProduto(e.target.value)}
            placeholder="Ex: Bolo de Chocolate, Brigadeiro Gourmet, Torta de Limão..."
            className="w-full px-4 py-3 border-2 border-pink-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <span className="text-3xl">🧁</span>
                  Ingredientes
                </h2>
                <button
                  onClick={adicionarIngrediente}
                  type="button"
                  className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  <Plus className="w-5 h-5" />
                  Adicionar
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-pink-100 to-purple-100 text-gray-700">
                      <th className="p-3 text-left rounded-tl-lg">Ingrediente</th>
                      <th className="p-3 text-left">Qtd. Pacote</th>
                      <th className="p-3 text-left">Valor (R$)</th>
                      <th className="p-3 text-left">Qtd. Usada</th>
                      <th className="p-3 text-left">Custo (R$)</th>
                      <th className="p-3 text-center rounded-tr-lg">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingredientes.map((ing, index) => (
                      <tr key={ing.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="p-3">
                          <select
                            value={ing.nome}
                            onChange={(e) => selecionarProdutoComoIngrediente(ing.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white"
                          >
                            <option value="">Selecione ou digite...</option>
                            <optgroup label="Produtos Salvos">
                              {produtos.map((produto) => (
                                <option key={produto.id} value={produto.nomeProduto}>
                                  {produto.nomeProduto} - R$ {(produto.precoVenda || 0).toFixed(2)}
                                </option>
                              ))}
                            </optgroup>
                            <optgroup label="Ingredientes Comuns">
                              <option value="Farinha de Trigo">Farinha de Trigo</option>
                              <option value="Açúcar">Açúcar</option>
                              <option value="Ovos">Ovos</option>
                              <option value="Manteiga">Manteiga</option>
                              <option value="Leite">Leite</option>
                              <option value="Chocolate">Chocolate</option>
                            </optgroup>
                          </select>
                          {!produtos.find(p => p.nomeProduto === ing.nome) && ing.nome && (
                            <input
                              type="text"
                              value={ing.nome}
                              onChange={(e) => atualizarIngrediente(ing.id, "nome", e.target.value)}
                              placeholder="Nome do ingrediente"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent mt-2"
                            />
                          )}
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={ing.quantidadePacote || ""}
                              onChange={(e) => atualizarIngrediente(ing.id, "quantidadePacote", parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              step="0.01"
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                            <select
                              value={ing.unidadePacote}
                              onChange={(e) => atualizarIngrediente(ing.id, "unidadePacote", e.target.value)}
                              className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            >
                              <option value="g">g</option>
                              <option value="kg">kg</option>
                              <option value="ml">ml</option>
                              <option value="L">L</option>
                              <option value="unid">unid</option>
                            </select>
                          </div>
                        </td>
                        <td className="p-3">
                          <input
                            type="number"
                            value={ing.valorPacote || ""}
                            onChange={(e) => atualizarIngrediente(ing.id, "valorPacote", parseFloat(e.target.value) || 0)}
                            placeholder="0.00"
                            step="0.01"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            readOnly={produtos.some(p => p.nomeProduto === ing.nome)}
                          />
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={ing.quantidadeUsada || ""}
                              onChange={(e) => atualizarIngrediente(ing.id, "quantidadeUsada", parseFloat(e.target.value) || 0)}
                              placeholder="0"
                              step="0.01"
                              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            />
                            <select
                              value={ing.unidadeUsada}
                              onChange={(e) => atualizarIngrediente(ing.id, "unidadeUsada", e.target.value)}
                              className="px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                            >
                              <option value="g">g</option>
                              <option value="kg">kg</option>
                              <option value="ml">ml</option>
                              <option value="L">L</option>
                              <option value="unid">unid</option>
                            </select>
                          </div>
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-purple-600">
                            R$ {calcularCustoIngrediente(ing).toFixed(2)}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <button
                            onClick={() => removerIngrediente(ing.id)}
                            type="button"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-gradient-to-r from-pink-100 to-purple-100 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-700">Total Ingredientes:</span>
                  <span className="text-2xl font-bold text-purple-600">
                    R$ {custoTotalIngredientes.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span className="text-3xl">⏰</span>
                Custos Adicionais
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tempo Trabalhado
                  </label>
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Horas</label>
                      <input
                        type="number"
                        value={horasTrabalhadas}
                        onChange={(e) => setHorasTrabalhadas(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                        placeholder="0"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-500 mb-1">Minutos</label>
                      <input
                        type="number"
                        value={minutosTrabalhados}
                        onChange={(e) => setMinutosTrabalhados(Math.min(59, Math.max(0, parseFloat(e.target.value) || 0)))}
                        min="0"
                        max="59"
                        step="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Total: {formatarTempoTrabalhado(horasTrabalhadas, minutosTrabalhados)} = {horasTotais.toFixed(2)}h
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Valor por Hora (R$)
                  </label>
                  <input
                    type="number"
                    value={valorHora}
                    onChange={(e) => setValorHora(parseFloat(e.target.value) || 0)}
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Custo Embalagem (R$)
                  </label>
                  <input
                    type="number"
                    value={custoEmbalagem}
                    onChange={(e) => setCustoEmbalagem(parseFloat(e.target.value) || 0)}
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Margem de Lucro (%)
                  </label>
                  <input
                    type="number"
                    value={margemLucro}
                    onChange={(e) => setMargemLucro(parseFloat(e.target.value) || 0)}
                    step="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent text-lg"
                  />
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Mão de Obra:</span>
                  <span className="text-lg font-semibold text-blue-600">
                    R$ {custoMaoDeObra.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-gray-700 font-medium">Embalagem:</span>
                  <span className="text-lg font-semibold text-green-600">
                    R$ {custoEmbalagem.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl shadow-2xl p-6 text-white sticky top-8">
              <div className="flex items-center justify-center mb-6">
                <Calculator className="w-12 h-12" />
              </div>
              
              <h2 className="text-2xl font-bold text-center mb-6">Resumo Final</h2>

              <div className="space-y-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-sm opacity-90 mb-1">Ingredientes</div>
                  <div className="text-2xl font-bold">R$ {custoTotalIngredientes.toFixed(2)}</div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-sm opacity-90 mb-1">Mão de Obra</div>
                  <div className="text-2xl font-bold">R$ {custoMaoDeObra.toFixed(2)}</div>
                </div>

                <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-sm opacity-90 mb-1">Embalagem</div>
                  <div className="text-2xl font-bold">R$ {custoEmbalagem.toFixed(2)}</div>
                </div>

                <div className="h-px bg-white/30 my-4"></div>

                <div className="bg-white/30 backdrop-blur-sm rounded-lg p-4">
                  <div className="text-sm opacity-90 mb-1">Custo Total</div>
                  <div className="text-3xl font-bold">R$ {custoTotal.toFixed(2)}</div>
                </div>

                <div className="bg-white rounded-lg p-4 text-purple-600">
                  <div className="text-sm font-semibold mb-1">Preço de Venda Sugerido</div>
                  <div className="text-4xl font-bold">R$ {precoVenda.toFixed(2)}</div>
                  <div className="text-sm mt-2 opacity-75">
                    Lucro: R$ {lucroFinal.toFixed(2)} ({margemLucro}%)
                  </div>
                </div>
              </div>

              <button
                onClick={salvarProduto}
                type="button"
                className="w-full mt-6 flex items-center justify-center gap-2 bg-white text-purple-600 px-6 py-4 rounded-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 font-bold text-lg"
              >
                <Save className="w-6 h-6" />
                {produtoEditandoId ? "Atualizar Produto" : "Salvar Produto"}
              </button>

              <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
                <div className="text-xs opacity-90 text-center">
                  💡 Dica: Salve seus produtos para acessá-los depois!
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600">
          <p className="text-sm">
            Desenvolvido com 💜 para confeiteiras que querem crescer profissionalmente
          </p>
        </div>
      </div>
    </div>
  )
}
