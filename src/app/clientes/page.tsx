"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Edit, Users, Calendar, Gift, ArrowLeft, MessageCircle } from "lucide-react"
import Link from "next/link"
import { enviarMensagemAniversario, getConfigWhatsApp } from "@/lib/whatsapp"

interface Familiar {
  id: string
  nome: string
  parentesco: string
  dataAniversario: string
}

interface Cliente {
  id: string
  nome: string
  telefone: string
  email: string
  dataAniversario: string
  observacoes: string
  familiares: Familiar[]
  dataCadastro: string
}

export default function GerenciamentoClientes() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [modalAberto, setModalAberto] = useState(false)
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null)
  const [modalExcluir, setModalExcluir] = useState<{ aberto: boolean; clienteId: string | null }>({
    aberto: false,
    clienteId: null
  })

  // Form states
  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [email, setEmail] = useState("")
  const [dataAniversario, setDataAniversario] = useState("")
  const [observacoes, setObservacoes] = useState("")
  const [familiares, setFamiliares] = useState<Familiar[]>([])

  useEffect(() => {
    carregarClientes()
  }, [])

  const carregarClientes = () => {
    const clientesSalvos = localStorage.getItem("clientes-confeitaria")
    if (clientesSalvos) {
      try {
        setClientes(JSON.parse(clientesSalvos))
      } catch (error) {
        console.error("Erro ao carregar clientes:", error)
        setClientes([])
      }
    }
  }

  const abrirModal = (cliente?: Cliente) => {
    if (cliente) {
      setClienteEditando(cliente)
      setNome(cliente.nome)
      setTelefone(cliente.telefone)
      setEmail(cliente.email)
      setDataAniversario(cliente.dataAniversario)
      setObservacoes(cliente.observacoes)
      setFamiliares(cliente.familiares)
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
    setClienteEditando(null)
    setNome("")
    setTelefone("")
    setEmail("")
    setDataAniversario("")
    setObservacoes("")
    setFamiliares([])
  }

  const adicionarFamiliar = () => {
    const novoFamiliar: Familiar = {
      id: Date.now().toString(),
      nome: "",
      parentesco: "",
      dataAniversario: ""
    }
    setFamiliares([...familiares, novoFamiliar])
  }

  const removerFamiliar = (id: string) => {
    setFamiliares(familiares.filter(f => f.id !== id))
  }

  const atualizarFamiliar = (id: string, campo: keyof Familiar, valor: string) => {
    setFamiliares(familiares.map(f => 
      f.id === id ? { ...f, [campo]: valor } : f
    ))
  }

  const salvarCliente = () => {
    if (!nome.trim()) {
      alert("Por favor, digite o nome do cliente!")
      return
    }

    const novoCliente: Cliente = {
      id: clienteEditando?.id || Date.now().toString(),
      nome,
      telefone,
      email,
      dataAniversario,
      observacoes,
      familiares,
      dataCadastro: clienteEditando?.dataCadastro || new Date().toISOString()
    }

    let clientesAtualizados: Cliente[]

    if (clienteEditando) {
      clientesAtualizados = clientes.map(c => c.id === clienteEditando.id ? novoCliente : c)
    } else {
      clientesAtualizados = [...clientes, novoCliente]
    }

    try {
      localStorage.setItem("clientes-confeitaria", JSON.stringify(clientesAtualizados))
      setClientes(clientesAtualizados)
      fecharModal()
    } catch (error) {
      console.error("Erro ao salvar cliente:", error)
      alert("Erro ao salvar cliente. Tente novamente.")
    }
  }

  const abrirModalExcluir = (id: string) => {
    setModalExcluir({ aberto: true, clienteId: id })
  }

  const fecharModalExcluir = () => {
    setModalExcluir({ aberto: false, clienteId: null })
  }

  const confirmarExclusao = () => {
    if (modalExcluir.clienteId) {
      const clientesAtualizados = clientes.filter(c => c.id !== modalExcluir.clienteId)
      
      try {
        localStorage.setItem("clientes-confeitaria", JSON.stringify(clientesAtualizados))
        setClientes(clientesAtualizados)
        fecharModalExcluir()
      } catch (error) {
        console.error("Erro ao excluir cliente:", error)
        alert("Erro ao excluir cliente. Tente novamente.")
      }
    }
  }

  const formatarData = (dataISO: string) => {
    if (!dataISO) return "-"
    const data = new Date(dataISO + "T00:00:00")
    return data.toLocaleDateString('pt-BR')
  }

  const proximosAniversarios = () => {
    const hoje = new Date()
    const aniversarios: Array<{ nome: string; data: Date; tipo: string; cliente: string }> = []

    clientes.forEach(cliente => {
      if (cliente.dataAniversario) {
        const [ano, mes, dia] = cliente.dataAniversario.split('-')
        const aniversario = new Date(hoje.getFullYear(), parseInt(mes) - 1, parseInt(dia))
        
        if (aniversario < hoje) {
          aniversario.setFullYear(hoje.getFullYear() + 1)
        }

        const diasRestantes = Math.ceil((aniversario.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
        
        if (diasRestantes <= 30) {
          aniversarios.push({
            nome: cliente.nome,
            data: aniversario,
            tipo: "Cliente",
            cliente: cliente.nome
          })
        }
      }

      cliente.familiares.forEach(familiar => {
        if (familiar.dataAniversario) {
          const [ano, mes, dia] = familiar.dataAniversario.split('-')
          const aniversario = new Date(hoje.getFullYear(), parseInt(mes) - 1, parseInt(dia))
          
          if (aniversario < hoje) {
            aniversario.setFullYear(hoje.getFullYear() + 1)
          }

          const diasRestantes = Math.ceil((aniversario.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
          
          if (diasRestantes <= 30) {
            aniversarios.push({
              nome: familiar.nome,
              data: aniversario,
              tipo: familiar.parentesco,
              cliente: cliente.nome
            })
          }
        }
      })
    })

    return aniversarios.sort((a, b) => a.data.getTime() - b.data.getTime())
  }

  const aniversariosProximos = proximosAniversarios()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600 mb-2">
            Gerenciamento de Clientes
          </h1>
          <p className="text-gray-600 text-lg">Organize seus clientes e nunca esqueça um aniversário</p>
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
            className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Novo Cliente
          </button>
        </div>

        {/* Aniversários Próximos */}
        {aniversariosProximos.length > 0 && (
          <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Gift className="w-6 h-6 text-pink-600" />
              Aniversários nos Próximos 30 Dias
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {aniversariosProximos.map((aniv, index) => (
                <div key={index} className="bg-white rounded-lg p-4 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">🎂</div>
                    <div>
                      <h3 className="font-bold text-gray-800">{aniv.nome}</h3>
                      <p className="text-sm text-gray-600">{aniv.tipo} de {aniv.cliente}</p>
                      <p className="text-sm text-purple-600 font-semibold">
                        {aniv.data.toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de Clientes */}
        {clientes.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Nenhum cliente cadastrado ainda</h3>
            <p className="text-gray-500 mb-6">Comece adicionando seu primeiro cliente!</p>
            <button
              onClick={() => abrirModal()}
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Adicionar Primeiro Cliente
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clientes.map((cliente) => (
              <div key={cliente.id} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {cliente.nome.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{cliente.nome}</h3>
                      <p className="text-sm text-gray-500">
                        {cliente.telefone || "Sem telefone"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  {cliente.email && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>📧</span>
                      <span>{cliente.email}</span>
                    </div>
                  )}
                  {cliente.dataAniversario && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Aniversário: {formatarData(cliente.dataAniversario)}</span>
                    </div>
                  )}
                  {cliente.familiares.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{cliente.familiares.length} familiar(es)</span>
                    </div>
                  )}
                </div>

                {cliente.observacoes && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 line-clamp-2">{cliente.observacoes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  {cliente.telefone && getConfigWhatsApp()?.ativo && (
                    <button
                      onClick={() => enviarMensagemAniversario(cliente.nome, cliente.telefone)}
                      className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                      title="Enviar mensagem de aniversário"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => abrirModal(cliente)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </button>
                  <button
                    onClick={() => abrirModalExcluir(cliente.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de Cadastro/Edição */}
        {modalAberto && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-3xl w-full my-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                {clienteEditando ? "Editar Cliente" : "Novo Cliente"}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Digite o nome do cliente"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Telefone
                    </label>
                    <input
                      type="tel"
                      value={telefone}
                      onChange={(e) => setTelefone(e.target.value)}
                      placeholder="(00) 00000-0000"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="email@exemplo.com"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Data de Aniversário
                  </label>
                  <input
                    type="date"
                    value={dataAniversario}
                    onChange={(e) => setDataAniversario(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    value={observacoes}
                    onChange={(e) => setObservacoes(e.target.value)}
                    placeholder="Preferências, restrições alimentares, etc."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Familiares */}
                <div className="border-t-2 border-gray-200 pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">Familiares</h3>
                    <button
                      onClick={adicionarFamiliar}
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105"
                    >
                      <Plus className="w-4 h-4" />
                      Adicionar Familiar
                    </button>
                  </div>

                  {familiares.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Nenhum familiar adicionado</p>
                  ) : (
                    <div className="space-y-4">
                      {familiares.map((familiar) => (
                        <div key={familiar.id} className="bg-gray-50 rounded-lg p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Nome
                              </label>
                              <input
                                type="text"
                                value={familiar.nome}
                                onChange={(e) => atualizarFamiliar(familiar.id, "nome", e.target.value)}
                                placeholder="Nome do familiar"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Parentesco
                              </label>
                              <input
                                type="text"
                                value={familiar.parentesco}
                                onChange={(e) => atualizarFamiliar(familiar.id, "parentesco", e.target.value)}
                                placeholder="Ex: Filho(a), Esposo(a)"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold text-gray-600 mb-1">
                                Aniversário
                              </label>
                              <div className="flex gap-2">
                                <input
                                  type="date"
                                  value={familiar.dataAniversario}
                                  onChange={(e) => atualizarFamiliar(familiar.id, "dataAniversario", e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                />
                                <button
                                  onClick={() => removerFamiliar(familiar.id)}
                                  className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={fecharModal}
                  className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-all duration-300 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  onClick={salvarCliente}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-105 font-semibold"
                >
                  {clienteEditando ? "Atualizar" : "Salvar"}
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
                  Tem certeza que quer excluir este cliente? Esta ação não pode ser desfeita.
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
