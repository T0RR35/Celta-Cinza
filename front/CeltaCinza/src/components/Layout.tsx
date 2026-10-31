import { Outlet } from "react-router-dom";
import Header from "./Header";
import type { UsuarioLogado } from "../types/UsuarioLogado";
import "./Layout.css";

interface LayoutProps {
    usuario: UsuarioLogado;
    onLogout: () => void;
}

export default function Layout({ usuario, onLogout }: LayoutProps) {
    return (
        <div className="layout">
            <Header usuario={usuario} onLogout={onLogout} />
            <main className="layout__content">
                <Outlet />
            </main>
            <footer className="layout__footer">CeltaCinza © 2026</footer>
        </div>
    );
}