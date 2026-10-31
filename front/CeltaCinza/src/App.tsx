import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import type { UsuarioLogado } from "./types/UsuarioLogado";

import Layout from "./components/Layout";
import RotaProtegida from "./components/RotaProtegida";

import MeusPedidos from "./pages/MeusPedidos";
import DetalhePedido from "./pages/DetalhePedido";
import NovoPedido from "./pages/NovoPedido";
import Recebidos from "./pages/Recebidos";
import Contratos from "./pages/Contratos";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Perfil from "./pages/Perfil";

export default function App() {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>({
    nome: "Cliente",
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
            </Route>

            {/* agente */}
            <Route element={
              <RotaProtegida usuario={usuario} perfilPermitido="AGENTE" />
            }>
              <Route path="/recebidos" element={<Recebidos />} />
              <Route path="/contratos" element={<Contratos />} />
            </Route>

            {/* os dois */}
            <Route path="/perfil" element={<Perfil />} />
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