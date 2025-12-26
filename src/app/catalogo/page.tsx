"use client"

import { useState, useEffect } from "react"
import { Camera, Plus, Edit2, Trash2, ArrowLeft, Eye, DollarSign, Package } from "lucide-react"
import Link from "next/link"

interface Produto {
  id: string
  nome: string
  descricao: string
  categoria: string
  preco: number
  tempoPreparo: string
  porcoes: string
  imagemUrl: string
  ingredientes: string[]
  dataCriacao: string
}

export default function CatalogoProdutos() {
  const [tema, setTema] = useState<"claro" | "escuro">("claro")
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [produtoEditando, setProdutoEditando] = useState<string | null>(null)
  const [produtoVisualizando, setProdutoVisualizando] = useState<Produto | null>(null)
  const [filtroCategoria, setFiltroCategoria] = useState<string>("todos")

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    preco: 0,
    tempoPreparo: "",
    porcoes: "",
    imagemUrl: "",
    ingredientes: [""]
  })

  const categorias = [
    "Bolos",
    "Tortas",
    "Doces Finos",
    "Cupcakes",
    "Brownies",
    "Cookies",
    "Salgados",
    "Outros"
  ]

  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema-confeitaria") as "claro" | "escuro" | null
    if (temaSalvo) setTema(temaSalvo)

    const produtosSalvos = localStorage.getItem("catalogo-confeitaria")
    if (produtosSalvos) setProdutos(JSON.parse(produtosSalvos))
  }, [])

  const salvarProdutos = (novosProdutos: Produto[]) => {
    setProdutos(novosProdutos)
    localStorage.setItem("catalogo-confeitaria", JSON.stringify(novosProdutos))
  }

  const adicionarProduto = () => {
    if (!formData.nome || !formData.categoria || formData.preco <= 0) {
      alert("Preencha os campos obrigatórios: Nome, Categoria e Preço")
      return
    }

    const ingredientesFiltrados = formData.ingredientes.filter(i => i.trim() !== "")

    if (produtoEditando) {
      const produtosAtualizados = produtos.map(p =>
        p.id === produtoEditando
          ? { ...formData, ingredientes: ingredientesFiltrados, id: p.id, dataCriacao: p.dataCriacao }
          : p
      )
      salvarProdutos(produtosAtualizados)
      setProdutoEditando(null)
    } else {
      const novoProduto: Produto = {
        ...formData,
        ingredientes: ingredientesFiltrados,
        id: Date.now().toString(),
        dataCriacao: new Date().toISOString()
      }
      salvarProdutos([...produtos, novoProduto])
    }

    setFormData({
      nome: "",
      descricao: "",
      categoria: "",
      preco: 0,
      tempoPreparo: "",
      porcoes: "",
      imagemUrl: "",
      ingredientes: [""]
    })
    setMostrarFormulario(false)
  }

  const editarProduto = (produto: Produto) => {
    setFormData({
      nome: produto.nome,
      descricao: produto.descricao,
      categoria: produto.categoria,
      preco: produto.preco,
      tempoPreparo: produto.tempoPreparo,
      porcoes: produto.porcoes,
      imagemUrl: produto.imagemUrl,
      ingredientes: produto.ingredientes.length > 0 ? produto.ingredientes : [""]
    })
    setProdutoEditando(produto.id)
    setMostrarFormulario(true)
  }

  const excluirProduto = (id: string) => {
    if (confirm("Deseja realmente excluir este produto do catálogo?")) {
      salvarProdutos(produtos.filter(p => p.id !== id))
    }
  }

  const adicionarIngrediente = () => {
    setFormData({
      ...formData,
      ingredientes: [...formData.ingredientes, ""]
    })
  }

  const atualizarIngrediente = (index: number, valor: string) => {
    const novosIngredientes = [...formData.ingredientes]
    novosIngredientes[index] = valor
    setFormData({ ...formData, ingredientes: novosIngredientes })
  }

  const removerIngrediente = (index: number) => {
    setFormData({
      ...formData,
      ingredientes: formData.ingredientes.filter((_, i) => i !== index)
    })
  }

  const produtosFiltrados = produtos.filter(p =>
    filtroCategoria === "todos" || p.categoria === filtroCategoria
  )

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
                <Camera className="w-10 h-10 text-pink-600" />
                Catálogo de Produtos
              </h1>
              <p className={`${textSecondaryClass} mt-2`}>
                Mostre seus produtos aos clientes
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setMostrarFormulario(true)
              setProdutoEditando(null)
              setFormData({
                nome: "",
                descricao: "",
                categoria: "",
                preco: 0,
                tempoPreparo: "",
                porcoes: "",
                imagemUrl: "",
                ingredientes: [""]
              })
            }}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Novo Produto
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondaryClass} text-sm`}>Total de Produtos</p>
                <p className={`${textClass} text-3xl font-bold`}>{produtos.length}</p>
              </div>
              <Package className="w-12 h-12 text-purple-500" />
            </div>
          </div>

          <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondaryClass} text-sm`}>Preço Médio</p>
                <p className={`${textClass} text-3xl font-bold`}>
                  R$ {produtos.length > 0 
                    ? (produtos.reduce((acc, p) => acc + p.preco, 0) / produtos.length).toFixed(2)
                    : "0.00"}
                </p>
              </div>
              <DollarSign className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondaryClass} text-sm`}>Categorias</p>
                <p className={`${textClass} text-3xl font-bold`}>
                  {new Set(produtos.map(p => p.categoria)).size}
                </p>
              </div>
              <Camera className="w-12 h-12 text-pink-500" />
            </div>
          </div>
        </div>

        {/* Filtro */}
        <div className={`${cardClass} rounded-xl shadow-lg p-6 mb-8`}>
          <label className={`block ${textClass} font-semibold mb-2`}>Filtrar por Categoria</label>
          <select
            value={filtroCategoria}
            onChange={(e) => setFiltroCategoria(e.target.value)}
            className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
          >
            <option value="todos">Todas as Categorias</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Formulário */}
        {mostrarFormulario && (
          <div className={`${cardClass} rounded-xl shadow-2xl p-8 mb-8`}>
            <h2 className={`text-2xl font-bold ${textClass} mb-6`}>
              {produtoEditando ? "Editar Produto" : "Novo Produto"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block ${textClass} font-semibold mb-2`}>Nome do Produto *</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
                  placeholder="Ex: Bolo de Chocolate"
                />
              </div>

              <div>
                <label className={`block ${textClass} font-semibold mb-2`}>Categoria *</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
                >
                  <option value="">Selecione...</option>
                  {categorias.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className={`block ${textClass} font-semibold mb-2`}>Preço (R$) *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.preco}
                  onChange={(e) => setFormData({...formData, preco: parseFloat(e.target.value) || 0})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className={`block ${textClass} font-semibold mb-2`}>Tempo de Preparo</label>
                <input
                  type="text"
                  value={formData.tempoPreparo}
                  onChange={(e) => setFormData({...formData, tempoPreparo: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
                  placeholder="Ex: 2 horas"
                />
              </div>

              <div>
                <label className={`block ${textClass} font-semibold mb-2`}>Porções</label>
                <input
                  type="text"
                  value={formData.porcoes}
                  onChange={(e) => setFormData({...formData, porcoes: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
                  placeholder="Ex: 15 fatias"
                />
              </div>

              <div>
                <label className={`block ${textClass} font-semibold mb-2`}>URL da Imagem</label>
                <input
                  type="url"
                  value={formData.imagemUrl}
                  onChange={(e) => setFormData({...formData, imagemUrl: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block ${textClass} font-semibold mb-2`}>Descrição</label>
                <textarea
                  value={formData.descricao}
                  onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass} h-24`}
                  placeholder="Descreva seu produto..."
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block ${textClass} font-semibold mb-2`}>Ingredientes</label>
                <div className="space-y-2">
                  {formData.ingredientes.map((ingrediente, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={ingrediente}
                        onChange={(e) => atualizarIngrediente(index, e.target.value)}
                        className={`flex-1 px-4 py-3 rounded-lg border ${inputClass}`}
                        placeholder="Ex: 200g de chocolate"
                      />
                      {formData.ingredientes.length > 1 && (
                        <button
                          onClick={() => removerIngrediente(index)}
                          className="bg-red-500 text-white px-4 rounded-lg hover:bg-red-600 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={adicionarIngrediente}
                    className="text-purple-600 hover:text-purple-700 font-semibold flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Adicionar Ingrediente
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={adicionarProduto}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                {produtoEditando ? "Salvar Alterações" : "Adicionar Produto"}
              </button>
              <button
                onClick={() => {
                  setMostrarFormulario(false)
                  setProdutoEditando(null)
                }}
                className={`px-6 py-3 rounded-xl ${cardClass} shadow-lg hover:shadow-xl transition-all`}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Modal de Visualização */}
        {produtoVisualizando && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setProdutoVisualizando(null)}>
            <div className={`${cardClass} rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto`} onClick={(e) => e.stopPropagation()}>
              {produtoVisualizando.imagemUrl && (
                <img
                  src={produtoVisualizando.imagemUrl}
                  alt={produtoVisualizando.nome}
                  className="w-full h-64 object-cover rounded-t-2xl"
                />
              )}
              <div className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className={`text-3xl font-bold ${textClass} mb-2`}>
                      {produtoVisualizando.nome}
                    </h2>
                    <span className="bg-purple-500 text-white px-3 py-1 rounded-full text-sm">
                      {produtoVisualizando.categoria}
                    </span>
                  </div>
                  <p className="text-3xl font-bold text-green-600">
                    R$ {produtoVisualizando.preco.toFixed(2)}
                  </p>
                </div>

                {produtoVisualizando.descricao && (
                  <p className={`${textSecondaryClass} mb-4`}>
                    {produtoVisualizando.descricao}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {produtoVisualizando.tempoPreparo && (
                    <div>
                      <p className={`${textSecondaryClass} text-sm`}>Tempo de Preparo</p>
                      <p className={`${textClass} font-semibold`}>{produtoVisualizando.tempoPreparo}</p>
                    </div>
                  )}
                  {produtoVisualizando.porcoes && (
                    <div>
                      <p className={`${textSecondaryClass} text-sm`}>Porções</p>
                      <p className={`${textClass} font-semibold`}>{produtoVisualizando.porcoes}</p>
                    </div>
                  )}
                </div>

                {produtoVisualizando.ingredientes.length > 0 && (
                  <div>
                    <h3 className={`${textClass} font-bold text-lg mb-3`}>Ingredientes:</h3>
                    <ul className="space-y-2">
                      {produtoVisualizando.ingredientes.map((ing, index) => (
                        <li key={index} className={`${textSecondaryClass} flex items-center gap-2`}>
                          <span className="w-2 h-2 bg-purple-500 rounded-full" />
                          {ing}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => setProdutoVisualizando(null)}
                  className="w-full mt-6 bg-gradient-to-r from-pink-500 to-purple-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all"
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grid de Produtos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {produtosFiltrados.length === 0 ? (
            <div className={`${cardClass} rounded-xl shadow-lg p-12 text-center md:col-span-2 lg:col-span-3`}>
              <Camera className={`w-24 h-24 ${textSecondaryClass} mx-auto mb-4`} />
              <p className={`${textClass} text-xl font-semibold mb-2`}>
                Nenhum produto encontrado
              </p>
              <p className={`${textSecondaryClass}`}>
                Adicione produtos ao seu catálogo
              </p>
            </div>
          ) : (
            produtosFiltrados.map((produto) => (
              <div key={produto.id} className={`${cardClass} rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all group`}>
                {produto.imagemUrl ? (
                  <img
                    src={produto.imagemUrl}
                    alt={produto.nome}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                    <Camera className="w-16 h-16 text-white" />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className={`${textClass} text-xl font-bold mb-1`}>
                        {produto.nome}
                      </h3>
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                        {produto.categoria}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      R$ {produto.preco.toFixed(2)}
                    </p>
                  </div>

                  {produto.descricao && (
                    <p className={`${textSecondaryClass} text-sm mb-4 line-clamp-2`}>
                      {produto.descricao}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => setProdutoVisualizando(produto)}
                      className="flex-1 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-all flex items-center justify-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver
                    </button>
                    <button
                      onClick={() => editarProduto(produto)}
                      className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => excluirProduto(produto.id)}
                      className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
