import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import api from "../services/api"

export default function Cabecalho() {
  const [dono, setDono] = useState(null)
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function carregarDono() {
      try {
        const resp = await api.get("/eu")
        setDono(resp.data)
      } catch (e) {
        setErro(e.response?.status === 401
          ? "Chave inválida ou ausente."
          : "Não foi possível carregar seus dados.")
      }
    }
    carregarDono()
  }, [])

  return (
<header className="topo">
  <Link to="/"><h1>Perdeu & Achou</h1></Link>
  {erro && <span className="saudacao">{erro}</span>}
  {dono && <span className="saudacao">Olá, {dono.nome}</span>}
</header>
  )
}