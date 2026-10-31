import { Navigate, Outlet } from "react-router-dom";
import type { UsuarioLogado } from "../types/UsuarioLogado";

interface RotaProtegidaProps {
    usuario: UsuarioLogado | null;
    perfilPermitido?: "CLIENTE" | "AGENTE";
}

export default function RotaProtegida({
    usuario,
    perfilPermitido,
}: RotaProtegidaProps) {
    if (!usuario) {
        return <Navigate to="/login" replace />;
    }

    if (perfilPermitido && usuario.perfil !== perfilPermitido) {
        return (
            <Navigate
                to={usuario.perfil === "AGENTE" ? "/recebidos" : "/pedidos"}
                replace
            />
        );
    }

    return <Outlet />;
}