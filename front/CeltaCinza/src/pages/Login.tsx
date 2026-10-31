import { useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { login } from "../services/authService";
import type { UsuarioLogado } from "../types/UsuarioLogado";
import "./Auth.css";

interface LoginProps {
    onLogin: (usuario: UsuarioLogado) => void;
}

export default function Login({ onLogin }: LoginProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const acabouDeCadastrar = (location.state as { cadastrado?: boolean } | null)?.cadastrado;

    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [erro, setErro] = useState("");
    const [enviando, setEnviando] = useState(false);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!usuario.trim() || !senha) {
            setErro("Informe usuário e senha.");
            return;
        }

        setEnviando(true);
        setErro("");
        try {
            const resposta = await login(usuario.trim(), senha);
            localStorage.setItem("token", resposta.token);
            onLogin(resposta.usuario);
            navigate(resposta.usuario.perfil === "AGENTE" ? "/recebidos" : "/pedidos", { replace: true });
        } catch (err) {
            const credenciaisInvalidas = err instanceof Error && err.message === "CREDENCIAIS_INVALIDAS";
            setErro(
                credenciaisInvalidas
                    ? "Usuário ou senha inválidos."
                    : "Não foi possível entrar. Tente novamente em instantes.",
            );
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="auth">
            <form className="auth__card" onSubmit={handleSubmit} noValidate>
                <div className="auth__logo">CeltaCinza</div>
                <h1 className="auth__titulo">Entrar</h1>

                {acabouDeCadastrar && (
                    <p className="auth__sucesso" role="status">
                        Conta criada! Entre com seu usuário e senha.
                    </p>
                )}

                <label htmlFor="usuario">Usuário</label>
                <input
                    id="usuario"
                    className="campo"
                    autoComplete="username"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                />

                <label htmlFor="senha">Senha</label>
                <input
                    id="senha"
                    type="password"
                    className="campo"
                    autoComplete="current-password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />

                {erro && (
                    <p className="auth__erro" role="alert">
                        {erro}
                    </p>
                )}

                <div className="auth__acao">
                    <Button type="submit" fullWidth disabled={enviando}>
                        {enviando ? "Entrando..." : "Entrar"}
                    </Button>
                </div>

                <p className="auth__link">
                    <Link to="/cadastro">Criar conta</Link>
                </p>
            </form>
        </div>
    );
}