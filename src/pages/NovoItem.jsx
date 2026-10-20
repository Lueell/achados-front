import api from "../services/api"
import ItemForm from "../components/ItemForm"

export default function NovoItem() {
  async function cadastrar(dados) {
    await api.post("/itens", dados)
  }

  return <ItemForm titulo="Novo item" onSubmit={cadastrar} />
}