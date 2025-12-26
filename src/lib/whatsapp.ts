// Funções auxiliares para integração WhatsApp

interface ConfigWhatsApp {
  ativo: boolean
  numeroWhatsApp: string
  mensagemAniversario: string
  mensagemPedido: string
}

export function getConfigWhatsApp(): ConfigWhatsApp | null {
  const config = localStorage.getItem("config-whatsapp")
  if (!config) return null
  
  try {
    return JSON.parse(config)
  } catch {
    return null
  }
}

export function enviarMensagemWhatsApp(numero: string, mensagem: string) {
  // Remove caracteres não numéricos do número
  const numeroLimpo = numero.replace(/\D/g, "")
  
  // Codifica a mensagem para URL
  const mensagemCodificada = encodeURIComponent(mensagem)
  
  // Abre WhatsApp Web com a mensagem pré-preenchida
  const url = `https://wa.me/${numeroLimpo}?text=${mensagemCodificada}`
  window.open(url, "_blank")
}

export function enviarMensagemAniversario(nomeCliente: string, telefoneCliente: string) {
  const config = getConfigWhatsApp()
  if (!config || !config.ativo) {
    alert("Configure o WhatsApp nas Configurações primeiro!")
    return
  }

  const mensagem = config.mensagemAniversario.replace("{nome}", nomeCliente)
  enviarMensagemWhatsApp(telefoneCliente, mensagem)
}

export function enviarMensagemPedido(
  nomeCliente: string, 
  telefoneCliente: string, 
  produto: string, 
  dataEntrega: string
) {
  const config = getConfigWhatsApp()
  if (!config || !config.ativo) {
    alert("Configure o WhatsApp nas Configurações primeiro!")
    return
  }

  let mensagem = config.mensagemPedido
    .replace("{nome}", nomeCliente)
    .replace("{produto}", produto)
    .replace("{data}", dataEntrega)
  
  enviarMensagemWhatsApp(telefoneCliente, mensagem)
}

export function enviarMensagemPersonalizada(telefone: string, mensagem: string) {
  enviarMensagemWhatsApp(telefone, mensagem)
}
