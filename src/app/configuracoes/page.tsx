"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Bell, MessageCircle, Palette, Cloud, Save, Download, Upload, Check } from "lucide-react"
import Link from "next/link"

interface ConfiguracoesMarca {
  nomeLoja: string
  corPrimaria: string
  corSecundaria: string
  logoUrl: string
}

interface ConfiguracoesNotificacoes {
  aniversarios: boolean
  pedidosPendentes: boolean
  estoqueMinimo: boolean
  diasAntesAniversario: number
}

interface ConfiguracoesWhatsApp {
  ativo: boolean
  numeroWhatsApp: string
  mensagemAniversario: string
  mensagemPedido: string
}

export default function ConfiguracoesPage() {
  const [tema, setTema] = useState<"claro" | "escuro">("claro")
  const [abaSelecionada, setAbaSelecionada] = useState<"notificacoes" | "whatsapp" | "marca" | "backup">("notificacoes")
  const [salvando, setSalvando] = useState(false)
  const [mensagemSucesso, setMensagemSucesso] = useState("")

  // Estados de configurações
  const [configMarca, setConfigMarca] = useState<ConfiguracoesMarca>({
    nomeLoja: "Minha Confeitaria",
    corPrimaria: "#ec4899",
    corSecundaria: "#a855f7",
    logoUrl: ""
  })

  const [configNotificacoes, setConfigNotificacoes] = useState<ConfiguracoesNotificacoes>({
    aniversarios: true,
    pedidosPendentes: true,
    estoqueMinimo: true,
    diasAntesAniversario: 3
  })

  const [configWhatsApp, setConfigWhatsApp] = useState<ConfiguracoesWhatsApp>({
    ativo: false,
    numeroWhatsApp: "",
    mensagemAniversario: "Olá {nome}! 🎉 Feliz aniversário! Que tal comemorar com um bolo especial? Entre em contato conosco!",
    mensagemPedido: "Olá {nome}! Seu pedido de {produto} está confirmado para {data}. Obrigado pela preferência! 🧁"
  })

  useEffect(() => {
    const temaSalvo = localStorage.getItem("tema-confeitaria") as "claro" | "escuro" | null
    if (temaSalvo) setTema(temaSalvo)

    // Carregar configurações salvas
    const marcaSalva = localStorage.getItem("config-marca")
    if (marcaSalva) setConfigMarca(JSON.parse(marcaSalva))

    const notifSalvas = localStorage.getItem("config-notificacoes")
    if (notifSalvas) setConfigNotificacoes(JSON.parse(notifSalvas))

    const whatsappSalvo = localStorage.getItem("config-whatsapp")
    if (whatsappSalvo) setConfigWhatsApp(JSON.parse(whatsappSalvo))
  }, [])

  const bgClass = tema === "claro" 
    ? "bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50" 
    : "bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900"
  
  const textClass = tema === "claro" ? "text-gray-800" : "text-white"
  const cardClass = tema === "claro" ? "bg-white" : "bg-gray-800"
  const textSecondaryClass = tema === "claro" ? "text-gray-600" : "text-gray-300"
  const inputClass = tema === "claro" 
    ? "bg-white border-gray-300 text-gray-800" 
    : "bg-gray-700 border-gray-600 text-white"

  const salvarConfiguracoes = () => {
    setSalvando(true)
    
    localStorage.setItem("config-marca", JSON.stringify(configMarca))
    localStorage.setItem("config-notificacoes", JSON.stringify(configNotificacoes))
    localStorage.setItem("config-whatsapp", JSON.stringify(configWhatsApp))

    setTimeout(() => {
      setSalvando(false)
      setMensagemSucesso("Configurações salvas com sucesso!")
      setTimeout(() => setMensagemSucesso(""), 3000)
    }, 1000)
  }

  const exportarDados = () => {
    const dados = {
      clientes: localStorage.getItem("clientes-confeitaria"),
      estoque: localStorage.getItem("estoque-confeitaria"),
      produtos: localStorage.getItem("produtos-confeitaria"),
      agenda: localStorage.getItem("agenda-confeitaria"),
      financeiro: localStorage.getItem("financeiro-confeitaria"),
      catalogo: localStorage.getItem("catalogo-confeitaria"),
      configMarca: localStorage.getItem("config-marca"),
      configNotificacoes: localStorage.getItem("config-notificacoes"),
      configWhatsApp: localStorage.getItem("config-whatsapp"),
      dataBackup: new Date().toISOString()
    }

    const blob = new Blob([JSON.stringify(dados, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `backup-confeitaria-${new Date().toISOString().split('T')[0]}.json`
    link.click()
    URL.revokeObjectURL(url)

    setMensagemSucesso("Backup exportado com sucesso!")
    setTimeout(() => setMensagemSucesso(""), 3000)
  }

  const importarDados = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const dados = JSON.parse(e.target?.result as string)
        
        Object.keys(dados).forEach(key => {
          if (key !== "dataBackup" && dados[key]) {
            localStorage.setItem(key.replace("config", "config-"), dados[key])
          }
        })

        setMensagemSucesso("Backup importado com sucesso! Recarregue a página.")
        setTimeout(() => window.location.reload(), 2000)
      } catch (error) {
        alert("Erro ao importar backup. Verifique o arquivo.")
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className={`min-h-screen ${bgClass} p-4 md:p-8 transition-colors duration-300`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <button className={`${cardClass} p-3 rounded-xl shadow-lg hover:shadow-xl transition-all`}>
              <ArrowLeft className={`w-6 h-6 ${textClass}`} />
            </button>
          </Link>
          <div>
            <h1 className={`text-3xl md:text-4xl font-bold ${textClass}`}>
              ⚙️ Configurações
            </h1>
            <p className={`${textSecondaryClass}`}>
              Personalize seu sistema
            </p>
          </div>
        </div>

        {/* Mensagem de Sucesso */}
        {mensagemSucesso && (
          <div className="mb-6 bg-green-500 text-white p-4 rounded-xl flex items-center gap-3 shadow-lg animate-pulse">
            <Check className="w-6 h-6" />
            <span className="font-semibold">{mensagemSucesso}</span>
          </div>
        )}

        {/* Abas */}
        <div className={`${cardClass} rounded-2xl shadow-xl p-2 mb-6`}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <button
              onClick={() => setAbaSelecionada("notificacoes")}
              className={`p-4 rounded-xl font-semibold transition-all ${
                abaSelecionada === "notificacoes"
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg"
                  : `${textSecondaryClass} hover:bg-gray-100 dark:hover:bg-gray-700`
              }`}
            >
              <Bell className="w-5 h-5 mx-auto mb-2" />
              Notificações
            </button>
            <button
              onClick={() => setAbaSelecionada("whatsapp")}
              className={`p-4 rounded-xl font-semibold transition-all ${
                abaSelecionada === "whatsapp"
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                  : `${textSecondaryClass} hover:bg-gray-100 dark:hover:bg-gray-700`
              }`}
            >
              <MessageCircle className="w-5 h-5 mx-auto mb-2" />
              WhatsApp
            </button>
            <button
              onClick={() => setAbaSelecionada("marca")}
              className={`p-4 rounded-xl font-semibold transition-all ${
                abaSelecionada === "marca"
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                  : `${textSecondaryClass} hover:bg-gray-100 dark:hover:bg-gray-700`
              }`}
            >
              <Palette className="w-5 h-5 mx-auto mb-2" />
              Marca
            </button>
            <button
              onClick={() => setAbaSelecionada("backup")}
              className={`p-4 rounded-xl font-semibold transition-all ${
                abaSelecionada === "backup"
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg"
                  : `${textSecondaryClass} hover:bg-gray-100 dark:hover:bg-gray-700`
              }`}
            >
              <Cloud className="w-5 h-5 mx-auto mb-2" />
              Backup
            </button>
          </div>
        </div>

        {/* Conteúdo das Abas */}
        <div className={`${cardClass} rounded-2xl shadow-xl p-6 md:p-8`}>
          {/* ABA NOTIFICAÇÕES */}
          {abaSelecionada === "notificacoes" && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-bold ${textClass} mb-6`}>
                🔔 Notificações Automáticas
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 dark:from-pink-900/20 dark:to-purple-900/20">
                  <div>
                    <p className={`font-semibold ${textClass}`}>Aniversários de Clientes</p>
                    <p className={`text-sm ${textSecondaryClass}`}>Receba alertas de aniversários próximos</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configNotificacoes.aniversarios}
                      onChange={(e) => setConfigNotificacoes({...configNotificacoes, aniversarios: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-pink-500 peer-checked:to-purple-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
                  <div>
                    <p className={`font-semibold ${textClass}`}>Pedidos Pendentes</p>
                    <p className={`text-sm ${textSecondaryClass}`}>Alertas de pedidos próximos da data de entrega</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configNotificacoes.pedidosPendentes}
                      onChange={(e) => setConfigNotificacoes({...configNotificacoes, pedidosPendentes: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-blue-500 peer-checked:to-indigo-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                  <div>
                    <p className={`font-semibold ${textClass}`}>Estoque Mínimo</p>
                    <p className={`text-sm ${textSecondaryClass}`}>Avisos quando ingredientes estiverem acabando</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configNotificacoes.estoqueMinimo}
                      onChange={(e) => setConfigNotificacoes({...configNotificacoes, estoqueMinimo: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-600"></div>
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
                  <label className={`block font-semibold ${textClass} mb-3`}>
                    Dias de Antecedência para Aniversários
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={configNotificacoes.diasAntesAniversario}
                    onChange={(e) => setConfigNotificacoes({...configNotificacoes, diasAntesAniversario: parseInt(e.target.value)})}
                    className={`w-full p-3 rounded-xl border-2 ${inputClass} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                  />
                  <p className={`text-sm ${textSecondaryClass} mt-2`}>
                    Você será notificado {configNotificacoes.diasAntesAniversario} dias antes do aniversário
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ABA WHATSAPP */}
          {abaSelecionada === "whatsapp" && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-bold ${textClass} mb-6`}>
                📱 Integração WhatsApp
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                  <div>
                    <p className={`font-semibold ${textClass}`}>Ativar Integração WhatsApp</p>
                    <p className={`text-sm ${textSecondaryClass}`}>Envie mensagens automáticas aos clientes</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configWhatsApp.ativo}
                      onChange={(e) => setConfigWhatsApp({...configWhatsApp, ativo: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-14 h-7 bg-gray-300 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-green-500 peer-checked:to-emerald-600"></div>
                  </label>
                </div>

                {configWhatsApp.ativo && (
                  <>
                    <div>
                      <label className={`block font-semibold ${textClass} mb-3`}>
                        Número do WhatsApp (com DDD)
                      </label>
                      <input
                        type="tel"
                        placeholder="Ex: 11999999999"
                        value={configWhatsApp.numeroWhatsApp}
                        onChange={(e) => setConfigWhatsApp({...configWhatsApp, numeroWhatsApp: e.target.value})}
                        className={`w-full p-3 rounded-xl border-2 ${inputClass} focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      />
                    </div>

                    <div>
                      <label className={`block font-semibold ${textClass} mb-3`}>
                        Mensagem de Aniversário
                      </label>
                      <textarea
                        rows={4}
                        value={configWhatsApp.mensagemAniversario}
                        onChange={(e) => setConfigWhatsApp({...configWhatsApp, mensagemAniversario: e.target.value})}
                        className={`w-full p-3 rounded-xl border-2 ${inputClass} focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      />
                      <p className={`text-sm ${textSecondaryClass} mt-2`}>
                        Use {"{nome}"} para inserir o nome do cliente
                      </p>
                    </div>

                    <div>
                      <label className={`block font-semibold ${textClass} mb-3`}>
                        Mensagem de Confirmação de Pedido
                      </label>
                      <textarea
                        rows={4}
                        value={configWhatsApp.mensagemPedido}
                        onChange={(e) => setConfigWhatsApp({...configWhatsApp, mensagemPedido: e.target.value})}
                        className={`w-full p-3 rounded-xl border-2 ${inputClass} focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                      />
                      <p className={`text-sm ${textSecondaryClass} mt-2`}>
                        Use {"{nome}"}, {"{produto}"} e {"{data}"} para personalizar
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700">
                      <p className={`text-sm ${textClass}`}>
                        💡 <strong>Dica:</strong> As mensagens serão abertas no WhatsApp Web. Você precisará clicar em "Enviar" manualmente.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* ABA MARCA */}
          {abaSelecionada === "marca" && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-bold ${textClass} mb-6`}>
                🎨 Personalização de Marca
              </h2>

              <div className="space-y-4">
                <div>
                  <label className={`block font-semibold ${textClass} mb-3`}>
                    Nome da Confeitaria
                  </label>
                  <input
                    type="text"
                    value={configMarca.nomeLoja}
                    onChange={(e) => setConfigMarca({...configMarca, nomeLoja: e.target.value})}
                    className={`w-full p-3 rounded-xl border-2 ${inputClass} focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={`block font-semibold ${textClass} mb-3`}>
                      Cor Primária
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={configMarca.corPrimaria}
                        onChange={(e) => setConfigMarca({...configMarca, corPrimaria: e.target.value})}
                        className="w-20 h-12 rounded-xl cursor-pointer"
                      />
                      <input
                        type="text"
                        value={configMarca.corPrimaria}
                        onChange={(e) => setConfigMarca({...configMarca, corPrimaria: e.target.value})}
                        className={`flex-1 p-3 rounded-xl border-2 ${inputClass} focus:ring-2 focus:ring-pink-500 focus:border-transparent`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={`block font-semibold ${textClass} mb-3`}>
                      Cor Secundária
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="color"
                        value={configMarca.corSecundaria}
                        onChange={(e) => setConfigMarca({...configMarca, corSecundaria: e.target.value})}
                        className="w-20 h-12 rounded-xl cursor-pointer"
                      />
                      <input
                        type="text"
                        value={configMarca.corSecundaria}
                        onChange={(e) => setConfigMarca({...configMarca, corSecundaria: e.target.value})}
                        className={`flex-1 p-3 rounded-xl border-2 ${inputClass} focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className={`block font-semibold ${textClass} mb-3`}>
                    URL da Logo (opcional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://exemplo.com/logo.png"
                    value={configMarca.logoUrl}
                    onChange={(e) => setConfigMarca({...configMarca, logoUrl: e.target.value})}
                    className={`w-full p-3 rounded-xl border-2 ${inputClass} focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                  />
                </div>

                <div className="p-6 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600">
                  <p className={`font-semibold ${textClass} mb-4`}>Preview das Cores:</p>
                  <div className="flex gap-4">
                    <div 
                      className="flex-1 h-24 rounded-xl shadow-lg flex items-center justify-center text-white font-bold"
                      style={{background: `linear-gradient(135deg, ${configMarca.corPrimaria}, ${configMarca.corSecundaria})`}}
                    >
                      {configMarca.nomeLoja}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ABA BACKUP */}
          {abaSelecionada === "backup" && (
            <div className="space-y-6">
              <h2 className={`text-2xl font-bold ${textClass} mb-6`}>
                ☁️ Backup na Nuvem
              </h2>

              <div className="space-y-4">
                <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-2 border-blue-200 dark:border-blue-700">
                  <h3 className={`font-bold ${textClass} mb-3 flex items-center gap-2`}>
                    <Cloud className="w-6 h-6" />
                    Exportar Dados
                  </h3>
                  <p className={`${textSecondaryClass} mb-4`}>
                    Faça backup de todos os seus dados (clientes, estoque, pedidos, etc.)
                  </p>
                  <button
                    onClick={exportarDados}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-4 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-3"
                  >
                    <Download className="w-5 h-5" />
                    Exportar Backup (JSON)
                  </button>
                </div>

                <div className="p-6 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-700">
                  <h3 className={`font-bold ${textClass} mb-3 flex items-center gap-2`}>
                    <Upload className="w-6 h-6" />
                    Importar Dados
                  </h3>
                  <p className={`${textSecondaryClass} mb-4`}>
                    Restaure um backup anterior. Atenção: isso substituirá todos os dados atuais!
                  </p>
                  <label className="w-full bg-gradient-to-r from-purple-500 to-pink-600 text-white p-4 rounded-xl font-semibold hover:shadow-xl transition-all flex items-center justify-center gap-3 cursor-pointer">
                    <Upload className="w-5 h-5" />
                    Selecionar Arquivo de Backup
                    <input
                      type="file"
                      accept=".json"
                      onChange={importarDados}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-700">
                  <p className={`text-sm ${textClass}`}>
                    ⚠️ <strong>Importante:</strong> Faça backups regulares dos seus dados. Recomendamos exportar semanalmente.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Botão Salvar */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={salvarConfiguracoes}
            disabled={salvando}
            className={`bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 ${
              salvando ? "opacity-50 cursor-not-allowed" : "hover:scale-105"
            }`}
          >
            <Save className="w-6 h-6" />
            {salvando ? "Salvando..." : "Salvar Configurações"}
          </button>
        </div>
      </div>
    </div>
  )
}
