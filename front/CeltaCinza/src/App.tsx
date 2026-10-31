import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import type { UsuarioLogado } from "./types/UsuarioLogado";
import Layout from "./components/Layout";

function Placeholder({ titulo }: { titulo: string }) {
  return <h1>{titulo}</h1>;
}

export default function App() {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>({
    nome: "Cliente",
    perfil: "CLIENTE",
  });

  const inicio = usuario?.perfil === "AGENTE" ? "/recebidos" : "/pedidos";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Placeholder titulo="Entrar" />} />
        <Route path="/cadastro" element={<Placeholder titulo="Criar conta" />} />

        {/* so renderiza o layout se o user tiver logado */}
        <Route
          element={
            usuario ? (
              <Layout usuario={usuario} onLogout={() => setUsuario(null)} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        >
          {/* cliente */}
          <Route path="/pedidos" element={<Placeholder titulo="Meus pedidos" />} />
          <Route path="/pedidos/novo" element={<Placeholder titulo="Novo pedido" />} />
          <Route path="/pedidos/:id" element={<Placeholder titulo="Detalhe do pedido" />} />

          {/* agente */}
          <Route path="/recebidos" element={<Placeholder titulo="Pedidos recebidos" />} />
          <Route path="/contratos" element={<Placeholder titulo="Contratos" />} />

          {/* os dois */}
          <Route path="/perfil" element={<Placeholder titulo="Meu perfil" />} />
        </Route>

        <Route path="*" element={<Navigate to={usuario ? inicio : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}