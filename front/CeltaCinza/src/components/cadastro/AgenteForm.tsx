import { useState, type FormEvent } from "react";
import Button from "../Button";
import type { CadastroFormProps, TipoConta } from "../../types/Auth";

interface AgenteFormProps extends CadastroFormProps {
    tipoConta: Exclude<TipoConta, "CLIENTE">; // "EMPRESA" ou "BANCO"
}

export default function AgenteForm({ tipoConta, enviando, erro, onSubmit }: AgenteFormProps) {
    const [nome, setNome] = useState("");
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [erroLocal, setErroLocal] = useState("");

    const rotuloNome = tipoConta === "BANCO" ? "Nome do banco" : "Nome da empresa";

    function validar(): string {
        if (!nome.trim() || !usuario.trim() || !senha) {
            return "Preencha todos os campos.";
        }
        if (senha.length < 6) {
            return "A senha deve ter pelo menos 6 caracteres.";
        }
        return "";
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const mensagem = validar();
        setErroLocal(mensagem);
        if (mensagem) return;

        onSubmit({
            tipoConta,
            nome: nome.trim(),
            usuario: usuario.trim(),
            senha,
        });
    }

    const mensagem = erroLocal || erro;

    return (
        <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="nome">{rotuloNome}</label>
            <input id="nome" className="campo" value={nome} onChange={(e) => setNome(e.target.value)} />

            <div className="auth__linha">
                <div>
                    <label htmlFor="usuario">Usuário</label>
                    <input id="usuario" className="campo" autoComplete="username" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="senha">Senha</label>
                    <input id="senha" type="password" className="campo" autoComplete="new-password" value={senha} onChange={(e) => setSenha(e.target.value)} />
                </div>
            </div>

            {mensagem && (
                <p className="auth__erro" role="alert">
                    {mensagem}
                </p>
            )}

            <div className="auth__acao">
                <Button type="submit" fullWidth disabled={enviando}>
                    {enviando ? "Cadastrando..." : "Cadastrar"}
                </Button>
            </div>
        </form>
    );
}