import { useState, type FormEvent } from "react";
import Button from "../Button";
import type { CadastroFormProps } from "../../types/Auth";

export default function ClienteForm({ enviando, erro, onSubmit }: CadastroFormProps) {
    const [nome, setNome] = useState("");
    const [cpf, setCpf] = useState("");
    const [rg, setRg] = useState("");
    const [endereco, setEndereco] = useState("");
    const [profissao, setProfissao] = useState("");
    const [usuario, setUsuario] = useState("");
    const [senha, setSenha] = useState("");
    const [erroLocal, setErroLocal] = useState("");

    function validar(): string {
        const obrigatorios = [nome, cpf, rg, endereco, profissao, usuario];
        if (obrigatorios.some((v) => !v.trim()) || !senha) {
            return "Preencha todos os campos.";
        }
        if (cpf.replace(/\D/g, "").length !== 11) {
            return "O CPF deve ter 11 dígitos.";
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
            tipoConta: "CLIENTE",
            nome: nome.trim(),
            cpf: cpf.replace(/\D/g, ""),
            rg: rg.trim(),
            endereco: endereco.trim(),
            profissao: profissao.trim(),
            usuario: usuario.trim(),
            senha,
        });
    }

    const mensagem = erroLocal || erro;

    return (
        <form onSubmit={handleSubmit} noValidate>
            <label htmlFor="nome">Nome completo</label>
            <input id="nome" className="campo" autoComplete="name" value={nome} onChange={(e) => setNome(e.target.value)} />

            <div className="auth__linha">
                <div>
                    <label htmlFor="cpf">CPF</label>
                    <input id="cpf" className="campo" inputMode="numeric" maxLength={14} value={cpf} onChange={(e) => setCpf(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="rg">RG</label>
                    <input id="rg" className="campo" value={rg} onChange={(e) => setRg(e.target.value)} />
                </div>
            </div>

            <label htmlFor="endereco">Endereço</label>
            <input id="endereco" className="campo" autoComplete="street-address" value={endereco} onChange={(e) => setEndereco(e.target.value)} />

            <label htmlFor="profissao">Profissão</label>
            <input id="profissao" className="campo" value={profissao} onChange={(e) => setProfissao(e.target.value)} />

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