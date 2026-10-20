import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import api from "../services/api"

function formatarData(data) {
  if (!data) return ""
  const [ano, mes, dia] = data.split("-")
  return `${dia}/${mes}/${ano}`
}

function mensagemDeErro(e, padrao) {
  const detail = e.response?.data?.detail
  if (Array.isArray(detail)) return detail.map(d => d.msg).join(" | ")
  if (typeof detail === "string") return detail
  return padrao
}

export default function ItemDetalhe() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [item, setItem] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)
  const [devolvidoPara, setDevolvidoPara] = useState("")
  const [mensagem, setMensagem] = useState("")

  useEffect(() => {
    async function carregarItem() {
      try {
        const resp = await api.get(`/itens/${id}`)
        setItem(resp.data)
      } catch (e) {
        setErro(e.response?.status === 404
          ? "Item não encontrado."
          : mensagemDeErro(e, "Não foi possível carregar o item."))
      } finally {
        setCarregando(false)
      }
    }
    carregarItem()
  }, [id])

  async function devolver(e) {
    e.preventDefault()
    setMensagem("")
    try {
      const resp = await api.patch(`/itens/${id}/devolver`, {
        devolvido_para: devolvidoPara
      })
      setItem(resp.data)
      setDevolvidoPara("")
    } catch (e) {
      setMensagem(mensagemDeErro(e, "Não foi possível marcar como devolvido."))
    }
  }

  async function excluir() {
    setMensagem("")
    try {
      await api.delete(`/itens/${id}`)
      navigate("/")
    } catch (e) {
      setMensagem(mensagemDeErro(e, "Não foi possível excluir o item."))
      setConfirmandoExclusao(false)
    }
  }

  if (carregando) return <p>Carregando item...</p>
  if (erro) return (
    <main>
      <p>{erro}</p>
        <Link to="/" className="voltar">← Voltar</Link>
    </main>
  )

  return (
    <main>
        <Link to="/" className="voltar">← Voltar</Link>

      <h2>{item.nome}</h2>
      <span className={`status ${item.status}`}>{item.status}</span>

      <p>Descrição: {item.descricao}</p>
      <p>Categoria: {item.categoria}</p>
      <p>Local: {item.local}</p>
      <p>Encontrado em: {formatarData(item.data_encontrado)}</p>

      {item.status === "devolvido" && (
        <>
          <p>Devolvido para: {item.devolvido_para}</p>
          <p>Data da devolução: {formatarData(item.data_devolucao)}</p>
        </>
      )}

        {mensagem && <p className="mensagem erro">{mensagem}</p>}

        <div className="acoes">
        <Link to={`/editar/${item.id}`} className="btn secundario">Editar</Link>
        <button className="btn perigo" onClick={() => setConfirmandoExclusao(true)}>Excluir</button>
        </div>

        {confirmandoExclusao && (
        <div className="confirmacao">
            <p>Tem certeza que deseja excluir?</p>
            <button className="btn perigo" onClick={excluir}>Excluir</button>
            <button className="btn secundario" onClick={() => setConfirmandoExclusao(false)}>Cancelar</button>
        </div>
        )}

        {item.status === "aguardando" && (
        <form onSubmit={devolver} className="devolucao">
            <h3>Marcar como devolvido</h3>
            <input
            placeholder="Nome de quem recebeu"
            value={devolvidoPara}
            onChange={e => setDevolvidoPara(e.target.value)}
            required
            />
            <button type="submit" className="btn">Confirmar</button>
        </form>
        )}

      {item.status === "aguardando" && (
        <form onSubmit={devolver}>
          <h3>Marcar como devolvido</h3>
          <input
            placeholder="Nome de quem recebeu"
            value={devolvidoPara}
            onChange={e => setDevolvidoPara(e.target.value)}
            required
          />
          <button type="submit">Confirmar</button>
        </form>
      )}
    </main>
  )
}