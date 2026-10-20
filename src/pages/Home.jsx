import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"

export default function Home() {
  const [itens, setItens] = useState([])
  const [categorias, setCategorias] = useState([])
  const [locais, setLocais] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  const [busca, setBusca] = useState("")
  const [status, setStatus] = useState("")
  const [categoria, setCategoria] = useState("")
  const [local, setLocal] = useState("")

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
    const timer = setTimeout(async () => {
      setCarregando(true)
      setErro("")
      try {
        const params = {}
        if (busca) params.busca = busca
        if (status) params.status = status
        if (categoria) params.categoria = categoria
        if (local) params.local = local

        const resp = await api.get("/itens", { params })
        setItens(resp.data)
      } catch (e) {
        if (e.response?.status === 401) {
          setErro("Não foi possível carregar. Verifique sua chave.")
        } else {
          const detail = e.response?.data?.detail
          setErro(typeof detail === "string" ? detail : "Erro ao carregar os itens.")
        }
      } finally {
        setCarregando(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [busca, status, categoria, local])

  return (
    <main>
      <div className="barra-titulo">
        <h2>Itens encontrados</h2>
        <Link to="/novo" className="btn">+ Novo item</Link>
      </div>

      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por nome ou descrição..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />

        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="aguardando">Aguardando</option>
          <option value="devolvido">Devolvido</option>
        </select>

        <select value={categoria} onChange={e => setCategoria(e.target.value)}>
          <option value="">Todas as categorias</option>
          {categorias.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select value={local} onChange={e => setLocal(e.target.value)}>
          <option value="">Todos os locais</option>
          {locais.map(l => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {carregando && <p>Carregando itens...</p>}
      {!carregando && erro && <p className="mensagem erro">{erro}</p>}
      {!carregando && !erro && itens.length === 0 && <p>Nenhum item encontrado.</p>}

      <div className="lista">
        {!carregando && !erro && itens.map(item => (
          <Link key={item.id} to={`/item/${item.id}`} className="card">
            <h3>{item.nome}</h3>
            <p className="meta">{item.categoria} · {item.local}</p>
            <span className={`status ${item.status}`}>{item.status}</span>
          </Link>
        ))}
      </div>
    </main>
  )
}