import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"

const vazio = { nome: "", descricao: "", categoria: "", local: "", data_encontrado: "" }

function mensagemDeErro(e) {
  const detail = e.response?.data?.detail
  if (Array.isArray(detail)) return detail.map(d => d.msg).join(" | ")
  if (typeof detail === "string") return detail
  return "Não foi possível salvar o item."
}

export default function ItemForm({ dadosIniciais, onSubmit, titulo }) {
  const navigate = useNavigate()
  const [dados, setDados] = useState(vazio)
  const [categorias, setCategorias] = useState([])
  const [locais, setLocais] = useState([])
  const [erro, setErro] = useState("")
  const [sucesso, setSucesso] = useState("")
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    async function carregarOpcoes() {
      try {
        const [respCat, respLoc] = await Promise.all([
          api.get("/categorias"),
          api.get("/locais")
        ])
        setCategorias(respCat.data)
        setLocais(respLoc.data)
      } catch (e) {
        setErro("Não foi possível carregar categorias e locais.")
      }
    }
    carregarOpcoes()
  }, [])

  useEffect(() => {
    if (dadosIniciais) {
      setDados({
        nome: dadosIniciais.nome,
        descricao: dadosIniciais.descricao,
        categoria: dadosIniciais.categoria,
        local: dadosIniciais.local,
        data_encontrado: dadosIniciais.data_encontrado
      })
    }
  }, [dadosIniciais])

  function handleChange(e) {
    setDados({ ...dados, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro("")
    setSucesso("")
    setEnviando(true)
    try {
      await onSubmit(dados)
      setSucesso("Item salvo com sucesso!")
      setTimeout(() => navigate("/"), 1000)
    } catch (e) {
      setErro(mensagemDeErro(e))
      setEnviando(false)
    }
  }

  return (
    <main>
      <h2>{titulo}</h2>
        <form onSubmit={handleSubmit} className="formulario">
        <label>
          Nome
          <input name="nome" value={dados.nome} onChange={handleChange} required />
        </label>

        <label>
          Descrição
          <textarea name="descricao" value={dados.descricao} onChange={handleChange} required />
        </label>

        <label>
          Categoria
          <select name="categoria" value={dados.categoria} onChange={handleChange} required>
            <option value="">Selecione...</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label>
          Local
          <select name="local" value={dados.local} onChange={handleChange} required>
            <option value="">Selecione...</option>
            {locais.map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </label>

        <label>
          Data em que foi encontrado
          <input type="date" name="data_encontrado" value={dados.data_encontrado} onChange={handleChange} required />
        </label>

        {erro && <p className="mensagem erro">{erro}</p>}
        {sucesso && <p className="mensagem sucesso">{sucesso}</p>}

        <div className="acoes">
        <button type="submit" className="btn" disabled={enviando}>
            {enviando ? "Salvando..." : "Salvar"}
        </button>
        <button type="button" className="btn secundario" onClick={() => navigate("/")}>
            Cancelar
        </button>
        </div>
      </form>
    </main>
  )
}