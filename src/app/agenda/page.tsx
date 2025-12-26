"use client"

import { useState, useEffect } from "react"
import { Calendar, Plus, Clock, MapPin, Phone, DollarSign, CheckCircle, AlertCircle, Trash2, Edit2, ArrowLeft, MessageCircle } from "lucide-react"
import Link from "next/link"
import { enviarMensagemPedido, getConfigWhatsApp } from "@/lib/whatsapp"

interface Pedido {
  id: string
  cliente: string
  telefone: string
  produto: string
  quantidade: number
  valor: number
  dataEntrega: string
  horaEntrega: string
  endereco: string
  observacoes: string
  status: "pendente" | "producao" | "pronto" | "entregue"
  dataCriacao: string
}

export default function AgendaPedidos() {
  const [tema, setTema] = useState<"claro" | "escuro">("claro")
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [pedidoEditando, setPedidoEditando] = useState<string | null>(null)
  const [filtroStatus, setFiltroStatus] = useState<string>("todos")
  const [filtroData, setFiltroData] = useState<string>("")

  const [formData, setFormData] = useState({
    cliente: "",
    telefone: "",
    produto: "",
    quantidade: 1,
    valor: 0,
    dataEntrega: "",
    horaEntrega: "",
    endereco: "",
    observacoes: "",
    status: "pendente" as const
  })

  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema-confeitaria") as "claro" | "escuro" | null
    if (temaSalvo) setTema(temaSalvo)

    const pedidosSalvos = localStorage.getItem("pedidos-confeitaria")
    if (pedidosSalvos) setPedidos(JSON.parse(pedidosSalvos))
  }, [])

  const salvarPedidos = (novosPedidos: Pedido[]) => {
    setPedidos(novosPedidos)
    localStorage.setItem("pedidos-confeitaria", JSON.stringify(novosPedidos))
  }

  const adicionarPedido = () => {
    if (!formData.cliente || !formData.produto || !formData.dataEntrega) {
      alert("Preencha os campos obrigatórios: Cliente, Produto e Data de Entrega")
      return
    }

    if (pedidoEditando) {
      const pedidosAtualizados = pedidos.map(p => 
        p.id === pedidoEditando 
          ? { ...formData, id: p.id, dataCriacao: p.dataCriacao }
          : p
      )
      salvarPedidos(pedidosAtualizados)
      setPedidoEditando(null)
    } else {
      const novoPedido: Pedido = {
        ...formData,
        id: Date.now().toString(),
        dataCriacao: new Date().toISOString()
      }
      salvarPedidos([...pedidos, novoPedido])
    }

    setFormData({
      cliente: "",
      telefone: "",
      produto: "",
      quantidade: 1,
      valor: 0,
      dataEntrega: "",
      horaEntrega: "",
      endereco: "",
      observacoes: "",
      status: "pendente"
    })
    setMostrarFormulario(false)
  }

  const editarPedido = (pedido: Pedido) => {
    setFormData({
      cliente: pedido.cliente,
      telefone: pedido.telefone,
      produto: pedido.produto,
      quantidade: pedido.quantidade,
      valor: pedido.valor,
      dataEntrega: pedido.dataEntrega,
      horaEntrega: pedido.horaEntrega,
      endereco: pedido.endereco,
      observacoes: pedido.observacoes,
      status: pedido.status
    })
    setPedidoEditando(pedido.id)
    setMostrarFormulario(true)
  }

  const excluirPedido = (id: string) => {
    if (confirm("Deseja realmente excluir este pedido?")) {
      salvarPedidos(pedidos.filter(p => p.id !== id))
    }
  }

  const alterarStatus = (id: string, novoStatus: Pedido["status"]) => {
    const pedidosAtualizados = pedidos.map(p =>
      p.id === id ? { ...p, status: novoStatus } : p
    )
    salvarPedidos(pedidosAtualizados)
  }

  const pedidosFiltrados = pedidos.filter(p => {
    const statusMatch = filtroStatus === "todos" || p.status === filtroStatus
    const dataMatch = !filtroData || p.dataEntrega === filtroData
    return statusMatch && dataMatch
  }).sort((a, b) => new Date(a.dataEntrega).getTime() - new Date(b.dataEntrega).getTime())

  const bgClass = tema === "claro" 
    ? "bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50" 
    : "bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900"
  
  const textClass = tema === "claro" ? "text-gray-800" : "text-white"
  const cardClass = tema === "claro" ? "bg-white" : "bg-gray-800"
  const textSecondaryClass = tema === "claro" ? "text-gray-600" : "text-gray-300"
  const inputClass = tema === "claro" 
    ? "bg-white border-gray-300 text-gray-800" 
    : "bg-gray-700 border-gray-600 text-white"

  const statusConfig = {
    pendente: { label: "Pendente", color: "bg-yellow-500", icon: AlertCircle },
    producao: { label: "Em Produção", color: "bg-blue-500", icon: Clock },
    pronto: { label: "Pronto", color: "bg-purple-500", icon: CheckCircle },
    entregue: { label: "Entregue", color: "bg-green-500", icon: CheckCircle }
  }

  const totalPedidos = pedidos.length
  const totalValor = pedidos.reduce((acc, p) => acc + p.valor, 0)
  const pedidosPendentes = pedidos.filter(p => p.status === "pendente").length
  const pedidosHoje = pedidos.filter(p => p.dataEntrega === new Date().toISOString().split('T')[0]).length

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
                <Calendar className="w-10 h-10 text-purple-600" />
                Agenda de Pedidos
              </h1>
              <p className={`${textSecondaryClass} mt-2`}>
                Organize suas entregas e produções
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setMostrarFormulario(true)
              setPedidoEditando(null)
              setFormData({
                cliente: "",
                telefone: "",
                produto: "",
                quantidade: 1,
                valor: 0,
                dataEntrega: "",
                horaEntrega: "",
                endereco: "",
                observacoes: "",
                status: "pendente"
              })
            }}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Novo Pedido
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondaryClass} text-sm`}>Total de Pedidos</p>
                <p className={`${textClass} text-3xl font-bold`}>{totalPedidos}</p>
              </div>
              <Calendar className="w-12 h-12 text-purple-500" />
            </div>
          </div>

          <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondaryClass} text-sm`}>Valor Total</p>
                <p className={`${textClass} text-3xl font-bold`}>R$ {totalValor.toFixed(2)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondaryClass} text-sm`}>Pendentes</p>
                <p className={`${textClass} text-3xl font-bold`}>{pedidosPendentes}</p>
              </div>
              <AlertCircle className="w-12 h-12 text-yellow-500" />
            </div>
          </div>

          <div className={`${cardClass} rounded-xl shadow-lg p-6`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`${textSecondaryClass} text-sm`}>Entregas Hoje</p>
                <p className={`${textClass} text-3xl font-bold`}>{pedidosHoje}</p>
              </div>
              <Clock className="w-12 h-12 text-blue-500" />
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className={`${cardClass} rounded-xl shadow-lg p-6 mb-8`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`block ${textClass} font-semibold mb-2`}>Filtrar por Status</label>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
              >
                <option value="todos">Todos os Status</option>
                <option value="pendente">Pendente</option>
                <option value="producao">Em Produção</option>
                <option value="pronto">Pronto</option>
                <option value="entregue">Entregue</option>
              </select>
            </div>

            <div>
              <label className={`block ${textClass} font-semibold mb-2`}>Filtrar por Data</label>
              <input
                type="date"
                value={filtroData}
                onChange={(e) => setFiltroData(e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
              />
            </div>
          </div>
        </div>

        {/* Formulário de Pedido */}
        {mostrarFormulario && (
          <div className={`${cardClass} rounded-xl shadow-2xl p-8 mb-8`}>
            <h2 className={`text-2xl font-bold ${textClass} mb-6`}>
              {pedidoEditando ? "Editar Pedido" : "Novo Pedido"}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block ${textClass} font-semibold mb-2`}>Cliente *</label>
                <input
                  type="text"
                  value={formData.cliente}
                  onChange={(e) => setFormData({...formData, cliente: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
                  placeholder="Nome do cliente"
                />
              </div>

              <div>
                <label className={`block ${textClass} font-semibold mb-2`}>Telefone</label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
                  placeholder="(00) 00000-0000"
                />
              </div>

              <div>
                <label className={`block ${textClass} font-semibold mb-2`}>Produto *</label>
                <input
                  type="text"
                  value={formData.produto}
                  onChange={(e) => setFormData({...formData, produto: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
                  placeholder="Ex: Bolo de Chocolate"
                />
              </div>

              <div>
                <label className={`block ${textClass} font-semibold mb-2`}>Quantidade</label>
                <input
                  type="number"
                  min="1"
                  value={formData.quantidade}
                  onChange={(e) => setFormData({...formData, quantidade: parseInt(e.target.value) || 1})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
                />
              </div>

              <div>
                <label className={`block ${textClass} font-semibold mb-2`}>Valor (R$)</label>
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
                <label className={`block ${textClass} font-semibold mb-2`}>Data de Entrega *</label>
                <input
                  type="date"
                  value={formData.dataEntrega}
                  onChange={(e) => setFormData({...formData, dataEntrega: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
                />
              </div>

              <div>
                <label className={`block ${textClass} font-semibold mb-2`}>Hora de Entrega</label>
                <input
                  type="time"
                  value={formData.horaEntrega}
                  onChange={(e) => setFormData({...formData, horaEntrega: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
                />
              </div>

              <div>
                <label className={`block ${textClass} font-semibold mb-2`}>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as Pedido["status"]})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
                >
                  <option value="pendente">Pendente</option>
                  <option value="producao">Em Produção</option>
                  <option value="pronto">Pronto</option>
                  <option value="entregue">Entregue</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className={`block ${textClass} font-semibold mb-2`}>Endereço de Entrega</label>
                <input
                  type="text"
                  value={formData.endereco}
                  onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass}`}
                  placeholder="Rua, número, bairro"
                />
              </div>

              <div className="md:col-span-2">
                <label className={`block ${textClass} font-semibold mb-2`}>Observações</label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  className={`w-full px-4 py-3 rounded-lg border ${inputClass} h-24`}
                  placeholder="Detalhes do pedido, decoração, sabores..."
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={adicionarPedido}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                {pedidoEditando ? "Salvar Alterações" : "Adicionar Pedido"}
              </button>
              <button
                onClick={() => {
                  setMostrarFormulario(false)
                  setPedidoEditando(null)
                }}
                className={`px-6 py-3 rounded-xl ${cardClass} shadow-lg hover:shadow-xl transition-all`}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* Lista de Pedidos */}
        <div className="space-y-4">
          {pedidosFiltrados.length === 0 ? (
            <div className={`${cardClass} rounded-xl shadow-lg p-12 text-center`}>
              <Calendar className={`w-24 h-24 ${textSecondaryClass} mx-auto mb-4`} />
              <p className={`${textClass} text-xl font-semibold mb-2`}>
                Nenhum pedido encontrado
              </p>
              <p className={`${textSecondaryClass}`}>
                {filtroStatus !== "todos" || filtroData 
                  ? "Tente ajustar os filtros" 
                  : "Adicione seu primeiro pedido para começar"}
              </p>
            </div>
          ) : (
            pedidosFiltrados.map((pedido) => {
              const StatusIcon = statusConfig[pedido.status].icon
              return (
                <div key={pedido.id} className={`${cardClass} rounded-xl shadow-lg p-6 hover:shadow-xl transition-all`}>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`${statusConfig[pedido.status].color} text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1`}>
                          <StatusIcon className="w-4 h-4" />
                          {statusConfig[pedido.status].label}
                        </span>
                        <h3 className={`${textClass} text-xl font-bold`}>{pedido.cliente}</h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${textSecondaryClass}`} />
                          <span className={textSecondaryClass}>
                            {new Date(pedido.dataEntrega + 'T00:00:00').toLocaleDateString('pt-BR')}
                            {pedido.horaEntrega && ` às ${pedido.horaEntrega}`}
                          </span>
                        </div>

                        {pedido.telefone && (
                          <div className="flex items-center gap-2">
                            <Phone className={`w-4 h-4 ${textSecondaryClass}`} />
                            <span className={textSecondaryClass}>{pedido.telefone}</span>
                          </div>
                        )}

                        <div className="flex items-center gap-2">
                          <span className={`${textClass} font-semibold`}>{pedido.produto}</span>
                          <span className={textSecondaryClass}>x{pedido.quantidade}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <DollarSign className={`w-4 h-4 text-green-500`} />
                          <span className={`${textClass} font-bold text-green-600`}>
                            R$ {pedido.valor.toFixed(2)}
                          </span>
                        </div>

                        {pedido.endereco && (
                          <div className="flex items-center gap-2 md:col-span-2">
                            <MapPin className={`w-4 h-4 ${textSecondaryClass}`} />
                            <span className={textSecondaryClass}>{pedido.endereco}</span>
                          </div>
                        )}

                        {pedido.observacoes && (
                          <div className="md:col-span-2">
                            <p className={`${textSecondaryClass} text-sm italic`}>
                              "{pedido.observacoes}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-2">
                      <select
                        value={pedido.status}
                        onChange={(e) => alterarStatus(pedido.id, e.target.value as Pedido["status"])}
                        className={`px-3 py-2 rounded-lg border ${inputClass} text-sm`}
                      >
                        <option value="pendente">Pendente</option>
                        <option value="producao">Em Produção</option>
                        <option value="pronto">Pronto</option>
                        <option value="entregue">Entregue</option>
                      </select>

                      <button
                        onClick={() => editarPedido(pedido)}
                        className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-all"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => excluirPedido(pedido.id)}
                        className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-all"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
