import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../services/api"
import ItemForm from "../components/ItemForm"

export default function EditarItem() {
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  useEffect(() => {
    async function carregarItem() {
      try {
        const resp = await api.get(`/itens/${id}`)
        setItem(resp.data)
      } catch (e) {
        setErro(e.response?.status === 404
          ? "Item não encontrado."
          : "Não foi possível carregar o item.")
      } finally {
        setCarregando(false)
      }
    }
    carregarItem()
  }, [id])

  async function salvar(dados) {
    await api.put(`/itens/${id}`, dados)
  }

  if (carregando) return <p>Carregando item...</p>
  if (erro) return <p>{erro}</p>

  return <ItemForm titulo="Editar item" dadosIniciais={item} onSubmit={salvar} />
}