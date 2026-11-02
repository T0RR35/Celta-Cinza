import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import type { UsuarioLogado } from "./types/UsuarioLogado";

import Layout from "./components/Layout";
import RotaProtegida from "./components/RotaProtegida";

import MeusPedidos from "./pages/MeusPedidos";
import DetalhePedido from "./pages/DetalhePedido";
import EditarPedido from "./pages/EditarPedido";
import NovoPedido from "./pages/NovoPedido";
import Recebidos from "./pages/Recebidos";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import ClientePerfil from "./pages/ClientePerfil";
import AgentePerfil from "./pages/AgentePerfil";

const TOKEN_KEY = "token";
const USUARIO_KEY = "usuario";

function lerUsuarioSalvo(): UsuarioLogado | null {
  const token = localStorage.getItem(TOKEN_KEY);
  const salvo = localStorage.getItem(USUARIO_KEY);
  if (!token || !salvo) return null;

  try {
    const usuario = JSON.parse(salvo) as UsuarioLogado;
    if (usuario?.perfil === "CLIENTE" || usuario?.perfil === "AGENTE") {
      return usuario;
    }
  } catch {
  }
  return null;
}

export default function App() {
  const [usuario, setUsuario] = useState<UsuarioLogado | null>(lerUsuarioSalvo);

  const inicio = usuario?.perfil === "AGENTE" ? "/recebidos" : "/pedidos";

  function handleLogin(usuarioLogado: UsuarioLogado) {
    localStorage.setItem(USUARIO_KEY, JSON.stringify(usuarioLogado));
    setUsuario(usuarioLogado);
  }

  function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USUARIO_KEY);
    setUsuario(null);
  }

  function handleNomeAtualizado(nome: string) {
    if (!usuario) return;
    const atualizado = { ...usuario, nome };
    localStorage.setItem(USUARIO_KEY, JSON.stringify(atualizado));
    setUsuario(atualizado);
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/cadastro" element={<Cadastro />} />

        {/* ve se ta logado */}
        <Route element={<RotaProtegida usuario={usuario} />}>
          <Route
            element={
              <Layout
                usuario={usuario as UsuarioLogado}
                onLogout={handleLogout}
              />
            }
          >
            <Route
              path="/perfil"
              element={
                usuario?.perfil === "AGENTE" ? (
                  <AgentePerfil onNomeAtualizado={handleNomeAtualizado} />
                ) : (
                  <ClientePerfil
                    onNomeAtualizado={handleNomeAtualizado}
                    onContaExcluida={handleLogout}
                  />
                )
              }
            />

            {/* cliente */}
            <Route element={
              <RotaProtegida usuario={usuario} perfilPermitido="CLIENTE" />
            }>
              <Route path="/pedidos" element={<MeusPedidos />} />
              <Route path="/pedidos/novo" element={<NovoPedido />} />
              <Route path="/pedidos/:id" element={<DetalhePedido />} />
              <Route path="/pedidos/:id/editar" element={<EditarPedido />} />
            </Route>

            {/* agente */}
            <Route element={
              <RotaProtegida usuario={usuario} perfilPermitido="AGENTE" />
            }>
              <Route path="/recebidos" element={<Recebidos />} />
              <Route path="/recebidos/:id/editar" element={<EditarPedido />} />
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
