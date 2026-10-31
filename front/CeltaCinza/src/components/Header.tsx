import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import "./Header.css";
import type { UsuarioLogado, Perfil} from "../types/UsuarioLogado"

interface HeaderProps {
    usuario: UsuarioLogado;
    onLogout: () => void;
}

interface LinkItem {
    label: string;
    to: string;
    end?: boolean;
}

const LINKS: Record<Perfil, LinkItem[]> = {
    CLIENTE: [
        { label: "Meus pedidos", to: "/pedidos", end: true },
        { label: "Novo pedido", to: "/pedidos/novo" },
        { label: "Meu perfil", to: "/perfil" },
    ],
    AGENTE: [
        { label: "Pedidos recebidos", to: "/recebidos" },
        { label: "Meu perfil", to: "/perfil" },
    ],
};

export default function Header({ usuario, onLogout }: HeaderProps) {
    return (
        <header className="header">
            <NavLink to="/" className="header__brand" aria-label="CeltaPreto - início">
                <img src={logo} alt="" className="header__logo" />
            </NavLink>

            <nav className="header__nav" aria-label="Navegação principal">
                {LINKS[usuario.perfil].map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        end={link.end}
                        className={({ isActive }) =>
                            isActive ? "header__link header__link--active" : "header__link"
                        }
                    >
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            <div className="header__user">
                <span className="header__username">{usuario.nome}</span>
                <button type="button" className="header__logout" onClick={onLogout}>
                    Sair
                </button>
            </div>
        </header>
    );
}