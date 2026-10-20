import { BrowserRouter, Routes, Route } from "react-router-dom"
import Cabecalho from "./components/Cabecalho"
import Home from "./pages/Home"
import ItemDetalhe from "./pages/ItemDetalhe"
import NovoItem from "./pages/NovoItem"
import EditarItem from "./pages/EditarItem"

export default function App() {
  return (
    <BrowserRouter>
      <Cabecalho />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/item/:id" element={<ItemDetalhe />} />
        <Route path="/novo" element={<NovoItem />} />
        <Route path="/editar/:id" element={<EditarItem />} />
      </Routes>
    </BrowserRouter>
  )
}