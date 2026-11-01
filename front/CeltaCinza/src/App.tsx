import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import type { UsuarioLogado } from "./types/UsuarioLogado";

import Layout from "./components/Layout";
import RotaProtegida from "./components/RotaProtegida";

import MeusPedidos from "./pages/MeusPedidos";
import DetalhePedido from "./pages/DetalhePedido";
import NovoPedido from "./pages/NovoPedido";
import Recebidos from "./pages/Recebidos";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import ClientePerfil from "./pages/ClientePerfil";
import AgentePerfil from "./pages/AgentePerfil";

export default function App() {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>({
    nome: "cliente",
    perfil: "CLIENTE",
  });

  const inicio = usuario?.perfil === "AGENTE" ? "/recebidos" : "/pedidos";

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* ve se ta logado */}
        <Route element={<RotaProtegida usuario={usuario} />}>
          <Route
            element={
              <Layout
                usuario={usuario!}
                onLogout={() => setUsuario(null)}
              />
            }
          >
            {/* cliente */}
            <Route element={
              <RotaProtegida usuario={usuario} perfilPermitido="CLIENTE" />
            }>
              <Route path="/pedidos" element={<MeusPedidos />} />
              <Route path="/pedidos/novo" element={<NovoPedido />} />
              <Route path="/pedidos/:id" element={<DetalhePedido />} />
              <Route path="/perfil" element={<ClientePerfil />} />
            </Route>

            {/* agente */}
            <Route element={
              <RotaProtegida usuario={usuario} perfilPermitido="AGENTE" />
            }>
              <Route path="/recebidos" element={<Recebidos />} />
              <Route path="/perfil" element={<AgentePerfil />} />
            </Route>
          </Route>
        </Route>

        <Route
          path="*"
          element={<Navigate to={usuario ? inicio : "/login"} replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}