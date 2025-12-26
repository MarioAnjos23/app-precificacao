"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Edit, Package, AlertTriangle, TrendingDown, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ItemEstoque {
  id: string
  nome: string
  quantidade: number
  unidade: string
  quantidadeMinima: number
  valorUnitario: number
  dataCompra: string
  dataValidade: string
  fornecedor: string
  observacoes: string
}

export default function GerenciamentoEstoque() {
  const [itens, setItens] = useState<ItemEstoque[]>([])
  const [modalAberto, setModalAberto] = useState(false)
  const [itemEditando, setItemEditando] = useState<ItemEstoque | null>(null)
  const [modalExcluir, setModalExcluir] = useState<{ aberto: boolean; itemId: string | null }>({
    aberto: false,
    itemId: null
  })
  const [filtro, setFiltro] = useState<"todos" | "baixo" | "vencendo">("todos")

  // Form states
  const [nome, setNome] = useState("")
  const [quantidade, setQuantidade] = useState(0)
  const [unidade, setUnidade] = useState("kg")
  const [quantidadeMinima, setQuantidadeMinima] = useState(0)
  const [valorUnitario, setValorUnitario] = useState(0)
  const [dataCompra, setDataCompra] = useState("")
  const [dataValidade, setDataValidade] = useState("")
  const [fornecedor, setFornecedor] = useState("")
  const [observacoes, setObservacoes] = useState("")

  useEffect(() => {
    carregarEstoque()
  }, [])

  const carregarEstoque = () => {
    const estoqueSalvo = localStorage.getItem("estoque-confeitaria")
    if (estoqueSalvo) {
      try {
        setItens(JSON.parse(estoqueSalvo))
      } catch (error) {
        console.error("Erro ao carregar estoque:", error)
        setItens([])
      }
    }
  }

  const abrirModal = (item?: ItemEstoque) => {
    if (item) {
      setItemEditando(item)
      setNome(item.nome)
      setQuantidade(item.quantidade)
      setUnidade(item.unidade)
      setQuantidadeMinima(item.quantidadeMinima)
      setValorUnitario(item.valorUnitario)
      setDataCompra(item.dataCompra)
      setDataValidade(item.dataValidade)
      setFornecedor(item.fornecedor)
      setObservacoes(item.observacoes)
    } else {
      limparFormulario()
    }
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    limparFormulario()
  }

  const limparFormulario = () => {
    setItemEditando(null)
    setNome("")
    setQuantidade(0)
    setUnidade("kg")
    setQuantidadeMinima(0)
    setValorUnitario(0)
    setDataCompra("")
    setDataValidade("")
    setFornecedor("")
    setObservacoes("")
  }

  const salvarItem = () => {
    if (!nome.trim()) {
      alert("Por favor, digite o nome do item!")
      return
    }

    const novoItem: ItemEstoque = {
      id: itemEditando?.id || Date.now().toString(),
      nome,
      quantidade,
      unidade,
      quantidadeMinima,
      valorUnitario,
      dataCompra,
      dataValidade,
      fornecedor,
      observacoes
    }

    let itensAtualizados: ItemEstoque[]

    if (itemEditando) {
      itensAtualizados = itens.map(i => i.id === itemEditando.id ? novoItem : i)
    } else {
      itensAtualizados = [...itens, novoItem]
    }

    try {
      localStorage.setItem("estoque-confeitaria", JSON.stringify(itensAtualizados))
      setItens(itensAtualizados)
      fecharModal()
    } catch (error) {
      console.error("Erro ao salvar item:", error)
      alert("Erro ao salvar item. Tente novamente.")
    }
  }

  const abrirModalExcluir = (id: string) => {
    setModalExcluir({ aberto: true, itemId: id })
  }

  const fecharModalExcluir = () => {
    setModalExcluir({ aberto: false, itemId: null })
  }

  const confirmarExclusao = () => {
    if (modalExcluir.itemId) {
      const itensAtualizados = itens.filter(i => i.id !== modalExcluir.itemId)
      
      try {
        localStorage.setItem("estoque-confeitaria", JSON.stringify(itensAtualizados))
        setItens(itensAtualizados)
        fecharModalExcluir()
      } catch (error) {
        console.error("Erro ao excluir item:", error)
        alert("Erro ao excluir item. Tente novamente.")
      }
    }
  }

  const formatarData = (dataISO: string) => {
    if (!dataISO) return "-"
    const data = new Date(dataISO + "T00:00:00")
    return data.toLocaleDateString('pt-BR')
  }

  const verificarEstoqueBaixo = (item: ItemEstoque) => {
    return item.quantidade <= item.quantidadeMinima
  }

  const verificarVencimento = (item: ItemEstoque) => {
    if (!item.dataValidade) return false
    const hoje = new Date()
    const validade = new Date(item.dataValidade + "T00:00:00")
    const diasRestantes = Math.ceil((validade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
    return diasRestantes <= 30 && diasRestantes >= 0
  }

  const itensFiltrados = itens.filter(item => {
    if (filtro === "baixo") return verificarEstoqueBaixo(item)
    if (filtro === "vencendo") return verificarVencimento(item)
    return true
  })

  const itensBaixoEstoque = itens.filter(verificarEstoqueBaixo)
  const itensVencendo = itens.filter(verificarVencimento)
  const valorTotalEstoque = itens.reduce((total, item) => total + (item.quantidade * item.valorUnitario), 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-blue-600 mb-2">
            Controle de Estoque
          </h1>
          <p className="text-gray-600 text-lg">Gerencie suas matérias-primas e evite desperdícios</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total de Itens</p>
                <p className="text-3xl font-bold text-gray-800">{itens.length}</p>
              </div>
              <Package className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Valor Total</p>
                <p className="text-3xl font-bold text-green-600">R$ {valorTotalEstoque.toFixed(2)}</p>
              </div>
              <span className="text-4xl">💰</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Estoque Baixo</p>
                <p className="text-3xl font-bold text-orange-600">{itensBaixoEstoque.length}</p>
              </div>
              <TrendingDown className="w-12 h-12 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Vencendo</p>
                <p className="text-3xl font-bold text-red-600">{itensVencendo.length}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-500" />
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-wrap gap-4 mb-6">
          <Link
            href="/"
            className="flex items-center gap-2 bg-gradient-to-r from-gray-500 to-gray-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar ao Início
          </Link>
          <button
            onClick={() => abrirModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Adicionar Item
          </button>

          {/* Filtros */}
          <div className="flex gap-2 ml-auto">
            <button
              onClick={() => setFiltro("todos")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filtro === "todos"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFiltro("baixo")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filtro === "baixo"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Estoque Baixo
            </button>
            <button
              onClick={() => setFiltro("vencendo")}
              className={`px-4 py-2 rounded-lg transition-all ${
                filtro === "vencendo"
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Vencendo
            </button>
          </div>
        </div>

        {/* Alertas */}
        {(itensBaixoEstoque.length > 0 || itensVencendo.length > 0) && (
          <div className="space-y-4 mb-6">
            {itensBaixoEstoque.length > 0 && (
              <div className="bg-orange-100 border-2 border-orange-500 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <TrendingDown className="w-6 h-6 text-orange-600" />
                  <div>
                    <h3 className="font-bold text-orange-800">Atenção: Estoque Baixo!</h3>
                    <p className="text-sm text-orange-700">
                      {itensBaixoEstoque.length} {itensBaixoEstoque.length === 1 ? "item está" : "itens estão"} com estoque abaixo do mínimo
                    </p>
                  </div>
                </div>
              </div>
            )}

            {itensVencendo.length > 0 && (
              <div className="bg-red-100 border-2 border-red-500 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <div>
                    <h3 className="font-bold text-red-800">Alerta: Produtos Vencendo!</h3>
                    <p className="text-sm text-red-700">
                      {itensVencendo.length} {itensVencendo.length === 1 ? "item vence" : "itens vencem"} nos próximos 30 dias
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Lista de Itens */}
        {itensFiltrados.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              {filtro === "todos" 
                ? "Nenhum item no estoque ainda"
                : filtro === "baixo"
                ? "Nenhum item com estoque baixo"
                : "Nenhum item vencendo"}
            </h3>
            <p className="text-gray-500 mb-6">
              {filtro === "todos" && "Comece adicionando seu primeiro item!"}
            </p>
            {filtro === "todos" && (
              <button
                onClick={() => abrirModal()}
                className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                Adicionar Primeiro Item
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-green-100 to-blue-100">
                  <tr>
                    <th className="p-4 text-left font-bold text-gray-700">Item</th>
                    <th className="p-4 text-left font-bold text-gray-700">Quantidade</th>
                    <th className="p-4 text-left font-bold text-gray-700">Mínimo</th>
                    <th className="p-4 text-left font-bold text-gray-700">Valor Unit.</th>
                    <th className="p-4 text-left font-bold text-gray-700">Valor Total</th>
                    <th className="p-4 text-left font-bold text-gray-700">Validade</th>
                    <th className="p-4 text-left font-bold text-gray-700">Status</th>
                    <th className="p-4 text-center font-bold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {itensFiltrados.map((item, index) => {
                    const estoqueBaixo = verificarEstoqueBaixo(item)
                    const vencendo = verificarVencimento(item)
                    
                    return (
                      <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="p-4">
                          <div>
                            <p className="font-semibold text-gray-800">{item.nome}</p>
                            {item.fornecedor && (
                              <p className="text-sm text-gray-500">Fornecedor: {item.fornecedor}</p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`font-semibold ${estoqueBaixo ? "text-orange-600" : "text-gray-800"}`}>
                            {item.quantidade} {item.unidade}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">
                          {item.quantidadeMinima} {item.unidade}
                        </td>
                        <td className="p-4 text-gray-800">
                          R$ {item.valorUnitario.toFixed(2)}
                        </td>
                        <td className="p-4 font-semibold text-green-600">
                          R$ {(item.quantidade * item.valorUnitario).toFixed(2)}
                        </td>
                        <td className="p-4">
                          <span className={vencendo ? "text-red-600 font-semibold" : "text-gray-600"}>
                            {formatarData(item.dataValidade)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1">
                            {estoqueBaixo && (
                              <span className="inline-flex items-center gap-1 text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">
                                <TrendingDown className="w-3 h-3" />
                                Baixo
                              </span>
                            )}
                            {vencendo && (
                              <span className="inline-flex items-center gap-1 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                                <AlertTriangle className="w-3 h-3" />
                                Vencendo
                              </span>
                            )}
                            {!estoqueBaixo && !vencendo && (
                              <span className="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                ✓ OK
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => abrirModal(item)}
                              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50 p-2 rounded-lg transition-all"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => abrirModalExcluir(item.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal de Cadastro/Edição */}
        {modalAberto && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full my-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {itemEditando ? "Editar Item" : "Novo Item"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome do Item *
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Farinha de Trigo, Açúcar, Chocolate..."
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantidade *
                    </label>
                    <input
                      type="number"
                      value={quantidade}
                      onChange={(e) => setQuantidade(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Unidade *
                    </label>
                    <select
                      value={unidade}
                      onChange={(e) => setUnidade(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    >
                      <option value="kg">kg</option>
                      <option value="g">g</option>
                      <option value="L">L</option>
                      <option value="ml">ml</option>
                      <option value="unid">unid</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Quantidade Mínima
                    </label>
                    <input
                      type="number"
                      value={quantidadeMinima}
                      onChange={(e) => setQuantidadeMinima(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Valor Unitário (R$)
                    </label>
                    <input
                      type="number"
                      value={valorUnitario}
                      onChange={(e) => setValorUnitario(parseFloat(e.target.value) || 0)}
                      step="0.01"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Fornecedor
                    </label>
                    <input
                      type="text"
                      value={fornecedor}
                      onChange={(e) => setFornecedor(e.target.value)}
                      placeholder="Nome do fornecedor"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Data da Compra
                    </label>
                    <input
                      type="date"
                      value={dataCompra}
                      onChange={(e) => setDataCompra(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Data de Validade
                    </label>
                    <input
                      type="date"
                      value={dataValidade}
                      onChange={(e) => setDataValidade(e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Informações adicionais sobre o item..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                {quantidade > 0 && valorUnitario > 0 && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <p className="text-sm text-gray-600">Valor Total do Item:</p>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {(quantidade * valorUnitario).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={fecharModal}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarItem}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold"
                >
                  {itemEditando ? "Atualizar" : "Salvar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Confirmação de Exclusão */}
        {modalExcluir.aberto && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
              <div className="text-center mb-6">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Tem certeza?</h2>
                <p className="text-gray-600">
                  Tem certeza que quer excluir este item? Esta ação não pode ser desfeita.
                </p>
              </div>
              
              <div className="flex gap-4">
                <button
                  onClick={fecharModalExcluir}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={confirmarExclusao}
                  className="flex-1 bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition-all duration-300 font-semibold"
                >
                  Excluir
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
